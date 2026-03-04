---
Top: "3"
title: C. 有限状态机FSM
published: 2025-08-25
category: note
series: FPGA笔记
tags: ["FPGA笔记"]
draft: false
lang: zh_CN
---

# 一、 有限状态机（FSM）基本概念

有限状态机是一种用来进行对象行为建模的数学模型。简而言之，它由有限个**状态**（State）、**输入**（Input）、**输出**（Output）以及在状态之间跳转的**转换规则**（Transition）组成。
在数字电路设计中，FSM通常被划分为三个主要逻辑块：

1. **次态逻辑（Next State Logic）：** 组合逻辑，根据当前状态和输入信号决定下一个状态是什么。
2. **状态寄存器（State Register）：** 时序逻辑，用于存储当前状态（通常由Flip-Flops组成）。
3. **输出逻辑（Output Logic）：** 组合逻辑，根据当前状态（以及可能的输入）决定输出信号。

-  **两大核心分类（面试常考）**
	1. **Moore型状态机（Moore Machine）：**
	    - **定义：** 输出**仅**取决于当前状态。
	    - **特点：** 输出相对稳定，不会受输入信号毛刺（Glitch）的直接影响；但响应速度可能比Mealy慢一个时钟周期。
	2. **Mealy型状态机（Mealy Machine）：**
	    - **定义：** 输出取决于当前状态 **和** 当前输入信号。
	    - **特点：** 对输入响应快（组合逻辑直通），但输入信号的毛刺会直接传导到输出端，产生潜在的风险。
---

# 二、 面试中需要关注的FSM考点

在面试中，仅仅知道定义是不够的。面试官通常关注你的**代码风格（Coding Style）**、**时序分析能力**以及**鲁棒性设计**。

## 1. FSM的代码写法（一段、两段 vs 三段式）

这是RTL设计（Verilog/VHDL）中最经典的问题。

- **一段式（Single Process）：** 将状态跳转和输出逻辑混在一个`always`块中。
    - _评价：_ **强烈不推荐**。代码可读性差，不利于时序约束，且输出容易产生毛刺。
- **两段式（Two Process）：** 一个`always`块处理时序逻辑（状态寄存），另一个`always`块处理组合逻辑（次态+输出）。
    - _评价：_ **中规中矩**。代码清晰，但输出通常是组合逻辑输出，可能带有毛刺。
- **三段式（Three Process）：** **面试推荐写法**。
    - 第一段：时序逻辑，描述状态寄存器（CS <= NS）。
    - 第二段：组合逻辑，描述次态跳转逻辑（NS = f(CS, Input)）。
    - 第三段：时序逻辑（或组合逻辑），描述输出。**最佳实践是将输出用寄存器打一拍（Register Output）**，可以去除毛刺并改善时序路径。
### a. 一段式状态机 (Single-Process FSM)

**定义**：将状态跳转（State Transition）、组合逻辑判断（Next State Logic）和数据输出（Output Logic）全部写在一个大的时序 `always` 块中。
```txt
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        state <= IDLE;
        out_signal <= 0;
    end else begin
        case (state)
            IDLE: begin
                if (trigger) begin
                    state <= WORK;
                    out_signal <= 1; // 输出被寄存了，无毛刺
                end
            end
            WORK: begin
                state <= IDLE;
                out_signal <= 0;
            end
        endcase
    end
end
```

- **优点**：代码极短，天然生成寄存器输出（Registered Output），无毛刺，利于时序。
- **缺点**：
    - **逻辑混杂**：状态跳转逻辑和输出逻辑混在一起，一旦状态机变得复杂（如 802.11 MAC 层的握手），代码会变得极难阅读和维护。
    - **修改困难**：如果你想改变某个状态的跳转条件，可能需要同时修改多处输出赋值。
- **工程评价**：只适合极简单的状态机（3-4 个状态以内）。在大型项目中**不推荐**作为主力风格。
---

### b. 二段式状态机 (Two-Process FSM)

**定义**：将设计分为两个 `always` 块。
1. **时序逻辑块**：负责当前状态（Current State）的更新。
2. **组合逻辑块**：负责计算下一个状态（Next State）以及**输出信号**。
```txt
// Process 1: 状态寄存器更新
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) state <= IDLE;
    else        state <= next_state;
end

// Process 2: 组合逻辑 (计算 Next State 和 Output)
always @(*) begin
    // 默认赋值防 Latch
    next_state = state;
    out_signal = 0; 

    case (state)
        IDLE: begin
            if (trigger) begin
                next_state = WORK;
                out_signal = 1; // 注意：这是组合逻辑输出！
            end
        end
        WORK: begin
            next_state = IDLE;
            out_signal = 0;
        end
    endcase
end
```

- **优点**：逻辑清晰，状态跳转与时序更新分离，非常符合教科书定义，易于理解。
- **缺点**：
    - **毛刺风险（致命伤）**：输出信号是由组合逻辑产生的。输入端的任何噪声或状态切换瞬间的竞争冒险（Race Condition）都会直接导致输出信号产生毛刺（Glitch）。
    - 如果这个信号去驱动异步复位、FIFO 写使能或时钟门控，会导致系统功能性错误。
- **工程评价**：**严禁**直接用于控制高速接口或敏感信号，除非你在模块外部再套一级寄存器。
---

### c. 三段式状态机 (Three-Process FSM) —— 工业界推荐

**定义**：将设计分为三个 `always` 块。
1. **时序逻辑块**：更新 `current_state`。
2. **组合逻辑块**：只计算 `next_state`，**不处理输出**。
3. **输出逻辑块**：专门处理输出。
    - _变体 A_：使用组合逻辑输出（回到二段式的缺点）。
    - _变体 B (推荐)_：使用时序逻辑输出（即寄存器输出）。
**代码示例 (基于寄存器输出的变体 B - Openwifi 常用风格)**：
```txt
// Process 1: 状态寄存器更新
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) current_state <= IDLE;
    else        current_state <= next_state;
end

// Process 2: 纯组合逻辑计算 Next State
always @(*) begin
    next_state = current_state; // 默认保持
    case (current_state)
        IDLE: if (trigger) next_state = WORK;
        WORK: next_state = IDLE;
        default: next_state = IDLE;
    endcase
end

// Process 3: 寄存器输出 (利用 Look-Ahead 消除延迟)
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
        out_signal <= 0;
    end else begin
        // 这里基于 next_state 判断，实现无延迟输出
        case (next_state) 
            WORK:    out_signal <= 1;
            default: out_signal <= 0;
        endcase
    end
end
```

- **优点**：
    - **代码结构最清晰**：状态跳转逻辑与输出逻辑完全解耦。
    - **时序最佳**：输出经过寄存器，无毛刺，$T_{co}$ 最小。
    - **易于维护**：修改状态跳转条件不影响输出逻辑结构，反之亦然。
- **缺点**：代码量比前两种稍多（但为了可靠性，这是值得的）。
- **工程评价**：这是 **FPGA 高级设计的黄金标准**，特别是在 Openwifi 这种复杂的通信协议栈中。
---

## 2. 状态编码方式（State Encoding）

面试官可能会问：“对于5个状态的FSM，你会选择什么编码方式？为什么？”

| **编码方式**          | **描述**             | **优点**                       | **缺点**                         | **适用场景**                        |
| ----------------- | ------------------ | ---------------------------- | ------------------------------ | ------------------------------- |
| **二进制码 (Binary)** | `000, 001, 010...` | 节省寄存器资源（N个状态需 $\log_2N$ 位）。  | 状态跳转时多位同时翻转，易产生毛刺，译码逻辑复杂（速度慢）。 | 资源受限型CPLD/FPGA。                 |
| **独热码 (One-Hot)** | `00001, 00010...`  | **速度快**（译码逻辑只需比较1位），无组合逻辑毛刺。 | 占用寄存器多（N个状态需N位）。               | **FPGA首选**（FPGA寄存器丰富，LUT适合宽输入）。 |
| **格雷码 (Gray)**    | `000, 001, 011...` | 相邻状态只有1位翻转，**功耗低**，减少亚稳态风险。  | 编码复杂，设计难度稍大。                   | 低功耗设计或多时钟域处理。                   |

## 3. 状态机的初始化与恢复（Reset & Recovery）

- **复位问题：** 所有的Flip-Flop必须连接复位信号吗？（通常建议连接，确保上电状态已知）。
- **非法状态（Illegal States）：** 如果状态机跳入了一个未定义的编码（例如One-hot码中的`01100`），会发生什么？
    - _面试满分回答：_ 代码中必须包含 `default` 分支，并在其中将状态指回 `IDLE` 或 `RESET` 状态，防止状态机“跑飞”或死锁（Lock-up）。

## 4. 消除输出毛刺（Glitch Removal）

- **问题：** Mealy机的输出直接组合了输入信号，如果输入有噪声，输出也会有噪声。
- **解法：** 使用**三段式写法**，或者在Mealy机输出后加一级寄存器（Pipeline），将其转化为类似Moore的输出特性，但这会引入一个周期的延迟（Latency）。

## 5. 经典手撕代码题

面试中常考的具体设计题目：

- **序列检测器：** 检测输入流中的特定序列（如 `10110`）。主要考察重叠（Overlapping）与非重叠检测的区别。
    
- **交通灯控制器：** 考察多状态流转和计时器的配合。
    
- **自动售货机：** 考察输入金额累加和找零逻辑。
---
