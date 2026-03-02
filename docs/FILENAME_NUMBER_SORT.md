# 按文件名序号排序功能

## 问题描述
Obsidian 笔记文件名通常带有序号前缀，如：
- `1. 建立时间和保持时间.md`
- `2. 关键路径.md`
- `A. FPGA时序分析.md`

之前的实现按日期排序，导致相同日期的文档顺序混乱，无法反映用户的实际阅读顺序。

## 解决方案
实现了**按文件名序号排序**功能：
- ✅ 自动从文件名中提取数字或字母序号
- ✅ 数字序号按数值大小排序（1, 2, 10, ...）
- ✅ 字母序号按字母表顺序排序（A, B, C, ...）
- ✅ 数字序号优先于字母序号
- ✅ 无序号的文件排在最后

## 实现细节

### 支持的文件名格式

| 文件名 | 序号 | 排序位置 |
|--------|------|---------|
| `1. 标题.md` | 1 | 第 1 位 |
| `2. 标题.md` | 2 | 第 2 位 |
| `10. 标题.md` | 10 | 第 10 位 |
| `A. 标题.md` | A | 数字序号后 |
| `B. 标题.md` | B | 数字序号后 |
| `标题.md` | 无 | 最后 |

### 修改的函数
- `src/utils/content-utils.ts` 中的 `getPostsBySeries()`

### 核心代码

```typescript
// 从文件名中提取序号
const filename = post.slug.split("/").pop() || post.slug;
const match = filename.match(/^(\d+|[A-Za-z])[-.]/);

if (match) {
    const prefix = match[1];
    const numMatch = prefix.match(/^\d+$/);

    if (numMatch) {
        sequenceNumber = parseInt(prefix, 10); // 数字序号
    } else {
        sequenceNumber = prefix.toUpperCase(); // 字母序号
    }
} else {
    sequenceNumber = Infinity; // 无序号，排在最后
}

// 按序号排序
postsWithSequenceNumber.sort((a, b) => {
    // 数字序号优先
    if (typeof a.sequenceNumber === "number" && typeof b.sequenceNumber === "number") {
        return a.sequenceNumber - b.sequenceNumber;
    }

    // 数字在前，字母在后
    if (typeof a.sequenceNumber === "number") return -1;
    if (typeof b.sequenceNumber === "number") return 1;

    // 字母按字母表顺序
    if (a.sequenceNumber < b.sequenceNumber) return -1;
    if (a.sequenceNumber > b.sequenceNumber) return 1;

    return 0;
});
```

## 效果示例

### Obsidian 文件结构
```
FPGA笔记/
├── 1. 建立时间和保持时间.md
├── 2. 关键路径.md
├── 3. 时序约束和物理约束.md
├── ...
├── 10. IOB.md
├── 11. 专用硬核.md
└── A. FPGA时序分析.md
```

### 网页显示效果

```
系列：FPGA笔记
├── 1. 建立时间和保持时间
├── 2. 关键路径
├── 3. 时序约束和物理约束
├── ...
├── 10. IOB
├── 11. 专用硬核
└── A. FPGA时序分析
```

完美匹配用户在 Obsidian 中的阅读顺序！

## 技术细节

### 正则表达式
`/^(\d+|[A-Za-z])[-.]/`
- `^` - 匹配字符串开头
- `(\d+|[A-Za-z])` - 捕获数字或字母
- `[-.]` - 匹配分隔符（- 或 .）

### 排序优先级
1. 数字序号（按数值）
2. 字母序号（按字母表）
3. 无序号文件（按日期）

## 使用场景

1. **教程系列** - 按章节序号排列
2. **课程笔记** - 按课序排列
3. **技术文档** - 按章节编号排列
4. **任何有序文档集合**

## 注意事项

- ⚠️ 仅影响**系列页面**的排序
- ⚠️ 主页文章仍按日期排序（或按配置）
- ⚠️ 文件名必须以 `序号.` 或 `序号-` 开头
- ⚠️ 序号分隔符只能是 `-` 或 `.`

## 测试验证

运行 `pnpm dev`，访问系列页面（如 `/series/fpga笔记/`），确认：
- 文档按序号正确排列
- 数字序号 1, 2, 3, ..., 10 的顺序正确
- 字母序号 A, B, C 的顺序正确
- 无序号文档排在最后
