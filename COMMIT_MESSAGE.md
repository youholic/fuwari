feat: 添加系列文章功能、Obsidian导入支持和代码块语言修复

## 新增功能

### 1. 系列文章（Series）功能
- 在文章 frontmatter 中添加 `series` 字段支持
- 创建系列展示页面 `/series/[seriesName]/`
- 主页可选地将系列文章合并为单个卡片展示
- **按文件名序号排序**：支持 `1. 标题.md`、`A. 标题.md` 等格式
- 系列文章按序号或日期排序，使用归档页样式显示
- 在文章卡片、详情页和 metadata 中显示系列信息

**相关文件：**
- `src/content/config.ts` - 添加 series schema 字段
- `src/constants/constants.ts` - 添加 MERGE_SERIES_ON_HOME 配置
- `src/pages/series/[seriesName].astro` - 新建系列页面
- `src/components/PostCard.astro` - 支持系列卡片样式
- `src/components/PostPage.astro` - 支持系列和文章混合显示
- `src/utils/content-utils.ts` - 添加系列相关工具函数

### 2. Obsidian 导入工具
- 自动将 Obsidian vault 导入为博客文章
- 自动转换 Wiki 链接 `[[文档]]` 为网页链接
- 保留文件夹结构
- 自动添加完整的 frontmatter（title、tags、category、series、published 等）
- 支持已有 frontmatter 的文件
- 自动处理代码块语言标记

**相关文件：**
- `scripts/import-obsidian.js` - 新建导入脚本
- `package.json` - 添加 `import-obsidian` 命令
- `docs/OBSIDIAN_IMPORT.md` - 新建导入文档

### 3. 代码块语言自动修复
- 自动扫描并修复不支持的代码块语言
- 将不支持的语言映射为支持的替代语言（如 Verilog → C）
- 支持批量处理所有 markdown 文件
- 保留代码内容，仅修改语言标记

**相关文件：**
- `scripts/fix-code-languages.js` - 新建修复脚本
- `package.json` - 添加 `fix-code-languages` 命令
- `docs/CODE_LANGUAGE_FIX.md` - 新建修复文档

### 4. 文档和示例
- 新建 AGENTS.md - 为 AI 代码助手提供的开发指南
- 新建 docs/QUICK_REFERENCE.md - 快速参考手册
- 创建示例文章用于演示系列功能
- 导入 FPGA 笔记作为实际使用示例

**相关文件：**
- `AGENTS.md` - 新建
- `docs/QUICK_REFERENCE.md` - 新建
- `src/content/posts/Java 基础教程*.md` - 新建示例
- `src/content/posts/JavaScript 基础教程*.md` - 新建示例
- `src/content/posts/FPGA笔记/` - 新建实际示例

## 使用示例

### 创建系列文章

在文章 frontmatter 中添加：
```yaml
series: "系列名称"
```

同一系列的文章会在主页合并显示，点击可查看该系列所有文章。

### 导入 Obsidian

```bash
pnpm import-obsidian /path/to/vault [系列名称]
```

### 修复代码块语言

```bash
pnpm fix-code-languages
```

## 配置选项

在 `src/constants/constants.ts` 中：
```typescript
export const MERGE_SERIES_ON_HOME = true; // 是否在主页合并系列
```

## 向后兼容

- 完全兼容现有文章，不设置 series 的文章正常显示
- Wiki 链接转换自动处理，现有链接不受影响
- 代码块语言修复仅修改标记，不影响代码内容
- 稳定排序确保日期相等时保持原始顺序
- 代码块语言修复仅修改标记，不影响代码内容
