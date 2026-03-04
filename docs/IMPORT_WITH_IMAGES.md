# 如何导入带图片的 Obsidian 笔记

## 概述

导入脚本会自动复制所有图片文件，无需手动操作！

## Obsidian 笔记结构示例

### 基本结构

```
我的笔记/
├── images/
│   ├── diagram1.png
│   ├── photo.jpg
│   └── screenshot.gif
├── docs/
│   ├── chapter1.md
│   └── chapter2.md
└── .obsidian/
    └── config.json
```

### Markdown 中引用图片

#### 相对路径（推荐）

```markdown
# 文档标题

这是文档正文。

## 图片示例

![截图说明](../images/screenshot.png)

![流程图](../images/diagram1.png)

![照片](../images/photo.jpg)
```

**优点：**
- ✅ 导入后自动工作
- ✅ 保持文件夹结构
- ✅ 相对路径更灵活

#### 同目录图片

```
docs/
├── chapter1.md
└── cover.png
```

```markdown
# 第一章

![封面](./cover.png)
```

## 导入步骤

### 1. 运行导入命令

```bash
pnpm import-obsidian ~/Documents/我的笔记 "系列名称"
```

### 2. 查看导入结果

```
📦 Importing Obsidian vault: ~/Documents/我的笔记
📚 Series name: 系列名称
🏷️  Category: 系列名称
🔖 Tags: 系列名称

🔍 Scanning for Markdown files...
   Found 15 Markdown files

🖼️ Scanning for image files...
   Found and copied 23 image files

📝 Processing files...
   ✓ docs/chapter1.md
   ✓ docs/chapter2.md
   ✓ ...
   ✓ images/diagram1.png
   ✓ images/screenshot.png
   ...

✅ Import complete!
   - Markdown files processed: 15
   - Image files copied: 23
   - Total files: 38
```

### 3. 验证图片

```bash
# 查看导入的图片
find src/content/posts/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" \)

# 预览博客
pnpm dev
```

## 图片路径问题排查

### 问题 1: 图片不显示

**检查清单：**
```bash
# 1. 确认图片文件已导入
ls src/content/posts/images/

# 2. 检查相对路径是否正确
# 在 Obsidian 中: ../images/photo.png
# 导入后应为: ./images/photo.png (相对于文档所在位置)
```

### 问题 2: 相对路径错误

**Obsidian 结构：**
```
notes/
├── article.md
└── images/
    └── photo.png
```

**article.md 中的引用：**
```markdown
# 错误的引用
![照片](images/photo.png)  # ❌ 导入后路径可能不对

# 正确的引用
![照片](./images/photo.png)  # ✅ 从 article.md 到 photo.png
```

### 问题 3: 绝对路径

如果在 Obsidian 中使用了绝对路径：

```markdown
![图片](/Users/username/Documents/notes/images/photo.png)
```

**解决方案：**
1. 在 Obsidian 中改为相对路径
2. 或在导入后手动编辑 md 文件，修正图片路径

## 常见图片格式

Obsidian 常用的图片格式都支持：

| 格式 | 扩展名 | 说明 |
|------|--------|------|
| PNG | .png | 无损压缩，透明背景 |
| JPEG | .jpg, .jpeg | 有损压缩，照片常用 |
| GIF | .gif | 支持动画 |
| SVG | .svg | 矢量图，可缩放 |
| WebP | .webp | 现代格式，高效压缩 |

所有这些格式都会被自动复制！

## 最佳实践

### 1. 使用相对路径

```markdown
# ✅ 推荐
![图片](./images/photo.png)
![图表](../shared-assets/diagram.svg)

# ❌ 不推荐
![图片](/Users/username/Documents/notes/images/photo.png)
![图片](D:\\Notes\\Images\\photo.png)
```

### 2. 组织图片文件夹

```
MyVault/
├── images/           # 公共图片
├── docs/
│   ├── images/       # 专用图片
│   └── article.md
└── shared/
    └── assets/       # 共享资源
```

### 3. 图片命名

使用有意义的文件名：

```
✅ diagram-architecture.png
✅ screenshot-installation-step1.jpg
✅ logo-dark-theme.svg

❌ img001.png
�️ capture2.jpg
�️ logo1.svg
```

## 前端图片引用

在 frontmatter 中添加封面图：

```yaml
---
title: 文章标题
image: ./cover.png  # 相对于文章目录
---
```

或在文章中使用：

```markdown
# 文章标题

![文章封面](./cover.png)
```

## 故障排查

### 检查导入日志

导入完成后，查看日志输出：

```
🖼️ Scanning for image files...
   Found and copied 23 image files  # ← 确认图片数量
```

### 验证文件结构

```bash
# 查看完整的文件夹结构
tree src/content/posts/

# 或使用 ls
ls -R src/content/posts/
```

### 检查图片链接

在浏览器中查看网页源代码，确认图片路径：

```html
<!-- 应该是这样的相对路径 -->
<img src="../../images/photo.png">

<!-- 不应该是绝对路径 -->
<img src="/Users/username/notes/images/photo.png">
```

## 总结

✅ **自动处理**：无需手动复制图片
✅ **保持结构**：文件夹结构完整保留
✅ **相对路径**：推荐使用相对路径
✅ **支持多种格式**：PNG, JPG, GIF, SVG, WebP 等
✅ **无需配置**：开箱即用

运行 `pnpm import-obsidian` 即可自动导入所有内容！
