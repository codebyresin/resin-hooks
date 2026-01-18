# 指南

## 什么是 Resin Hooks？

Resin Hooks 是一个实用的 React 业务 Hooks 库，提供了一系列常用的 React Hooks，帮助开发者更高效地构建 React 应用。

## 安装

```bash
pnpm add @resin-hooks/core
```

## 使用示例

### useBoolean

```tsx
import { useBoolean } from '@resin-hooks/core';

function App() {
  const [value, { setTrue, setFalse, toggle }] = useBoolean(false);

  return (
    <div>
      <p>Value: {value.toString()}</p>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

## 贡献指南

欢迎贡献代码或提出建议！
