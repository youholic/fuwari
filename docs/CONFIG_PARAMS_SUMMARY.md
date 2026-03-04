# 自定义导入配置功能总结

## 🎯 功能概述

现在你可以完全控制导入 Obsidian 笔记时的日期、分类和标签了！

## ✅ 核心功能

### 1. 命令行参数支持

```bash
pnpm import-obsidian <vault-path> [series-name] [options]
```

### 2. 可用参数

| 参数 | 说明 | 示例 | 默认值 |
|------|------|------|---------|
| `--date` | 设置所有文档的发布日期 | `--date="2025-01-15"` | 今天 |
| `--category` | 设置所有文档的分类 | `--category="技术文档"` | 系列名称 |
| `--tags` | 设置所有文档的标签（逗号分隔）| `--tags="JavaScript,React"` | 系列名称 |

### 3. 使用示例

#### 基本导入（默认值）

```bash
pnpm import-obsidian ~/Notes
# 结果：
# - published: 今天
# - category: Notes
# - tags: ["Notes"]
# - series: Notes
```

#### 完全自定义

```bash
pnpm import-obsidian ~/Notes "前端学习" \
  --date="2024-12-01" \
  --category="前端开发" \
  --tags="HTML,CSS,JavaScript,Vue,React"
```

#### 部分自定义

```bash
# 只自定义日期
pnpm import-obsidian ~/Notes "教程系列" --date="2024-06-01"

# 只自定义分类
pnpm import-obsidian ~/Notes "教程系列" --category="编程"

# 只自定义标签
pnpm import-obsidian ~/Notes "教程系列" --tags="算法,数据结构"
```

## 📋 生成的 Frontmatter

### 使用默认值

```yaml
---
title: 文档标题
published: 2025-03-04  # 今天的日期
description: ""
image: ""
tags: ["系列名称"]
category: 系列名称
series: 系列名称
draft: false
lang: zh_CN
---
```

### 使用自定义参数

```yaml
---
title: 文档标题
published: 2024-01-15  # --date="2024-01-15"
description: ""
image: ""
tags: ["JavaScript", "React", "前端"]  # --tags="JavaScript,React,前端"
category: 前端开发                      # --category="前端开发"
series: 我的教程系列
draft: false
lang: zh_CN
---
```

## 🔍 参数格式要求

### 日期格式

```bash
# ✅ 正确格式（必需）
--date="2025-03-04"

# ❌ 错误格式
--date=2025-03-04  # 缺少引号
--date="2025/03/04"  # 使用斜杠
```

### 标签格式

```bash
# ✅ 正确格式（英文逗号，无空格）
--tags="JavaScript,React,Vue"

# ❌ 错误格式（使用中文逗号或空格）
--tags="JavaScript，React，Vue"
--tags="JavaScript, React, Vue"
```

### 分类格式

```bash
# ✅ 正确格式（用双引号）
--category="技术文档"

# ❌ 错误格式（无引号）
--category=技术文档
```

## 🎯 使用场景

### 场景 1：批量导入历史笔记

将旧笔记统一设置为某年的日期：

```bash
pnpm import-obsidian ~/ArchiveNotes "历史笔记" \
  --date="2023-01-01" \
  --category="学习笔记" \
  --tags="历史,回顾"
```

### 场景 2：导入不同类型的内容

```bash
# 编程笔记
pnpm import-obsidian ~/CodeNotes "编程系列" \
  --tags="JavaScript,Python,Java" \
  --category="编程"

# 设计笔记
pnpm import-obsidian ~/DesignNotes "设计系列" \
  --tags="UI/UX,设计规范,Figma" \
  --category="设计"
```

### 场景 3：导入课程文档

```bash
# 第一期课程
pnpm import-obsidian ~/Course1/Phase1 "课程系列" \
  --date="2024-09-01" \
  --tags="课程,学习" \
  --category="课程"

# 第二期课程
pnpm import-obsidian ~/Course2/Phase2 "课程系列" \
  --date="2024-10-01" \
  --tags="课程,学习" \
  --category="课程"
```

## 📊 导入日志

导入时会显示配置信息：

```bash
📦 Importing Obsidian vault: ~/Notes
📚 Series name: 我的笔记系列
📅 Default date: 2024-12-01  # ← 自定义日期
🏷️  Category: 技术文档       # ← 自定义分类
🔖 Tags: JavaScript,React,前端 # ← 自定义标签

🔍 Scanning for Markdown files...
   Found 25 Markdown files

🖼️ Scanning for image files...
   Found and copied 18 image files

📝 Processing files...
   ✓ chapter1/introduction.md
   ✓ images/diagram1.png
   ...

✅ Import complete!
   - Markdown files processed: 25
   - Image files copied: 18
   - Total files: 43
```

## ⚙️ 配置优先级

1. **命令行参数** - 最高优先级，会覆盖所有默认值
2. **已有 frontmatter** - 保留文档中已存在的自定义字段
3. **系列名称** - 如果未指定，使用仓库名称

## 📖 相关文档

- **[详细使用指南](docs/CUSTOM_IMPORT_CONFIG.md)** - 参数说明和示例
- **[Obsidian 导入指南](docs/OBSIDIAN_IMPORT.md)** - 完整导入文档
- **[图片导入指南](docs/IMPORT_WITH_IMAGES.md)** - 图片处理说明

## 💡 快速参考

### 常用命令模板

```bash
# 导入今天的笔记
pnpm import-obsidian ~/Notes

# 导入2024年的所有笔记
pnpm import-obsidian ~/Archive "2024笔记" --date="2024-01-01"

# 导入技术文档
pnpm import-obsidian ~/TechDocs "技术文档" \
  --tags="JavaScript,Node.js,React,前端" \
  --category="技术"

# 导入学习笔记
pnpm import-obsidian ~/StudyNotes "学习笔记" \
  --tags="课程,学习,笔记" \
  --category="学习"
```

现在你可以灵活地控制导入的每个文档元数据了！
