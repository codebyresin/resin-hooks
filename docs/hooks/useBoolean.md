# useBoolean

用于管理布尔值状态的 Hook。

## 基本信息

- **引入**：`import { useBoolean } from '@resin-hooks/core';`
- **类型**：`useBoolean(initialValue?: boolean): [boolean, UseBooleanActions]`

## 参数

| 参数         | 类型      | 默认值  | 说明       |
| ------------ | --------- | ------- | ---------- |
| initialValue | `boolean` | `false` | 初始布尔值 |

## 返回值

返回一个元组，包含：

1. **value** (`boolean`): 当前的布尔值
2. **actions** (`UseBooleanActions`): 操作方法的对象，包含：
   - `setTrue()`: 设置为 `true`
   - `setFalse()`: 设置为 `false`
   - `set(value: boolean)`: 设置任意布尔值
   - `toggle()`: 切换布尔值

## 使用示例

```tsx
import { useBoolean } from '@resin-hooks/core';

function App() {
  const [value, { setTrue, setFalse, toggle, set }] = useBoolean(false);

  return (
    <div>
      <p>Value: {value.toString()}</p>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => set(true)}>Set via set()</button>
    </div>
  );
}
```

## 使用场景

- 控制开关状态（如模态框、下拉菜单）
- 管理布尔标志位
- 切换 UI 状态
