# Hooks API

Resin Hooks 提供了一系列实用的 React Hooks，帮助开发者更高效地构建 React 应用。

## 目录

### 状态管理

- [useBoolean](/hooks/useBoolean) - 管理布尔值状态
- [useLatest](/hooks/useLatest) - 保存最新的值引用，解决闭包问题

### 性能优化

- [useThrottle](/hooks/useThrottle) - 节流，限制函数执行频率
- [useDebounce](/hooks/useDebounce) - 防抖，延迟执行函数
- [useVirtualList](/hooks/useVirtualList) - 虚拟列表，高效渲染大量数据

### 数据与导出

- [useExcelExport](/hooks/useExcelExport) - Excel 导出，支持单级/多级表头、表头映射、同步/异步数据源

## 快速开始

### 安装

```bash
pnpm add @resin-hooks/core
# 或
npm install @resin-hooks/core
# 或
yarn add @resin-hooks/core
```

### 使用

```tsx
import {
  useBoolean,
  useLatest,
  useThrottle,
  useDebounce,
  useVirtualList,
  useExcelExport,
} from '@resin-hooks/core';

function App() {
  // 使用 useBoolean
  const [value, { toggle }] = useBoolean(false);

  // 使用 useLatest
  const latestValue = useLatest(value);

  // 使用 useThrottle
  const { throttleFn, cancel } = useThrottle((val) => console.log(val), {
    interval: 500,
  });

  // 使用 useDebounce
  const { debounceFn } = useDebounce((val) => fetchSearch(val), {
    delay: 300,
  });

  // 使用 useVirtualList
  const { list, containerProps, totalHeight } = useVirtualList(data, {
    containerHeight: 400,
    itemHeight: 50,
  });

  // 使用 useExcelExport
  const { exportExcel, progress, loading } = useExcelExport({
    fileName: 'data.xlsx',
    headersMap: { id: 'ID', name: '姓名' },
  });

  return <div>...</div>;
}
```

## Hooks 列表

### useBoolean

用于管理布尔值状态的 Hook，提供便捷的操作方法。

**特性：**

- 简洁的 API
- 提供 `setTrue`、`setFalse`、`toggle`、`set` 等方法
- 类型安全

[查看完整文档 →](/hooks/useBoolean)

### useLatest

用于保存最新的值引用，解决闭包中访问到旧值的问题。

**特性：**

- 解决闭包陷阱
- 自动更新 ref.current
- 不影响渲染性能

[查看完整文档 →](/hooks/useLatest)

### useThrottle

用于限制函数执行频率的 Hook，支持 leading、trailing 配置。

**特性：**

- 可配置 interval、leading、trailing
- 支持 resultCallback 获取执行结果
- 提供 cancel 取消未执行的 trailing
- 组件卸载时自动清理定时器

[查看完整文档 →](/hooks/useThrottle)

### useDebounce

防抖 Hook，在指定延迟内多次调用时只会执行最后一次。

**特性：**

- 可配置 delay、immediate
- 支持 resultCallback 获取执行结果
- 提供 cancel 取消未执行的调用
- 适用于搜索输入、表单校验等场景

[查看完整文档 →](/hooks/useDebounce)

### useVirtualList

虚拟列表 Hook，用于高效渲染大量数据列表。

**特性：**

- 只渲染可见区域的项目
- 支持固定高度和动态高度
- 提供滚动控制方法
- 性能优化，支持万级数据渲染

[查看完整文档 →](/hooks/useVirtualList)

### useExcelExport

前端 Excel 导出 Hook，支持单级表头、多级表头、表头映射、部分列导出。

**特性：**

- 单级表头、多级表头（headersMap、headers）
- 部分列导出（colums）
- 支持数组或异步数据源
- 进度、loading、errorInfo 便于 UI 展示

[查看完整文档 →](/hooks/useExcelExport)

## 贡献

欢迎贡献新的 Hooks 或改进现有 Hooks！

## 许可证

ISC
