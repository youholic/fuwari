---
Top: "4"
title: D. FPGA架构：可配置逻辑块 CLB
published: 2026-03-02
category: FPGA笔记
series: FPGA笔记
tags: ["FPGA笔记"]
draft: false
lang: zh_CN
---

FPGA（现场可编程门阵列）的架构通常被称为 **“孤岛式架构” (Island-style Architecture)**：逻辑模块像一个个“小岛”漂浮在可编程连线的“海洋”中。

# 1. 可配置逻辑 块 (CLB / LAB)

这是 FPGA 的“心脏”，负责实现绝大部分逻辑功能。不同的厂商叫法不同（Xilinx 叫 CLB，Intel/Altera 叫 LAB）。

- **基本单元：** 内部通常包含 **LUT (查找表)**、**Flip-Flop (触发器)** 和 **MUX (多路选择器)**。
- **LUT (Look-Up Table)：** 这是面试核心点。LUT 本质上是一个 **小容量的 RAM**。
    - _原理：_ 如果是一个 4 输入的 LUT，它就有 $2^4 = 16$ 个存储位。当你写 `assign c = a & b;` 时，综合工具会将所有可能的真值表结果（0或1）存入这个 RAM。输入信号作为地址，输出信号就是查到的数据。
- **进位链 (Carry Chain)：** 专用的硬件线路，用于超快速地实现加法器和计数器，比通用逻辑快得多。
## A. CLB 的层级结构

CLB 并不是最小的原子单位，它是一个容器。

- **CLB (Configurable Logic Block):** 这是在 FPGA 布局布线视图中看到的方块。
- **Slice:** 一个 CLB 内部通常包含 **2 个 Slice**。Slice 是真正排列逻辑元素的地方。
    - 有趣的是，Slice 并不都是一样的。它们分为 **SLICEL (Logic)** 和 **SLICEM (Memory)**，这一点在面试中常考（后面会细说）。
## B. Slice 内部

核心组件：**LUT、Flip-Flop、MUX、Carry Chain**。
### 1. 查找表 (Look-Up Table, LUT) —— “逻辑生成器”

- **物理本质：** LUT 本质上是一个 **小型的 SRAM (静态随机存取存储器)**，而不是一堆与非门。
- **如何工作：**
    - 假设这是一个 **6输入 LUT (LUT6)**。它有 6 根地址线，意味着里面存储了 $2^6 = 64$ 位数据。
    - 当你写下 `assign y = a & b | c;` 这样的组合逻辑时，综合工具会算出所有输入情况下的输出值（真值表），并将这 64 个 0 或 1 写入这个 SRAM 中。
    - **运行过程：** 输入信号 `a, b, c` 变成了 SRAM 的地址，直接“查”出存储的数据作为输出 `y`。这就是为什么 FPGA 能够“可编程”——因为我们只是改变了 RAM 里的内容。
- **双 5 输入模式：** 一个 6 输入 LUT 通常可以被拆分成两个 5 输入 LUT 使用（只要这俩逻辑共享部分输入），这能极大地节省面积。
### 2. 触发器 (Flip-Flop, FF) —— “状态存储器”

- **功能：** 用于时序逻辑，存储 0 或 1。
- **配置灵活性：**
    - **复位：** 可以被配置为同步复位 (Sync Reset) 或异步复位 (Async Reset)。
    - **初始值：** 上电时是 0 还是 1。
    - **Latch 模式：** 某些 FF 可以被配置为 Latch（锁存器），但如前所述，除非特殊设计，一般强烈不推荐。
### 3. 进位链 (Carry Chain, CARRY4/CARRY8) —— “算术加速器”
[8. 进位链](/posts/src\content\posts\FPGA笔记\8. 进位链/)
这是 FPGA 区别于普通 CPLD 的一大杀器。
- **痛点：** 如果用 LUT 来做加法（比如 32 位加法器），进位信号需要从一个 LUT 传到下一个 LUT，路径长、延时大，跑不快。
- **解法：** CLB 内部有一条 **专用的硬件铜线** 和专用逻辑门，专门用来处理进位信号（Carry In -> Carry Out）。
- **效果：** 使得多位计数器、加法器、比较器的速度极快。面试中如果问“如何优化加法器的时序”，利用进位链（或检查进位链是否被打断）是一个重要方向。
### 4. MUX 
**宽逻辑多路选择器 (Wide Logic MUXes)**
- **位置：** 它们**独立**位于 LUT 的输出端，**不在**进位链里。
- **功能：** 专门用来级联 LUT。
    - 它把两个 6 输入 LUT 拼成一个 7 输入逻辑 (F7)。
    - 它把四个 6 输入 LUT 拼成一个 8 输入逻辑 (F8)。
- **关键点：** 这是通用的 MUX，用于扩展逻辑宽度。
### 5. 移位寄存器逻辑 (Shift Register Logic) —— 仅限 SLICEM
- **传统做法：** 做一个 16 拍的延时（Delay），你需要 16 个 Flip-Flop 级联。这非常浪费资源。
- **现代做法：** 某些 LUT (SLICEM) 内部增加了额外的电路，允许将 LUT 配置为 **SRL16** 或 **SRL32**。
- **结果：** **1 个 LUT 就可以顶 32 个寄存器用！**
- **应用：** 在做数字信号处理（如 FIR 滤波器的延时线）或从串口做数据缓冲时，这个单元能节省几倍的面积。
### 6. 分布式 RAM (Distributed RAM) —— 仅限 SLICEM
- LUT 内部增加了写电路（Write Enable, Data In, Clock），使得它可以作为一个微型的 RAM 使用（如 64x1 bit）。
- **其他单元没有的：** 它可以支持**异步读**（地址一变，数据立刻出，不需要等时钟），这是 Block RAM 做不到的。
### 7. "Fracturable" (可拆分) LUT 结构
- 这是现代 FPGA (Xilinx Virtex-6 以后，Intel Stratix 等) 的标配。
- **过去：** 一个 LUT6 就是一个 LUT6，如果你只用它做一个 2 输入与门，剩下的资源就浪费了。
- **现在：** 这个 LUT6 有两个输出口：**O6** 和 **O5**。
    - 它可以用作一个完整的 6 输入逻辑。
    - **或者**，它可以被拆分成 **两个独立的 5 输入逻辑**（只要这俩逻辑共享 5 个输入变量）。
    - **面试考点：** 这意味着在资源紧张时，FPGA 的“逻辑利用率”其实可以超过 100%（按 LUT 个数算），因为一个物理 LUT 干了两份活。
---
# 2. 可编程互连资源 (Interconnect / Routing)

[9. 可编程互联资源](/posts/src\content\posts\FPGA笔记\9. 可编程互联资源/)

- **布线资源：** 包括不同长度的导线（本地线、长线、全局时钟线）。
- **开关矩阵 (Switch Matrix)：** 位于逻辑块的交汇处，像铁路道岔一样，控制信号流向哪个方向。
    - _注意：_ 随着设计变大，布线延时（Routing Delay）通常会超过逻辑延时（Logic Delay），成为时序收敛的瓶颈。
---
# 3. 输入输出块 ([10. IOB](/posts/src\content\posts\FPGA笔记\10. IOB/))

这是 FPGA 的“大门”，负责芯片与外部电路的接口。

- 支持多种电平标准（如 LVCMOS, LVDS, SSTL）。
- 内部包含 **DDR 寄存器** 和延时控制（IDELAY/ODELAY），用于处理高速接口时序。
---
# 4. 专用硬核 (Hard IP)

[11. 专用硬核 (Hard IP)](/posts/src\content\posts\FPGA笔记\11. 专用硬核 (Hard IP)/)
为了提高性能，FPGA 内部嵌入了许多固化的电路模块：

- **Block RAM (BRAM)：** 专用的存储块（如 18Kb/36Kb 大小），用于做 FIFO、大缓存。
- **DSP Slice (DSP48 等)：** 专用的乘加器，用于数字信号处理（滤波器、FFT），比用 LUT 搭出来的乘法器快得多且省面积。
- **时钟管理 (CMT/PLL/MMCM)：** 用于产生倍频、分频和移相时钟。
---

# 5. FPGA 面试常考题 

面试官通常会从“基础概念”问到“时序分析”，再到“工程实践”。

- **问：LUT 是如何实现逻辑的？**
    - _考察点：_ 是否理解 LUT 是 RAM，N 输入 LUT 可以实现任意 N 输入的布尔逻辑。
- **问：Block RAM 和 Distributed RAM (分布式 RAM) 的区别是什么？**
    - _答案要点：_ Block RAM 是专用硬核，容量大，时序好，不支持异步读；Distributed RAM 是用 CLB 里的 LUT 拼出来的，容量小，由于占用逻辑资源所以不建议做大存储，但支持异步读。
- **问：FPGA、ASIC 和 CPLD 的区别？**
    - _重点：_ FPGA 是基于 SRAM（掉电丢失，需配置），逻辑密度高；CPLD 通常基于 Flash/EEPROM（掉电不丢失），逻辑密度低但延时固定（适合做简单的胶合逻辑）。ASIC 是全定制，性能最强但不可重构，NRE 成本高。
- **问：一个 6 输入的 LUT 能实现多少输入的逻辑？**
    - _答：_ 能实现任意的 6 输入组合逻辑。如果是多于 6 输入的逻辑（比如 100 输入的与门），则需要多个 LUT 级联，这会增加 Logic Delay。
- **问：FPGA 里做存储器，Block RAM 和 Distributed RAM 怎么选？**
    - _答：_ 大块数据（如视频行缓存、大 FIFO）用 Block RAM，因为它密度高、不占逻辑资源；极小块数据（如参数配置表、小 FIFO、系数表）或者需要异步读取时，用 Distributed RAM（即 SLICEM），避免浪费宝贵的 BRAM 资源。
- **问：为什么在代码里尽量不要用 Reset 复位所有寄存器？**
    - _深度回答：_ 全局复位信号扇出（Fan-out）极大，会占用大量的布线资源。而且，FPGA 上电时 FF 会自动初始化（GSR），对于数据通路（Data Path）寄存器，通常不需要复位，只需要复位控制通路（Control Path）寄存器即可。
- **问：SLICEM 与 SLICEL 的区别**
	- **SLICEL (Logic):** 只能做普通的逻辑运算（LUT+FF+Carry）。
	- **SLICEM (Memory):** 这是“增强版”的 Slice。它的 LUT 不仅可以“读”（查表），还可以**动态地“写”**。这意味着 SLICEM 可以被配置成：
    1. **分布式 RAM (Distributed RAM):** 直接用 LUT 搭建的小容量 RAM，适合做小的暂存器或寄存器堆。
    2. **移位寄存器 (SRL - Shift Register LUT):** 这是 Xilinx 的独门绝技。一个 LUT 可以配置成一个 32-bit 深度的移位寄存器（SRL32）。
        - _应用：_ 当你需要做数据延迟（Delay）时，用 SRL 比用 Flip-Flop 级联要节省极大的面积（1个 LUT vs 32个 FF）。
