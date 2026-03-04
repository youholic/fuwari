# 导入时自定义日期、分类、标签

## 📝 更新内容

导入脚本现在支持自定义文档日期、分类和标签！

## 🎯 使用方式

### 基本用法（使用默认值）

```bash
pnpm import-obsidian ~/Notes "我的笔记"
```

**默认值：**
- 📅 日期：今天
- 🏷️ 分类：系列名称
- 🔖 标签：系列名称

### 完全自定义

```bash
pnpm import-obsidian ~/Notes "我的笔记" \
  --date="2025-01-15" \
  --category="技术文档" \
  --tags="JavaScript,编程,教程"
```

### 只自定义部分字段

```bash
# 只自定义日期
pnpm import-obsidian ~/Notes "教程系列" --date="2024-12-01"

# 只自定义分类
pnpm import-obsidian ~/Notes "教程系列" --category="编程"

# 只自定义标签
pnpm import-obsidian ~/Notes "教程系列" --tags="React,Vue,前端"
```

## 🔧 参数说明

| 参数 | 说明 | 示例 | 默认值 |
|------|------|------|--------|
| `--date` | 设置所有文档的发布日期 | `--date="2025-01-15"` | 今天 |
| `--category` | 设置所有文档的分类 | `--category="技术"` | 系列名称 |
| `--tags` | 设置所有文档的标签（逗号分隔） | `--tags="tag1,tag2"` | 系列名称 |

## 📋 完整示例

### 示例 1：导入 2024 年的课程笔记

```bash
pnpm import-obsidian ~/Documents/2024课程 \
  "2024年课程" \
  --date="2024-09-01" \
  --category="课程" \
  --tags="学习,笔记"
```

### 示例 2：导入技术文档集

```bash
pnpm import-obsidian ~/TechDocs "技术文档库" \
  --date="2025-01-01" \
  --category="技术文档" \
  --tags="JavaScript,React,Node.js,后端"
```

### 示例 3：导入翻译文档

```bash
pnpm import-obsidian ~/Translations "翻译作品" \
  --date="2025-02-01" \
  --category="翻译" \
  --tags="英语,日语,学习"
```

## 📊 导入效果

### 控制台输出

```bash
📦 Importing Obsidian vault: ~/MyNotes
📚 Series name: 我的学习笔记
📅 Default date: 2025-01-15  # ← 自定义日期
🏷️ Category: 技术文档       # ← 自定义分类
🔖 Tags: JavaScript,React,前端  # ← 自定义标签

🔍 Scanning for Markdown files...
   Found 25 Markdown files

🖼️ Scanning for image files...
   Found and copied 18 image files

📝 Processing files...
   ✓ chapter1/introduction.md
   ✓ chapter1/setup.md
   ...

✅ Import complete!
   - Markdown files processed: 25
   - Image files copied: 18
   - Total files: 43
```

### 生成的 frontmatter

所有文档都会应用自定义的配置：

```yaml
---
title: 文档标题
published: 2025-01-15  # 自定义日期
description: ""
image: ""
tags: ["JavaScript", "React", "前端"]  # 自定义标签
category: 技术文档  # 自定义分类
series: 我的学习笔记
draft: false
lang: zh_CN
---
```

## 💡 使用场景

### 场景 1：批量导入历史笔记

如果你想导入之前的笔记，但让它们显示为同一天的发布日期：

```bash
pnpm import-obsidian ~/ArchiveNotes "历史笔记" --date="2023-01-01"
```

### 场景 2：不同系列使用不同标签

```bash
# 前端笔记
pnpm import-obsidian ~/FrontendNotes "前端系列" \
  --tags="HTML,CSS,JavaScript"

# 后端笔记
pnpm import-obsidian ~/BackendNotes "后端系列" \
  --tags="Node.js,Python,Go"
```

### 场景 3：统一分类管理

将不同来源的笔记都归类到同一个分类：

```bash
pnpm import-obsidian ~/Obsidian1 "系列1" --category="我的知识库"
pnpm import-obsidian ~/Obsidian2 "系列2" --category="我的知识库"
```

## ⚠️ 注意事项

1. **全局应用**：自定义的日期、分类、标签会应用到所有导入的文档
2. **已存在的 frontmatter**：如果文档已有 frontmatter，脚本会更新这些字段
3. **日期格式**：必须使用 `YYYY-MM-DD` 格式
4. **标签格式**：多个标签用英文逗号分隔，不要加空格
5. **引号**：如果值包含空格，建议用双引号括起来

## 🔍 日期格式说明

### 正确格式

```bash
# ✅ 使用双引号包含整个值
--date="2025-01-15"
--category="技术文档"
--tags="JavaScript, React"
```

### 错误格式

```bash
# ❌ 不要这样（有空格）
--date = 2025-01-15

# ❌ 日期格式错误
--date="2025/01/15"

# ❌ 标签使用空格分隔
--tags="JavaScript React Vue"
```

## 📝 修改已存在的文档

导入后，你可以手动编辑个别文档的 frontmatter：

```yaml
---
title: 特殊文档
published: 2024-12-25  # 可以单独修改
tags: ["JavaScript", "特殊", "重要"]  # 可以单独修改
category: 特殊分类  # 可以单独修改
series: 前端系列
---
```

## 🎯 最佳实践

1. **合理设置日期**：通常设置为系列的开始日期或第一篇文章日期
2. **精准分类**：使用有意义的分类名，便于后期整理
3. **相关标签**：添加与内容相关的标签，便于检索和归档
4. **标签数量**：每个文档建议 3-5 个标签，不宜过多
5. **命名规范**：
   - 分类：名词性（"技术文档"、"学习笔记"）
   - 标签：关键词（"JavaScript"、"React"、"教程"）

## 🔄 批量导入多个系列

```bash
# 导入多个不同配置的系列
pnpm import-obsidian ~/Series1 "系列1" --date="2025-01-01" --category="前端"
pnpm import-obsidian ~/Series2 "系列2" --date="2025-02-01" --category="后端"
pnpm import-obsidian ~/Series3 "系列3" --date="2025-03-01" --category="数据库"
```

现在你可以完全控制导入文档的日期、分类和标签了！
