# 🍥Fuwari

基于 [Astro](https://astro.build) 开发的静态博客模板。

[**🖥️在线预览（Vercel）**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

## ✨ 功能特性

- [x] 基于 Astro 和 Tailwind CSS 开发
- [x] 流畅的动画和页面过渡
- [x] 亮色 / 暗色模式
- [x] 自定义主题色和横幅图片
- [x] 响应式设计
- [ ] 评论
- [x] 搜索
- [x] 文内目录
- [x] 系列/合集功能
- [x] Obsidian 笔记导入

## 👀 要求

- Node.js >= 18.20.8
- pnpm <= 9

## 🚀 使用方法 1

使用 [create-fuwari](https://github.com/L4Ph/create-fuwari) 在本地初始化项目。

```sh
# npm
npm create fuwari@latest

# yarn
yarn create fuwari

# pnpm
pnpm create fuwari@latest

# bun
bun create fuwari@latest

# deno
deno run -A npm:create-fuwari@latest
```

1. 通过配置文件 `src/config.ts` 自定义博客
2. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
3. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 `astro.config.mjs` 中的站点设置。

## 🚀 使用方法 2

1. 使用此模板[生成新仓库](https://github.com/saicaca/fuwari/generate)或 Fork 此仓库
2. 进行本地开发，Clone 新的仓库，执行 `pnpm install` 和 `pnpm add sharp` 以安装依赖
   - 若未安装 [pnpm](https://pnpm.io)，执行 `npm install -g pnpm`
3. 通过配置文件 `src/config.ts` 自定义博客
4. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
5. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 `astro.config.mjs` 中的站点设置。

## ⚙️ 文章 Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # 仅当文章语言与 `config.ts` 中的网站语言不同时需要设置
series: 系列名称  # 可选：将文章归入系列
---
```

## 🧞 命令

下列命令均需要在项目根目录执行：

| Command                           | Action                            |
|:----------------------------------|:----------------------------------|
| `pnpm install` 并 `pnpm add sharp` | 安装依赖                              |
| `pnpm dev`                        | 在 `localhost:4321` 启动本地开发服务器      |
| `pnpm build`                      | 构建网站至 `./dist/`                   |
| `pnpm preview`                    | 本地预览已构建的网站                        |
| `pnpm new-post <filename>`        | 创建新文章                             |
| `pnpm import-obsidian <path>`     | 导入 Obsidian 笔记仓库                  |
| `pnpm fix-code-languages`         | 修复代码块语言标记                         |
| `pnpm check`                      | 运行 Astro 检查                        |
| `pnpm type-check`                 | 运行 TypeScript 类型检查                |
| `pnpm lint`                       | 运行 Biome linter 并自动修复               |
| `pnpm format`                     | 使用 Biome 格式化代码                    |
| `pnpm astro ...`                  | 执行 `astro add`, `astro check` 等指令 |
| `pnpm astro --help`               | 显示 Astro CLI 帮助                   |

## 📦 Obsidian 笔记导入

支持一键导入 Obsidian 笔记仓库，自动处理图片、链接、代码块等。

### 基本用法

```bash
# 导入 Obsidian 仓库
pnpm import-obsidian /path/to/vault

# 使用自定义系列名称
pnpm import-obsidian /path/to/vault "系列名称"
```

### 自定义配置

支持自定义日期、分类、标签：

```bash
# 完全自定义（日期、分类、标签）
pnpm import-obsidian /path/to/vault "系列名称" \
  --date="2025-01-15" \
  --category="技术文档" \
  --tags="JavaScript,React,前端"

# 只自定义日期
pnpm import-obsidian /path/to/vault "系列名称" --date="2025-01-01"

# 只自定义分类
pnpm import-obsidian /path/to/vault "系列名称" --category="编程"

# 只自定义标签
pnpm import-obsidian /path/to/vault "系列名称" --tags="React,Vue,前端"
```

**参数说明：**
- `--date="YYYY-MM-DD"` - 设置所有文档的发布日期
- `--category="名称"` - 设置所有文档的分类
- `--tags="tag1,tag2,tag3"` - 设置所有文档的标签（逗号分隔）

### 自动功能

导入脚本会自动完成以下操作：

1. ✅ 添加完整的 frontmatter（标题、日期、标签、分类、系列）
2. ✅ 将 Obsidian 的 Wiki 链接 `[[文件名]]` 转换为网页链接
3. ✅ 保留原有的文件夹结构
4. ✅ **自动复制所有图片文件**（PNG, JPG, GIF, SVG, WebP 等）
5. ✅ 自动设置系列、标签、分类
6. ✅ 保留原有 frontmatter（如有）
7. ✅ 自动处理代码块语言（将不支持的语言映射为支持的）

### 图片文件处理

脚本会自动复制所有图片文件到博客项目中，保持相对路径不变。

**支持的图片格式：**
- `.png` - PNG 图片
- `.jpg` / `.jpeg` - JPEG 图片
- `.gif` - GIF 动画
- `.svg` - SVG 矢量图
- `.webp` - WebP 图片
- `.bmp` - BMP 图片
- `.ico` - 图标文件

**文件夹结构保留：**

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

### Wiki 链接转换

脚本会将 Obsidian 的 Wiki 链接格式转换为网页链接：

| Obsidian 格式 | 转换后 |
|--------------|--------|
| `[[文档]]` | `[文档](/posts/文档/)` |
| `[[文档\|显示文本]]` | `[显示文本](/posts/文档/)` |

### 代码块语言处理

脚本会自动处理代码块的语言标记，将不支持的语言映射为支持的替代语言：

**支持的语言：**
- Web: javascript, typescript, html, css
- 后端: python, java, go, ruby, php
- 系统级: c, cpp, rust, swift, kotlin, scala
- 脚本: bash, sh, powershell
- 配置: json, xml, yaml, toml, sql

**不支持的语言处理：**
- `verilog` → `c`
- `systemverilog` → `c`
- `vhdl` → `c`
- `tcl` → `txt`
- 其他不支持的语言 → `txt`

如果已导入文件，可运行以下命令手动修复：

```bash
pnpm fix-code-languages
```

### 使用示例

```bash
# 导入 "JavaScript 学习笔记" 仓库
pnpm import-obsidian ~/Documents/Obsidian/JavaScript学习笔记

# 结果：
# - 所有 md 文件复制到 src/content/posts/
# - 系列名称: JavaScript学习笔记
# - 分类: JavaScript学习笔记
# - 标签: ["JavaScript学习笔记"]

# 导入并自定义配置
pnpm import-obsidian ~/Notes "技术文档" \
  --date="2025-01-15" \
  --category="技术" \
  --tags="JavaScript,React,前端"
```

## 📚 系列/合集功能

支持将文章归入系列，在主页以卡片形式展示。

### 创建系列

在文章 frontmatter 中添加：

```yaml
series: "系列名称"
```

同一系列的文章：
- 在主页合并为一个卡片
- 点击卡片查看系列所有文章
- **按文件名序号排序**（如 `1. 标题.md`）
- 若文件名无序号，则按日期排序

### 文件名序号排序

支持从文件名中自动提取序号并排序：

| 文件名 | 序号 | 排序位置 |
|--------|------|---------|
| `1. 标题.md` | 1 | 第 1 位 |
| `2. 标题.md` | 2 | 第 2 位 |
| `10. 标题.md` | 10 | 第 10 位 |
| `A. 标题.md` | A | 数字序号后 |
| `B. 标题.md` | B | 数字序号后 |
| `标题.md` | 无 | 最后 |

### 配置

在 `src/constants/constants.ts` 中：

```typescript
export const MERGE_SERIES_ON_HOME = true;  // 是否在主页合并系列
```

## 🔧 常用配置

### 修改网站信息

编辑 `src/config.ts`:

```typescript
export const siteConfig = {
  title: "网站标题",
  subtitle: "副标题",
  lang: "zh_CN",
  themeColor: { hue: 250, fixed: false },
  // ...
}
```

### 添加导航链接

```typescript
export const navBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    { name: "GitHub", url: "https://github.com/xxx", external: true },
  ],
}
```

## 📂 文件结构

```
src/
├── content/
│   └── posts/           # 所有文章
│       ├── 系列1/
│       │   ├── 文章1.md
│       │   └── 文章2.md
│       └── 独立文章.md
├── components/          # 组件
├── config.ts            # 全局配置
├── layouts/             # 布局
└── pages/               # 页面
```

## 🔍 故障排查

### 构建错误

```bash
# 清理缓存
rm -rf node_modules .astro dist
pnpm install
```

### Node.js 版本

要求：Node.js >= 18.20.8

```bash
node --version
```

### 类型错误

```bash
pnpm type-check
```

### 格式问题

```bash
pnpm format
pnpm lint
```

## 🚀 快速开始

```bash
# 1. 导入 Obsidian 笔记
pnpm import-obsidian ~/MyNotes

# 2. 启动开发服务器
pnpm dev

# 3. 访问 http://localhost:4321

# 4. 调整内容后构建
pnpm build

# 5. 上传 dist/ 到服务器
```

## 📖 更多文档

- [AGENTS.md](../AGENTS.md) - 开发者指南
