# 快速参考

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 文章管理

```bash
# 创建新文章
pnpm new-post "文章标题"

# 导入 Obsidian 仓库
pnpm import-obsidian /path/to/vault [系列名称]

# 修复代码块语言
pnpm fix-code-languages
```

## 代码质量

```bash
# 格式化代码
pnpm format

# 检查并自动修复
pnpm lint
```

## Obsidian 导入流程

### 1. 导入笔记

```bash
pnpm import-obsidian ~/Documents/Obsidian/笔记仓库名
```

**自动完成：**
- ✅ 添加 frontmatter
- ✅ 转换 Wiki 链接
- ✅ 处理代码块语言
- ✅ 设置系列/分类/标签

### 2. 验证导入

```bash
pnpm dev
```

检查：
- 链接是否正常跳转
- 代码块是否有语法高亮
- 文章是否在主页显示

### 3. 调整内容（可选）

编辑 `src/content/posts/` 中的文件：
- 修改 `title`、`description`
- 添加 `image` 封面图
- 调整 `published` 日期
- 补充或修改 `tags`

### 4. 构建部署

```bash
pnpm build
```

上传 `dist/` 目录到服务器。

## 系列功能

### 创建系列

在文章 frontmatter 中添加：

```yaml
series: "系列名称"
```

同一系列的文章：
- 在主页合并为一个卡片
- 点击卡片查看系列所有文章
- 按时间倒序排列

### 配置

`src/constants/constants.ts`:

```typescript
export const MERGE_SERIES_ON_HOME = true;  // 是否在主页合并系列
```

## 代码块语言处理

### 支持的语言

无需处理：`javascript`, `python`, `java`, `c`, `cpp`, `go`, `rust`, `html`, `css`, `bash`, `json`, `yaml`, `sql` 等

### 不支持的语言

自动映射：
- `verilog` → `c`
- `systemverilog` → `c`
- `vhdl` → `c`
- `tcl` → `txt`

### 手动修复

```bash
pnpm fix-code-languages
```

## 文件结构

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

## 常用配置

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

## 故障排查

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

## 文档

- [Obsidian 导入指南](./OBSIDIAN_IMPORT.md)
- [代码语言修复](./CODE_LANGUAGE_FIX.md)
- [AGENTS.md](../AGENTS.md) - 开发者指南

## 快速开始新项目

```bash
# 1. 导入笔记
pnpm import-obsidian ~/MyNotes

# 2. 启动开发服务器
pnpm dev

# 3. 访问 http://localhost:4321

# 4. 调整内容后构建
pnpm build

# 5. 上传 dist/ 到服务器
```
