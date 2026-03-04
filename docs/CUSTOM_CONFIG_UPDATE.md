# 更新总结 - 支持自定义导入配置

## 🎯 本次更新目标

增强 Obsidian 导入脚本，支持通过命令行参数自定义文档的日期、分类和标签。

## ✅ 实现的功能

### 1. 命令行参数支持

新增三个可选参数：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--date` | 自定义所有文档的发布日期 | 今天 |
| `--category` | 自定义所有文档的分类 | 系列名称 |
| `--tags` | 自定义所有文档的标签（逗号分隔） | 系列名称 |

### 2. 参数验证和错误提示

- ✅ 完整的使用帮助信息
- ✅ 参数格式错误提示
- ✅ 丰富的使用示例

### 3. 灵活的配置组合

- ✅ 全部自定义（日期+分类+标签）
- ✅ 部分自定义（只日期、只分类、只标签）
- ✅ 使用默认值（无参数）

## 📋 修改的文件

### 核心功能
1. **`scripts/import-obsidian.js`**
   - 添加命令行参数解析
   - 添加自定义配置应用逻辑
   - 更新 frontmatter 生成函数
   - 增强导入信息日志输出

### 文档
1. **`docs/CUSTOM_IMPORT_CONFIG.md`** (新建)
   - 详细的参数说明
   - 完整的使用示例
   - 场景化使用指南
   - 常见问题解答

2. **`docs/OBSIDIAN_IMPORT.md`** (更新)
   - 添加参数说明章节
   - 添加自定义配置示例
   - 添加部分自定义示例

3. **`docs/QUICK_REFERENCE.md`** (更新)
   - 更新导入命令示例
   - 添加自定义参数说明

4. **`README.md`** (更新)
   - 更新使用示例
   - 添加新文档链接

## 🎯 使用示例

### 示例 1：导入历史笔记

```bash
pnpm import-obsidian ~/ArchiveNotes "历史笔记" \
  --date="2023-01-01" \
  --category="学习笔记" \
  --tags="历史,回顾"
```

### 示例 2：导入技术文档集

```bash
pnpm import-obsidian ~/TechDocs "技术文档库" \
  --date="2025-01-01" \
  --category="技术文档" \
  --tags="JavaScript,React,Node.js"
```

### 示例 3：不同系列使用不同标签

```bash
# 前端笔记
pnpm import-obsidian ~/FrontendNotes "前端系列" \
  --tags="HTML,CSS,JavaScript"

# 后端笔记
pnpm import-obsidian ~/BackendNotes "后端系列" \
  --tags="Node.js,Python,Go"
```

## 📊 生成的 frontmatter

所有文档都会应用自定义配置：

```yaml
---
title: 文档标题
published: 2025-01-15  # ← 自定义日期
description: ""
image: ""
tags: ["JavaScript", "React", "前端"]  # ← 自定义标签
category: 技术文档  # ← 自定义分类
series: 系列名称
draft: false
lang: zh_CN
---
```

## 🎯 用户体验提升

### 之前（无自定义）

```bash
pnpm import-obsidian ~/Notes
# 日期：今天（例如 2025-03-04）
# 分类：系列名称（例如 "Notes"）
# 标签：["系列名称"]
```

### 现在（完全自定义）

```bash
pnpm import-obsidian ~/Notes "学习笔记" \
  --date="2024-06-01" \
  --category="编程学习" \
  --tags="JavaScript,算法,数据结构"
# ✅ 完全控制所有元数据
```

## 💡 使用建议

1. **合理设置日期**：通常设置为系列的开始日期
2. **有意义的分类**：使用描述性名称便于后期整理
3. **相关标签**：添加与内容相关的关键词
4. **标签数量适中**：每个文档建议 3-5 个标签
5. **命名规范**：
   - 分类：名词性（"技术文档"）
   - 标签：关键词（"JavaScript"）

## ⚠️ 注意事项

1. **全局应用**：自定义值会应用到所有导入的文档
2. **引号规则**：参数值包含空格时需用双引号
3. **日期格式**：必须使用 `YYYY-MM-DD` 格式
4. **标签分隔**：使用英文逗号，不要加空格
5. **已存在文档**：导入会更新已有 frontmatter

## 🔧 参数格式要求

### 日期

```bash
# ✅ 正确
--date="2025-01-15"

# ❌ 错误
--date="2025/01/15"
--date=2025-01-15
```

### 标签

```bash
# ✅ 正确（英文逗号，无空格）
--tags="JavaScript,React,Vue"

# ❌ 错误（使用空格分隔）
--tags="JavaScript React Vue"
```

### 分类和系列

```bash
# ✅ 正确（用双引号）
--category="技术文档"

# ❌ 错误（无引号，有特殊字符）
--category=技术文档
```

## 📝 文档完整性

- ✅ 参数详细说明
- ✅ 使用示例丰富
- ✅ 场景化指导
- ✅ 常见问题解答
- ✅ 最佳实践建议

现在你可以完全控制导入 Obsidian 文档时的所有元数据了！详细说明请查看 `docs/CUSTOM_IMPORT_CONFIG.md`。
