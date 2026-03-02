# 解决代码块语言不支持问题

## 问题说明

当从 Obsidian 导入包含不支持语言的代码块时，会出现类似警告：

```
[WARN] [astro-expressive-code] Error while highlighting code block using language "Verilog"
```

这是因为 Expressive Code 语法高亮库不支持某些语言。

## 解决方案

### 方案 1：自动修复（推荐）

导入 Obsidian 时会自动处理语言映射：

```bash
pnpm import-obsidian /path/to/vault
```

脚本会自动将不支持的语言映射为支持的替代语言：
- `verilog` → `c`（语法相似）
- `systemverilog` → `c`
- `vhdl` → `c`
- `tcl` → `txt`
- 其他不支持的语言 → `txt`

### 方案 2：手动修复

如果已经导入了文件，可以手动修复：

```bash
pnpm fix-code-languages
```

该脚本会扫描所有 markdown 文件并更新代码块语言标记。

## 语言映射表

| 原语言 | 映射为 | 原因 |
|--------|--------|------|
| Verilog | c | 语法与 C 相似 |
| SystemVerilog | c | 语法与 C 相似 |
| VHDL | c | 语法与 C 相似 |
| Tcl | txt | 不支持，降级处理 |
| MATLAB | txt | 不支持，降级处理 |
| Julia | txt | 不支持，降级处理 |

## 支持的常见语言

以下语言无需处理，可直接使用：

- **Web**: javascript, typescript, html, css
- **后端**: python, java, go, ruby, php
- **系统级**: c, cpp, rust, swift, kotlin, scala
- **脚本**: bash, sh, powershell
- **配置**: json, xml, yaml, toml, sql

## 示例

### 原始代码（Obsidian）

```markdown
```verilog
module counter(
    input clk,
    input rst,
    output reg [7:0] count
);
endmodule
```
```

### 导入后自动处理

```markdown
```c
module counter(
    input clk,
    input rst,
    output reg [7:0] count
);
endmodule
```
```

**注意**：代码内容完全保留，仅改变语言标记以避免警告。

## 验证修复

运行修复后，启动开发服务器验证：

```bash
pnpm dev
```

检查是否还有语言相关的警告。

## 自定义语言映射

如果需要修改映射规则，编辑以下文件：

1. **导入时自动处理**：`scripts/import-obsidian.js`
2. **导入后手动修复**：`scripts/fix-code-languages.js`

找到 `LANGUAGE_MAP` 对象，添加或修改映射：

```javascript
const LANGUAGE_MAP = {
    // 添加你的映射
    "你的语言": "c",  // 或其他支持的语言
}
```

## 高级：安装额外语法包

如果你希望完整的语法高亮支持，可以考虑：

1. 在 Expressive Code 配置中添加自定义语言支持
2. 使用支持更多语言的替代语法高亮库（需要修改配置）

但这需要更多的配置工作，当前方案是最简单快速的解决方案。

## 常见问题

### Q: 映射为 C 语法高亮准确吗？

A: 对于 Verilog、SystemVerilog 等 HDL 语言，C 语法高亮虽然不是完全准确，但比纯文本更好，且不会有警告。代码内容完全保留，不影响阅读。

### Q: 我可以保留原始语言标记吗？

A: 可以，但会有警告且没有语法高亮。如果需要，可以手动将代码块语言改为 `text` 或 `txt` 来避免警告。

### Q: 如何查看所有不支持的代码块？

A: 运行 `pnpm dev` 时，所有警告都会显示在终端中。

### Q: 支持的语言列表在哪里？

A: Expressive Code 基于 Shiki，支持 100+ 种语言。查看完整列表：https://shiki.style/languages
