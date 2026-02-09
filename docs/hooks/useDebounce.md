# useDebounce

用于延迟执行函数的 Hook，在指定延迟内多次调用时只会执行最后一次。

## 基本信息

- **引入**：`import { useDebounce } from '@resin-hooks/core';`
- **类型**：`useDebounce<T>(fn: T, options?: UseDebounceOptions): { debounceFn: DebounceFn<T>; cancel: () => void }`

## 与 useThrottle 的区别

| 特性     | useDebounce            | useThrottle            |
| -------- | ---------------------- | ---------------------- |
| 执行时机 | 停止调用后延迟执行     | 按固定间隔执行         |
| 适用场景 | 搜索输入、表单校验     | 滚动、resize、连续点击 |
| 典型用法 | 用户停止输入后发起请求 | 限制高频事件的回调频率 |

## 参数

| 参数    | 类型                 | 默认值 | 说明           |
| ------- | -------------------- | ------ | -------------- |
| fn      | `(...args) => R`     | -      | 需要防抖的函数 |
| options | `UseDebounceOptions` | 见下表 | 可选配置项     |

### UseDebounceOptions

| 属性           | 类型               | 默认值  | 说明                                       |
| -------------- | ------------------ | ------- | ------------------------------------------ |
| delay          | `number`           | `2000`  | 防抖延迟（毫秒）                           |
| immediate      | `boolean`          | `false` | 是否在首次调用时立即执行，后续在延迟后执行 |
| resultCallback | `(res: R) => void` | -       | fn 执行后的回调，可获取返回值              |

## 返回值

| 属性       | 类型                          | 说明                                     |
| ---------- | ----------------------------- | ---------------------------------------- |
| debounceFn | `(...args) => R \| undefined` | 防抖后的函数，调用时传入与 fn 相同的参数 |
| cancel     | `() => void`                  | 取消未执行的定时器，并重置状态           |

## 使用示例

### 基本用法（搜索输入）

```tsx
import { useState } from 'react';
import { useDebounce } from '@resin-hooks/core';

function SearchInput() {
  const [value, setValue] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const { debounceFn, cancel } = useDebounce(
    (val: string) => {
      setSearchResult(val);
      // 发起搜索请求
      fetch(`/api/search?q=${val}`).then(/* ... */);
    },
    { delay: 500 },
  );

  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          debounceFn(val);
        }}
      />
      <p>搜索结果: {searchResult}</p>
      <button onClick={cancel}>取消未执行</button>
    </div>
  );
}
```

### immediate 模式

```tsx
// immediate: true - 首次调用立即执行，后续在延迟内调用会重置定时器，停止调用 delay 毫秒后再执行
const { debounceFn } = useDebounce(saveForm, {
  delay: 300,
  immediate: true,
});

// 用户第一次点击保存 → 立即执行
// 用户连续快速点击 → 只有最后一次在 300ms 后执行
```

### 使用 resultCallback 获取执行结果

```tsx
const { debounceFn } = useDebounce((id: number) => fetchUser(id), {
  delay: 300,
  resultCallback: (user) => {
    console.log('获取到用户:', user);
  },
});

debounceFn(1);
```

## 使用场景

- **搜索输入**：用户停止输入后发起搜索请求，减少接口调用
- **表单校验**：输入停止后校验，避免输入过程中频繁校验
- **窗口 resize**：窗口尺寸稳定后再计算布局
- **自动保存**：编辑停止后延迟保存，避免频繁写入

## 注意事项

- 组件卸载时建议调用 `cancel` 清理未执行的定时器
- `debounceFn` 在 `delay`、`immediate`、`resultCallback` 变化时会重新创建
- `cancel` 会清除未执行的定时器并将内部状态重置
