# Hooks API

Resin Hooks 提供了一系列实用的 React Hooks，帮助开发者更高效地构建 React 应用。

## 目录

### 状态管理

- [useBoolean](/hooks/useBoolean) - 管理布尔值状态
- [useLatest](/hooks/useLatest) - 保存最新的值引用，解决闭包问题

### 性能优化

- [useVirtualList](/hooks/useVirtualList) - 虚拟列表，高效渲染大量数据

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
import { useBoolean, useLatest, useVirtualList } from '@resin-hooks/core';

function App() {
  // 使用 useBoolean
  const [value, { toggle }] = useBoolean(false);

  // 使用 useLatest
  const latestValue = useLatest(value);

  // 使用 useVirtualList
  const { list, containerProps, totalHeight } = useVirtualList(data, {
    containerHeight: 400,
    itemHeight: 50,
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

### useVirtualList

虚拟列表 Hook，用于高效渲染大量数据列表。

**特性：**

- 只渲染可见区域的项目
- 支持固定高度和动态高度
- 提供滚动控制方法
- 性能优化，支持万级数据渲染

[查看完整文档 →](/hooks/useVirtualList)

## 贡献

欢迎贡献新的 Hooks 或改进现有 Hooks！

## 许可证

ISC
