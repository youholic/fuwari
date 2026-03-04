---
Top: "1"
title: A. FPGA时序分析
published: 2025-08-25
category: note
series: FPGA笔记
tags: ["FPGA笔记"]
draft: false
lang: zh_CN
---

[2. 关键路径](/posts/src\content\posts\FPGA笔记\2. 关键路径/)

[3. 时序约束和物理约束](/posts/src\content\posts\FPGA笔记\3. 时序约束和物理约束/)

# 静态时序分析

静态时序分析（Static Timing Analysis, **STA**）是数字集成电路（ASIC）和 FPGA 设计流程中验证电路时序性能的核心步骤。它不依赖于输入激励（即不需要动态仿真），而是通过数学计算遍历电路中的所有路径，检查是否满足时序约束。

# 1. 什么是时序路径 (Timing Path)

STA 的基本分析单位是“路径”。一条有效的时序路径通常包含三个部分：

- **起点 (Startpoint)**: 数据的发射点。通常是寄存器的时钟输入端（Clock pin）或芯片的输入端口（Input Port）。
- **组合逻辑 (Combinational Logic)**: 数据经过的逻辑门和走线延迟。
- **终点 (Endpoint)**: 数据的捕获点。通常是寄存器的数据输入端（D pin）或芯片的输出端口（Output Port）。
# 2. 发射沿与捕获沿 (Launch & Capture Edge)

理解 STA 必须理解“节拍”的概念：

- **Launch Edge (发射沿)**: 发送数据的那个时钟沿（通常是 $T=0$ 时刻）。
- **Capture Edge (捕获沿)**: 接收数据的那个时钟沿。对于典型的单周期路径，捕获沿是发射沿后的下一个时钟沿（即 $T=T_{clk}$ 时刻）。
# 3. [1. 建立时间和保持时间](/posts/src\content\posts\FPGA笔记\1. 建立时间和保持时间/)检查 (Setup & Hold Check)

这是 STA 中最重要的两个检查，也是面试中的高频计算题。
## a. **建立时间 (Setup Time) 检查**

- **目的**: 确保数据在捕获沿到来**之前**就已经稳定下来。
- **物理意义**: 限制了电路运行的**最高频率**（即最慢的那条路径决定了系统能跑多快）。
- 公式:
    数据到达时间 ($Data Arrival Time$) + $T_{setup} \le$ 数据要求时间 ($Data Required Time$)
    展开为周期约束：$$T_{launch\_edge} + T_{clk\_to\_q} + T_{logic\_delay} + T_{setup} \le T_{capture\_edge} - T_{clock\_skew}$$
	如果数据来得太晚（路径延迟太大），就会违例（Violation）。
## b. **保持时间 (Hold Time) 检查**

- **目的**: 确保数据在捕获沿到来**之后**的一段时间内保持稳定，防止新数据“冲毁”旧数据。
- **物理意义**: 检查是否存在**竞争冒险**（Race Condition）。这与时钟频率无关，只与路径的最小延迟有关。
- 公式:
    数据到达时间 ($Data Arrival Time$) $\ge$ 数据要求时间 ($Data Required Time$) + $T_{hold}$$$T_{launch\_edge} + T_{clk\_to\_q} + T_{logic\_delay} \ge T_{capture\_edge} + T_{hold} - T_{clock\_skew}$$
	如果数据跑得太快（比如时钟偏斜 Skew 太大或者组合逻辑延迟太小），就会违例。
# 4. 裕量 (Slack)

Slack 是衡量时序是否满足要求的指标。

- **Slack = Required Time - Arrival Time** (对于建立时间)
- **Positive Slack (正裕量)**: 时序满足要求。
- **Negative Slack (负裕量)**: 时序违例 (Timing Violation)。
- **WNS (Worst Negative Slack)**: 整个设计中最差的建立时间裕量，如果它是负的，说明设计跑不到预设的频率。
- **WHS (Worst Hold Slack)**: 整个设计中最差的保持时间裕量。
# 5. PVT 环境

STA 必须在特定的**PVT**条件下进行，因为晶体管的速度受物理环境影响很大：

- **P (Process)**: 工艺角（SS, FF, TT）。SS（Slow-Slow）通常用于建立时间检查，FF（Fast-Fast）通常用于保持时间检查。
- **V (Voltage)**: 电压。电压越低，延迟越大。
- **T (Temperature)**: 温度。通常温度越高，延迟越大（但在先进工艺下存在反转效应）。
# 6. 时序约束 (Timing Constraints)

STA 工具不会自动知道你的设计意图，你必须通过约束文件（如 Xilinx 的 **XDC** 或通用的 **SDC**）告诉它：

- **Create Clock**: 定义主时钟频率。
- **Input/Output Delay**: 定义芯片外部的延迟。
- **False Path (伪路径)**: 告诉工具某些路径不需要检查（例如跨时钟域路径或逻辑上永远不通的路径）。
- **Multicycle Path (多周期路径)**: 告诉工具某些数据允许在多个时钟周期后到达，而不必在一个周期内完成。
# 7. 为什么要用 STA，而不能只靠仿真？

1. **覆盖率（Coverage）**：
    - **仿真**：只能验证你写过的 Testbench 激励。如果你的 Testbench 没覆盖到某种极其罕见的状态跳转，那个路径的时序问题就发现不了。
	
    - **STA**：是**穷举**的。它会遍历芯片内几百万条路径，不管逻辑上是否真的会发生，它都会去查时序（除非你设了 False Path）。**只有 STA 能保证 100% 的时序覆盖。**
2. **PVT 环境（PVT Corners）**：
    - Setup 和 Hold 违例往往发生在极端情况下。
    - **Setup** 容易在 **Slow Process + Low Voltage + High Temp**（慢工艺角）下违例。
    - **Hold** 容易在 **Fast Process + High Voltage + Low Temp**（快工艺角）下违例。
    - 仿真很难同时模拟这么多物理环境，而 STA 可以一键计算所有 Corner 下的最差情况。
# 8. Setup 违例和 Hold 违例有什么区别？
- **Setup 违例是“软伤”**：
    - 如果流片或上板后发现 Setup 违例，芯片还是能用的，只是**跑不快**。你可以通过**降频**（降低时钟频率）来解决问题。
    - _类比：百米冲刺你跑不进 10 秒，跑 15 秒总行了吧？_
- **Hold 违例是“硬伤”**：
    - 如果 Hold 违例，意味着新数据在旧数据还没被采稳的时候就冲进来了，数据彻底损坏。**降频是救不回来的**（因为 Hold 检查与时钟周期 $T$ 无关）。
    - 这也是为什么布局布线工具（Place & Route）会优先保证修好 Hold 违例，哪怕牺牲一点 Setup 性能。
    - _类比：你还没把接力棒抓稳，前一个人就松手了，棒子掉了。大家跑得再慢，棒子也已经掉了。_
# 9. 时钟不是理想的：Skew（偏斜）和 Jitter（抖动）

在课本里，时钟沿在所有寄存器上是同时到达的。但在真实的 FPGA（如 Zynq 芯片）中，时钟树（Clock Tree）也是有物理长度的。
- **Clock Skew (时钟偏斜)**:
    - 指同一个时钟沿到达两个不同寄存器（源寄存器和目的寄存器）的时间差。
    - **注意点**: Skew 对 Setup 和 Hold 的影响是**双刃剑**。
        - 如果时钟先到目的寄存器（Negative Skew），Setup 更难满足（相当于周期变短了）。
        - 如果时钟后到目的寄存器（Positive Skew），Hold 更难满足（因为需要保持的时间窗口“漂移”了）。
    - **FPGA 只有在布局布线（Route）之后才能得到准确的 Skew，所以综合（Synthesis）阶段的时序报告往往不准。**
- **Clock Jitter (时钟抖动)**:
    - 指时钟周期的不稳定性（忽快忽慢）。
    - **注意点**: Jitter 对 STA 来说**永远是坏事**。STA 工具在计算时，会扣除 Jitter 的不确定性（Uncertainty），这会直接吃掉你的时序裕量（Slack）。
# 10. STA 的盲区：异步路径 (CDC)

STA 的全称是“静态时序分析”，它的前提是同步电路（Synchronous）。
- **注意点**: 对于**跨时钟域（Clock Domain Crossing, CDC）** 的路径，STA 是**无能为力**的。
    - 如果你有两个不同频率的时钟（比如 `openwifi` 项目中 PL 和 PS 交互时可能涉及不同时钟），STA 工具默认会试图去分析它们之间的 Setup/Hold，但这通常是错误的，因为相位关系不确定。
    - **你必须做的事**: 在 XDC 约束文件中，显式地告诉 Vivado 忽略这些路径（`set_clock_groups -asynchronous` 或 `set_false_path`）。
    - **后果**: 如果你不设 False Path，工具会为了满足不可能的时序而疯狂优化，导致布局布线失败；如果你设了但没做同步处理（如打两拍），就会出现亚稳态。
# 11. 复位信号的时序：Recovery 和 Removal

你在之前的对话中问过复位和亚稳态，这在 STA 中对应两个专门的检查项，它们地位等同于 Setup/Hold，但专门针对**异步复位信号**。
- **Recovery Time (恢复时间)** $\approx$ Setup Time
    - 指复位信号**释放**（变无效）的时刻，必须在下一个时钟沿来临之前的一段时间完成。
    - 如果违例：寄存器可能不知道该复位还是该工作，导致亚稳态或进入随机状态。
- **Removal Time (移除时间)** $\approx$ Hold Time
    - 指复位信号释放后，必须保持稳定一段时间，不能立刻又变有效。
**面试金句**: “对于异步复位、同步释放的电路，STA 主要检查的是复位释放瞬间的 Recovery 和 Removal 时序，以防止复位结束时的亚稳态。”

# 12. 约束的完整性：Garbage In, Garbage Out

STA 是一个计算器，它算得准不准，完全取决于你输入的**约束（Constraints / XDC）** 准不准。
- **未约束路径 (Unconstrained Paths)**:
    - Vivado 默认可能不会报告未约束路径的违例。如果你的输入端口没有设置 `set_input_delay`，STA 会认为数据瞬间到达，这在现实中是不可能的。
    - **注意**: 必须检查报告中的 "Timer Settings" 或 "Unconstrained Paths" 只有当覆盖率达到 100%（或接近），STA 的结果才可信。
- **多周期路径 (Multicycle Paths)**:
    - 有些逻辑（如复杂的 DSP 运算）不需要在一个周期内做完。如果你不告诉 STA “这条路可以跑 2 个周期”，工具就会按 1 个周期死命报错，导致你以为设计失败了。
# 13. STA检查内容

| **检查项目**             | **关注对象** | **形象比喻**    | **致命程度**        |
| -------------------- | -------- | ----------- | --------------- |
| **Setup Time**       | 数据路径     | 赶不上车，迟到了    | ⭐⭐⭐⭐⭐ (功能错误)    |
| **Hold Time**        | 数据路径     | 跑太快，撞上上一班车  | ⭐⭐⭐⭐⭐ (功能错误)    |
| **Recovery/Removal** | **异步复位** | 在车启动瞬间跳车    | ⭐⭐⭐⭐ (复位失败/亚稳态) |
| **Pulse Width**      | 时钟波形     | 车门开关太快，人进不去 | ⭐⭐⭐⭐ (时钟失效)     |
| **Max Transition**   | 信号质量     | 路面太泥泞，车跑不动  | ⭐⭐⭐ (隐患)        |
| **Clock Gating**     | 时钟使能     | 还没进站就关门夹人   | ⭐⭐⭐⭐ (毛刺/误触发)   |
