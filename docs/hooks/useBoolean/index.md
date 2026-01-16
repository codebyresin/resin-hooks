---
title: useBoolean
order: 1
group:
  title: 状态管理
  order: 1
---

# useBoolean

一个用于管理布尔值状态的 Hook。

## 📖 介绍

`useBoolean` 是一个轻量级的 Hook，用于管理布尔值状态，提供了设置 true、设置 false 和切换值的常用操作。

## 🚀 使用

### 基本用法

```tsx
import { useBoolean } from '../../../packages/hooks/src/useBoolean';

function BooleanExample() {
  const [value, setValue, toggle] = useBoolean(false);

  return (
    <div>
      <p>Value: {value ? 'true' : 'false'}</p>
      <button onClick={() => setValue(true)}>Set True</button>
      <button onClick={() => setValue(false)}>Set False</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

## 📚 API

### 参数

| 参数         | 类型      | 默认值  | 说明       |
| ------------ | --------- | ------- | ---------- |
| initialValue | `boolean` | `false` | 初始布尔值 |

### 返回值

| 返回值   | 类型                       | 说明           |
| -------- | -------------------------- | -------------- |
| value    | `boolean`                  | 当前布尔值     |
| setValue | `(value: boolean) => void` | 设置布尔值函数 |
| toggle   | `() => void`               | 切换布尔值函数 |

## 🎯 特性

- ✅ **类型安全**：完整的 TypeScript 类型支持
- ✅ **性能优化**：使用 `useCallback` 缓存函数，避免不必要的重渲染
- ✅ **易用性**：简洁的 API 设计，易于集成

## 🔧 实现原理

`useBoolean` 基于 React 的 `useState` Hook 实现，通过 `useCallback` 优化函数引用，确保在依赖不变时函数引用保持稳定。

## 📝 注意事项

- **初始值**：如果不提供初始值，默认为 `false`
- **性能**：由于使用了 `useCallback`，函数引用在依赖不变时会保持稳定
- **类型**：支持 TypeScript 类型推断，无需手动指定类型
