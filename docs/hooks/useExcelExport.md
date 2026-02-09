# useExcelExport

前端 Excel 导出 Hook，支持大批量数据、进度展示、取消导出，以及表头映射与部分列导出。

## 基本信息

- **引入**：`import { useExcelExport } from '@resin-hooks/core';`
- **类型**：`useExcelExport(options?: UseExcelExportOptions): UseExcelExportReturn`
- **依赖**：基于 [SheetJS (xlsx)](https://sheetjs.com/) 实现

## 特性

- **分批处理**：按 `chunkSize` 分批写入，避免阻塞主线程
- **进度展示**：`progress` 0-100，便于 UI 展示进度条
- **支持取消**：`cancel()` 可中断导出
- **表头映射**：`headersMap` 将后端英文字段转为中文表头
- **部分导出**：`columns` 限定导出列，适用于「后端返回多字段、前端只导出部分」场景
- **数据源灵活**：支持直接传入数组或 `() => Promise<data[]>` 的异步函数

## 参数

| 参数    | 类型                    | 默认值 | 说明       |
| ------- | ----------------------- | ------ | ---------- |
| options | `UseExcelExportOptions` | `{}`   | 可选配置项 |

### UseExcelExportOptions

| 属性             | 类型                                          | 默认值          | 说明                                              |
| ---------------- | --------------------------------------------- | --------------- | ------------------------------------------------- |
| filename         | `string`                                      | `'export.xlsx'` | 导出文件名                                        |
| sheetName        | `string`                                      | `'Sheet1'`      | 工作表名                                          |
| chunkSize        | `number`                                      | `5000`          | 每批处理行数，用于计算进度                        |
| headersMap       | `Record<string, string>`                      | -               | 字段 key → 表头文案，如 `{ txnId: '交易流水号' }` |
| columns          | `string[]`                                    | -               | 要导出的列（字段 key 数组），不传则导出全部       |
| headersTransform | `(dataKeys: string[]) => ExcelColumnConfig[]` | -               | 高级：动态过滤、排序、重命名表头，优先级最高      |

### ExcelColumnConfig

```ts
type ExcelColumnConfig = { key: string; label: string };
```

## 返回值

| 属性        | 类型                                                                      | 说明                                       |
| ----------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| exportExcel | `(data: Record<string,unknown>[] \| () => Promise<...>) => Promise<void>` | 执行导出，传入数据数组或返回数据的异步函数 |
| progress    | `number`                                                                  | 导出进度 0-100                             |
| loading     | `boolean`                                                                 | 是否正在导出                               |
| error       | `Error \| null`                                                           | 错误信息                                   |
| cancel      | `() => void`                                                              | 取消当前导出                               |

## 使用示例

### 基本用法

```tsx
import { useExcelExport } from '@resin-hooks/core';

function ExportButton() {
  const { exportExcel, progress, loading, error, cancel } = useExcelExport({
    filename: '交易流水.xlsx',
    headersMap: {
      txnId: '交易流水号',
      txnDate: '交易日期',
      amount: '交易金额',
    },
  });

  const handleExport = () => {
    exportExcel(async () => {
      const res = await fetch('/api/export?type=transactions&count=1000');
      const { data } = await res.json();
      return data;
    });
  };

  return (
    <div>
      <button onClick={handleExport} disabled={loading}>
        导出
      </button>
      {loading && (
        <>
          <progress value={progress} max={100} />
          <span>{Math.round(progress)}%</span>
          <button onClick={cancel}>取消</button>
        </>
      )}
      {error && <p>错误：{error.message}</p>}
    </div>
  );
}
```

### 仅导出部分列

```tsx
// 后端返回 20 个字段，列表只展示 8 个，导出也只要这 8 个
const { exportExcel } = useExcelExport({
  filename: '交易流水.xlsx',
  headersMap: TRANSACTIONS_COLUMNS,
  columns: [
    'txnId',
    'txnDate',
    'type',
    'amount',
    'balance',
    'counterpartyName',
    'status',
    'remark',
  ],
});

exportExcel(async () => {
  const { data } = await fetch('/api/export').then((r) => r.json());
  return data;
});
```

### 传入静态数组

```tsx
const data = [
  { id: 1, name: '张三', amount: 100 },
  { id: 2, name: '李四', amount: 200 },
];

const { exportExcel } = useExcelExport({
  filename: '列表.xlsx',
  headersMap: { id: 'ID', name: '姓名', amount: '金额' },
});

exportExcel(data);
```

### 高级：headersTransform

```tsx
// 动态过滤、排序、重命名
const { exportExcel } = useExcelExport({
  headersTransform: (keys) =>
    keys
      .filter(k => !['internalId'].includes(k))
      .sort((a, b) => /* 自定义排序 */)
      .map(k => ({ key: k, label: headersMap[k] ?? k })),
});
```

## 设计思路

1. **headersMap**：后端用英文字段，导出需中文表头，传入 `headersMap` 做字段 → 表头映射。
2. **columns**：后端返回很多字段，列表只展示部分，导出也只需部分，传入 `columns` 限定导出列。
3. **通用数据流**：Hook 始终拿到完整数据（fetch 全部），通过 `columns` / `headersTransform` 做列筛选与表头映射，无需改动接口。
4. **优先级**：`headersTransform` > `columns` + `headersMap` > 全量 + `headersMap`

## 使用场景

- **后台管理系统**：列表页导出 Excel，支持筛选条件、自定义列
- **报表导出**：大批量数据（10 万+）导出，带进度与取消
- **数据备份**：将接口数据导出为 Excel 供离线查看

## 注意事项

- 需要安装 `xlsx` 依赖（`@resin-hooks/core` 已包含）
- 大批量导出时建议 `chunkSize` 设置为 2000-5000，以平衡进度刷新频率与性能
- 异步数据源需在 `exportExcel` 调用时传入函数，确保每次导出可获取最新数据
