# Obsidian 导入脚本使用指南

## 功能说明

该脚本可以将 Obsidian 仓库中的 Markdown 文档导入到博客中，并自动：

1. ✅ 添加完整的 frontmatter（标题、日期、标签、分类、系列）
2. ✅ 将 Obsidian 的 Wiki 链接 `[[文件名]]` 转换为网页链接
3. ✅ 保留原有的文件夹结构
4. ✅ 自动设置系列、标签、分类为仓库名称
5. ✅ 保留原有 frontmatter（如有）
6. ✅ 自动处理代码块语言（将不支持的语言映射为支持的）

## 使用方法

### 基本用法

```bash
# 假设你的 Obsidian 仓库在 /path/to/your/vault
pnpm import-obsidian /path/to/your/vault
```

### 指定系列名称

```bash
# 使用自定义系列名称（默认使用仓库名称）
pnpm import-obsidian /path/to/your/vault "我的笔记系列"
```

## 前置要求

- Obsidian 仓库路径必须存在
- 脚本会跳过 `.obsidian`、`.git`、`node_modules`、`.trash` 等目录

## Wiki 链接转换

脚本会将 Obsidian 的 Wiki 链接格式转换为网页链接：

| Obsidian 格式 | 转换后 |
|--------------|--------|
| `[[文档]]` | `[文档](/posts/文档/)` |
| `[[文档\|显示文本]]` | `[显示文本](/posts/文档/)` |

### 注意事项

1. **文件名映射**：转换基于文件名（不含扩展名）
2. **文件夹结构保留**：保持 Obsidian 仓库的文件夹层级
3. **未找到链接**：如果目标文件不存在，链接会变为空链接

## 代码块语言处理

脚本会自动处理代码块的语言标记，将不支持的语言映射为支持的替代语言：

### 支持的常见语言

| 类别 | 语言 |
|------|------|
| Web | javascript, typescript, html, css |
| 后端 | python, java, go, ruby, php |
| 系统级 | c, cpp, rust, swift, kotlin, scala |
| 脚本 | bash, sh, powershell |
| 配置 | json, xml, yaml, toml, sql |

### 不支持的语言处理

对于 Expressive Code 不支持的语言（如 Verilog、VHDL 等），脚本会：

1. **自动映射**：尝试映射到相似的支持语言
2. **降级处理**：如果没有合适映射，使用 `txt` 作为 fallback
3. **保留代码**：代码内容完全保留，仅改变语言标记

### 示例

```markdown
```verilog
module my_module(input a, output b);
endmodule
```
```

导入后会自动处理：

```markdown
```txt
module my_module(input a, output b);
endmodule
```
```

### 手动修复

如果需要更精细的语言控制，可以：

```bash
# 运行语言修复脚本
pnpm fix-code-languages
```

该脚本会扫描所有 markdown 文件并更新代码块语言标记。

## Frontmatter 配置

导入的文件会自动添加以下 frontmatter：

```yaml
---
title: 文档标题  # 从文件名提取
published: 2025-03-02  # 当前日期
description: ""
image: ""
tags: ["仓库名称"]  # 自动设置
category: 仓库名称  # 自动设置
series: 仓库名称  # 自动设置
draft: false
lang: zh_CN
---
```

如果文件已有 frontmatter，脚本会：
- 保留现有的所有字段
- 补充缺失的必要字段
- 更新 `title`、`published`、`category`、`series`、`tags`

## 使用示例

### 导入单个笔记仓库

```bash
# 导入 "JavaScript 学习笔记" 仓库
pnpm import-obsidian ~/Documents/Obsidian/JavaScript学习笔记

# 结果：
# - 所有 md 文件复制到 src/content/posts/
# - 系列名称: JavaScript学习笔记
# - 分类: JavaScript学习笔记
# - 标签: ["JavaScript学习笔记"]
```

### 导入多个笔记仓库

```bash
# 导入第一个仓库
pnpm import-obsidian ~/Notes/Java教程

# 导入第二个仓库
pnpm import-obsidian ~/Notes/Python教程
```

## 后续操作

导入完成后：

1. **预览博客**
   ```bash
   pnpm dev
   ```

2. **检查导入的文件**
   ```bash
   # 查看导入的文件
   ls -la src/content/posts/
   ```

3. **调整 frontmatter**（可选）
   - 打开文件手动修改 title、description 等
   - 添加封面图 URL
   - 修改发布日期

4. **构建部署**
   ```bash
   pnpm build
   ```

## 常见问题

### Q: 如何修改已导入文章的发布日期？

A: 直接编辑文章的 frontmatter 中的 `published` 字段。

### Q: 如何为系列添加封面图？

A: 可以在系列的任一文章中添加 `image` 字段，或者在主页配置中设置系列封面。

### Q: Wiki 链接转换不工作？

A: 确保：
1. 所有相关文件都已导入
2. 文件名匹配（不含扩展名）
3. 没有特殊字符导致匹配失败

### Q: 如何重新导入？

A: 直接重新运行导入命令会覆盖现有文件。建议先备份或删除旧文件。

## 进阶功能

### 仅导入特定文件夹

可以修改脚本中的 `skipDirs` 数组来控制导入范围：

```javascript
const skipDirs = [".obsidian", ".git", "node_modules", ".trash", "私人笔记"]
```

### 自定义 frontmatter 模板

编辑脚本中的 frontmatter 模板部分，添加你需要的字段。

## 技术细节

- 使用 Node.js 原生 fs 模块处理文件
- 支持嵌套文件夹结构
- 自动处理文件名中的特殊字符
- 使用正则表达式转换 Wiki 链接
