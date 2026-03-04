# Obsidian 导入脚本使用指南

## 功能说明

该脚本可以将 Obsidian 仓库中的 Markdown 文档导入到博客中，并自动：

1. ✅ 添加完整的 frontmatter（标题、日期、标签、分类、系列）
2. ✅ 将 Obsidian 的 Wiki 链接 `[[文件名]]` 转换为网页链接
3. ✅ 保留原有的文件夹结构
4. ✅ **自动复制所有图片文件**（png, jpg, gif, svg 等）
5. ✅ 自动设置系列、标签、分类为仓库名称
6. ✅ 保留原有 frontmatter（如有）
7. ✅ 自动处理代码块语言（将不支持的语言映射为支持的）

## 使用方法

### 参数说明

导入脚本支持以下自定义参数：

| 参数 | 说明 | 示例 | 默认值 |
|------|------|------|--------|
| `--date` | 设置所有文档的发布日期 | `--date="2025-01-15"` | 今天 |
| `--category` | 设置所有文档的分类 | `--category="技术"` | 系列名称 |
| `--tags` | 设置所有文档的标签（逗号分隔） | `--tags="tag1,tag2"` | 系列名称 |

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

### 完全自定义

```bash
# 自定义日期、分类和标签
pnpm import-obsidian /path/to/your/vault "系列名称" \
  --date="2025-01-15" \
  --category="技术文档" \
  --tags="JavaScript,编程,教程"
```

### 部分自定义

```bash
# 只自定义日期
pnpm import-obsidian /path/to/vault "教程系列" --date="2024-12-01"

# 只自定义分类
pnpm import-obsidian /path/to/vault "教程系列" --category="编程"

# 只自定义标签
pnpm import-obsidian /path/to/vault "教程系列" --tags="React,Vue,前端"
```

## 前置要求

- Obsidian 仓库路径必须存在
- 脚本会跳过 `.obsidian`、`.git`、`node_modules`、`.trash` 等目录

## 图片文件处理

脚本会自动复制所有图片文件到博客项目中：

### 支持的图片格式
- `.png` - PNG 图片
- `.jpg` / `.jpeg` - JPEG 图片
- `.gif` - GIF 动画
- `.svg` - SVG 矢量图
- `.webp` - WebP 图片
- `.bmp` - BMP 图片
- `.ico` - 图标文件

### 图片路径处理
在 Obsidian 中，图片通常这样引用：

```markdown
![图片描述](./image.png)
![图片描述](image.jpg)
```

导入后，图片会被复制到 `src/content/posts/` 对应的目录下，保持相对路径不变：

```markdown
![图片描述](./image.png)  # ✅ 正常工作
```

### 文件夹结构保留

Obsidian 的文件夹结构会完整保留到博客中：

```
Obsidian Vault/
├── images/
│   ├── photo1.png
│   └── photo2.jpg
└── notes/
    └── article.md
```

导入后：

```
src/content/posts/
├── images/
│   ├── photo1.png  # ✅ 自动复制
│   └── photo2.jpg  # ✅ 自动复制
└── notes/
    └── article.md  # ✅ 保持结构
```

### 注意事项

1. **自动复制**：无需手动操作，所有图片自动复制
2. **相对路径**：Obsidian 中的相对路径引用会自动工作
3. **跳过目录**：`.obsidian` 等系统目录中的图片会被跳过
4. **覆盖警告**：如果目标文件已存在会被覆盖

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

    # 查看图片文件
    find src/content/posts/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" \)
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

### Q: 图片显示不正常？

A: 检查以下几点：
1. **确认图片已导入**：运行 `find src/content/posts/ -type f -name "*.png"` 查找图片文件
2. **相对路径**：Obsidian 中的相对路径应该保持不变
3. **绝对路径**：如果使用了绝对路径，需要手动调整为相对路径

### Q: 如何为文章添加封面图？

A: 在文章的 frontmatter 中添加 `image` 字段：

```yaml
---
title: 文章标题
image: ./cover.jpg  # 相对于文章所在目录
---
```

如果封面图在公共资源中，使用绝对路径：

```yaml
---
image: /images/cover.jpg  # 相对于 public 目录
---
```

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

## 自定义配置详解

### 生成的 frontmatter 示例

使用自定义参数后，所有文档都会应用相同的配置：

```yaml
---
title: 文档标题  # 从文件名提取
published: 2025-01-15  # 自定义日期
description: ""          # 空描述
image: ""              # 空图片
tags: ["JavaScript", "React", "前端"]  # 自定义标签
category: 技术文档      # 自定义分类
series: 我的笔记系列     # 系列名称
draft: false
lang: zh_CN
---
```

### 应用范围

- ✅ **所有 Markdown 文件**：都会应用自定义的日期、分类、标签
- ✅ **已有 frontmatter**：会被更新，保留其他字段
- ✅ **保留现有值**：文档中其他自定义字段不会丢失

### 使用场景

#### 场景 1：导入历史笔记

将旧笔记设置为统一的发布日期：

```bash
pnpm import-obsidian ~/ArchiveNotes "历史笔记" --date="2023-01-01"
```

#### 场景 2：系列使用不同标签

不同系列使用不同的标签组合：

```bash
# 前端系列
pnpm import-obsidian ~/FrontendNotes "前端系列" \
  --tags="HTML,CSS,JavaScript"

# 后端系列
pnpm import-obsidian ~/BackendNotes "后端系列" \
  --tags="Node.js,Python,Go"
```

#### 场景 3：统一分类管理

将不同来源的笔记都归类到同一分类：

```bash
pnpm import-obsidian ~/Obsidian1 "系列1" --category="我的知识库"
pnpm import-obsidian ~/Obsidian2 "系列2" --category="我的知识库"
```

### 参数格式要求

#### 日期格式

```bash
# ✅ 正确
--date="2025-01-15"

# ❌ 错误
--date = 2025-01-15
--date="2025/01/15"
```

#### 标签格式

```bash
# ✅ 正确（英文逗号分隔，无空格）
--tags="JavaScript,React,Vue"

# ❌ 错误（使用空格）
--tags="JavaScript React Vue"
```

#### 分类和系列名称

```bash
# ✅ 正确（用双引号）
--category="技术文档"

# ❌ 错误（如果包含空格）
--category=技术文档
```

### 导入后调整

导入完成后，你可以手动编辑个别文档的 frontmatter：

```bash
# 打开文件编辑
vim src/content/posts/series1/chapter1.md

# 或修改日期
sed -i 's/published: 2025-01-15/published: 2025-01-20/' src/content/posts/series1/chapter1.md
```

## 技术细节

- 使用 Node.js 原生 fs 模块处理文件
- 支持嵌套文件夹结构
- 自动处理文件名中的特殊字符
- **自动识别并复制图片文件**（支持常见格式）
- 保持图片和文档的相对路径关系
- 使用正则表达式转换 Wiki 链接
