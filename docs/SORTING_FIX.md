# 系列文章排序修复

## 问题
当导入的 Obsidian 文档发布日期相同时，网页中的排序混乱，无法保持导入时的默认顺序。

## 解决方案
实现了**按文件名序号排序**：
- **优先按文件名中的数字/字母序号排序**
- 文件名格式：`1. 标题.md`、`2. 标题.md`、`A. 标题.md` 等
- 数字序号在前，字母序号在后
- 无序号的文件排在最后

## 实现细节

### 修改的函数
**`getPostsBySeries()`** - 获取系列内文章并排序

### 排序逻辑

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
}

// 按序号排序
postsWithSequenceNumber.sort((a, b) => {
    // 两个都是数字
    if (typeof a.sequenceNumber === "number" && typeof b.sequenceNumber === "number") {
        return a.sequenceNumber - b.sequenceNumber;
    }

    // 至少一个是字符串
    if (typeof a.sequenceNumber === "number") return -1; // 数字在前
    if (typeof b.sequenceNumber === "number") return 1;

    // 都是字符串，按字母排序
    if (a.sequenceNumber < b.sequenceNumber) return -1;
    if (a.sequenceNumber > b.sequenceNumber) return 1;

    return 0; // 序号相同，保持原序
});
```

## 效果对比

### 之前（按日期排序）
```
系列：FPGA笔记
- 1. 建立时间和保持时间.md (2025-03-02)
- 11. 专用硬核.md (2025-03-02)  # 顺序混乱
- 2. 关键路径.md (2025-03-02)
```

### 现在（按文件名序号排序）
```
系列：FPGA笔记
- 1. 建立时间和保持时间.md
- 2. 关键路径.md  # ✅ 按序号正确排序
- 3. 时序约束和物理约束.md
- ...
- 11. 专用硬核.md
```

## 支持的序号格式

| 文件名 | 提取的序号 | 排序 |
|--------|------------|------|
| `1. 标题.md` | 1 | 数字 1 |
| `2. 标题.md` | 2 | 数字 2 |
| `10. 标题.md` | 10 | 数字 10 |
| `A. 标题.md` | A | 字母 A |
| `B. 标题.md` | B | 字母 B |
| `标题.md` | Infinity | 最后 |

## 适用场景

1. **Obsidian 笔记导入** - 文件名带序号的笔记
2. **教程系列** - 按章节序号排列
3. **有序文档集合** - 任何需要按顺序显示的文档

## 技术说明

使用正则表达式从文件名中提取序号前缀：
- `^(\d+|[A-Za-z])[-.]` - 匹配开头的数字或字母
- 数字序号转换为整数进行数值比较
- 字母序号进行字符串比较
- 无序号文件使用 Infinity 确保排在最后

## 注意事项

- 只影响**系列页面**的排序
- 主页文章仍按日期排序（或按配置）
- 文件名必须以 `序号.` 或 `序号-` 开头才能被识别

## 验证
运行 `pnpm dev` 后，访问系列页面或主页，确认：
- 相同日期的文章按导入顺序排列
- 不同日期的文章按时间正确排序
