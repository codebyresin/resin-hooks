# useExcelExport

前端 Excel 导出 Hook，支持单级表头、多级表头、表头映射、部分列导出，以及同步/异步数据源。

## 基本信息

- **引入**：`import { useExcelExport } from '@resin-hooks/core';`
- **类型**：`useExcelExport(options?: UseExcelExportOptions): UseExcelExportReturn`
- **依赖**：基于 [SheetJS (xlsx)](https://sheetjs.com/) 实现

## 特性

- **单级表头**：`headersMap` 将英文字段映射为中文表头
- **多级表头**：`headers` 支持多级分组，自动合并单元格
- **部分列导出**：`colums` 指定导出的列
- **数据源灵活**：支持直接传入数组或 `() => Promise<data[]>` 异步函数
- **进度与状态**：`progress`、`loading`、`errorInfo` 便于 UI 展示

## 参数

| 参数    | 类型                    | 默认值 | 说明       |
| ------- | ----------------------- | ------ | ---------- |
| options | `UseExcelExportOptions` | `{}`   | 可选配置项 |

### UseExcelExportOptions

| 属性       | 类型                     | 默认值       | 说明                                                    |
| ---------- | ------------------------ | ------------ | ------------------------------------------------------- |
| fileName   | `string`                 | `'导出数据'` | 导出文件名（含 .xlsx 后缀由 Hook 自动添加时可不带）     |
| sheetName  | `string`                 | `'Sheet1'`   | 工作表名                                                |
| headersMap | `Record<string, string>` | -            | 字段 key → 表头文案，如 `{ txnId: '交易流水号' }`       |
| colums     | `string[]`               | -            | 要导出的列（字段 key 数组），不传则按数据第一行全部导出 |
| headers    | `ExcelHeader[]`          | -            | 多级表头配置，传入时启用多级表头                        |

### ExcelHeader（多级表头）

```ts
type ExcelHeader = {
  label: string; // 表头显示文字
  key?: string; // 对应字段（仅叶子节点需要）
  children?: ExcelHeader[];
};
```

叶子节点需要 `key` 对应数据字段；非叶子节点用 `label` 作为分组标题，通过 `children` 嵌套。

## 返回值

| 属性        | 类型                                                                      | 说明                                       |
| ----------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| exportExcel | `(data: Record<string,unknown>[] \| () => Promise<...>) => Promise<void>` | 执行导出，传入数据数组或返回数据的异步函数 |
| loading     | `boolean`                                                                 | 是否正在导出                               |
| errorInfo   | `Error \| null`                                                           | 错误信息                                   |
| progress    | `number`                                                                  | 导出进度 0-100                             |

## 使用示例

### 基本用法（单级表头）

```tsx
import { useExcelExport } from '@resin-hooks/core';

function ExportButton() {
  const { exportExcel, progress, loading, errorInfo } = useExcelExport({
    fileName: '交易流水.xlsx',
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
      {loading && <progress value={progress} max={100} />}
      {errorInfo && <p>错误：{errorInfo.message}</p>}
    </div>
  );
}
```

### 传入静态数组

```tsx
const data = [
  { id: 1, name: '张三', amount: 100 },
  { id: 2, name: '李四', amount: 200 },
];

const { exportExcel } = useExcelExport({
  fileName: '列表.xlsx',
  headersMap: { id: 'ID', name: '姓名', amount: '金额' },
});

exportExcel(data);
```

### 仅导出部分列

```tsx
// 后端返回多字段，只导出指定列
const { exportExcel } = useExcelExport({
  fileName: '交易流水.xlsx',
  headersMap: TRANSACTIONS_COLUMNS,
  colums: [
    'txnId',
    'txnDate',
    'type',
    'amount',
    'balance',
    'counterpartyName',
    'status',
  ],
});

exportExcel(async () => {
  const { data } = await fetch('/api/export').then((r) => r.json());
  return data;
});
```

### 多级表头

```tsx
import { useExcelExport, type ExcelHeader } from '@resin-hooks/core';

const headers: ExcelHeader[] = [
  {
    label: '基本信息',
    children: [
      { label: '姓名', key: 'name' },
      { label: '年龄', key: 'age' },
      {
        label: '工作信息',
        children: [
          { label: '部门', key: 'department' },
          { label: '薪资', key: 'salary' },
        ],
      },
    ],
  },
  {
    label: '联系方式',
    children: [
      { label: '手机', key: 'phone' },
      { label: '邮箱', key: 'email' },
    ],
  },
];

const { exportExcel } = useExcelExport({
  fileName: '员工列表.xlsx',
  headersMap: {
    name: '姓名',
    age: '年龄',
    department: '部门',
    salary: '薪资',
    phone: '手机',
    email: '邮箱',
  },
  headers,
});

exportExcel(employeesData);
```

## 设计思路

1. **headersMap**：后端用英文字段，导出需中文表头，传入 `headersMap` 做字段 → 表头映射。
2. **colums**：后端返回多字段，只导出部分时，传入 `colums` 限定导出列。
3. **headers**：需要分组表头（如「基本信息 / 工作信息」）时，使用 `headers` 定义多级结构，由 Hook 自动处理合并单元格。
4. **数据源**：支持 `exportExcel(data[])` 同步数据或 `exportExcel(async () => data[])` 异步拉取，适应不同业务场景。

## 使用场景

- **后台管理系统**：列表页导出 Excel，支持筛选条件、自定义列
- **报表导出**：将接口数据导出为 Excel 供离线查看
- **多级表头报表**：财务、人事等需要分组表头的导出场景

## 注意事项

- 需要安装 `xlsx` 依赖（`@resin-hooks/core` 已包含）
- 异步数据源需在 `exportExcel` 调用时传入函数，确保每次导出可获取最新数据
- 多级表头模式下，`headers` 中叶子节点必须提供 `key`，且 `key` 需与数据字段一致
