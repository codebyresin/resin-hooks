# useLatest

用于保存最新的值引用，解决闭包中访问到旧值的问题。

## 基本信息

- **引入**：`import { useLatest } from '@resin-hooks/core';`
- **类型**：`useLatest<T>(value: T): React.MutableRefObject<T>`

## 参数

| 参数  | 类型 | 说明             |
| ----- | ---- | ---------------- |
| value | `T`  | 需要保存的最新值 |

## 返回值

返回一个 `React.MutableRefObject<T>` 对象，其 `current` 属性始终指向最新的值。

## 使用示例

### 基本用法

```tsx
import { useState, useEffect } from 'react';
import { useLatest } from '@resin-hooks/core';

function App() {
  const [count, setCount] = useState(0);
  const latestCount = useLatest(count);

  useEffect(() => {
    const timer = setInterval(() => {
      // 即使 count 在外部更新，这里也能访问到最新的值
      console.log('Latest count:', latestCount.current);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 依赖数组为空，但能访问到最新的 count

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 解决闭包问题

```tsx
import { useState, useEffect } from 'react';
import { useLatest } from '@resin-hooks/core';

function SearchComponent() {
  const [keyword, setKeyword] = useState('');
  const latestKeyword = useLatest(keyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 使用 latestKeyword.current 确保获取到最新的 keyword
      console.log('搜索:', latestKeyword.current);
    }, 500);

    return () => clearTimeout(timer);
  }, []); // 不需要将 keyword 加入依赖

  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="输入搜索关键词"
    />
  );
}
```

## 工作原理

`useLatest` 使用 `useRef` 和 `useEffect` 来确保 ref 的 `current` 属性始终指向最新的值：

1. 创建一个 ref 对象，初始值为传入的 `value`
2. 在 `useEffect` 中监听 `value` 的变化，更新 `ref.current`
3. 返回的 ref 对象引用保持不变，不会触发额外的重新渲染

## 使用场景

- **定时器/间隔器**：在 `useEffect` 中使用定时器时，需要访问最新的状态值
- **事件监听器**：在事件处理函数中需要访问最新的状态
- **异步操作**：在异步回调中需要访问最新的值
- **避免闭包陷阱**：解决因闭包导致的访问旧值问题

## 注意事项

- 返回的 ref 对象引用保持不变，不会触发额外的重新渲染
- 需要手动访问 `ref.current` 来获取最新值
- 适用于需要在闭包中访问最新值的场景

## 与其他 Hook 的区别

- **useState**：会触发重新渲染，不适合在闭包中使用
- **useRef**：不会自动更新，需要手动管理
- **useLatest**：自动更新 ref.current，但 ref 对象引用不变
