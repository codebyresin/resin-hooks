# useThrottle

用于限制函数执行频率的 Hook，在指定间隔内最多按规则执行一次（或 leading + trailing 各一次）。

## 基本信息

- **引入**：`import { useThrottle } from '@resin-hooks/core';`
- **类型**：`useThrottle<T>(fn: T, options?: UseThrottleOptions): { throttleFn: ThrottleFn<T>; cancel: () => void }`

## 参数

| 参数    | 类型                 | 默认值 | 说明           |
| ------- | -------------------- | ------ | -------------- |
| fn      | `(...args) => R`     | -      | 需要节流的函数 |
| options | `UseThrottleOptions` | 见下表 | 可选配置项     |

### UseThrottleOptions

| 属性           | 类型               | 默认值  | 说明                                     |
| -------------- | ------------------ | ------- | ---------------------------------------- |
| interval       | `number`           | `1000`  | 节流间隔（毫秒）                         |
| leading        | `boolean`          | `true`  | 是否在首次满足条件时立即执行             |
| trailing       | `boolean`          | `false` | 是否在间隔结束后用最后一次参数补执行一次 |
| resultCallback | `(res: R) => void` | -       | fn 执行后的回调，可获取返回值            |

## 返回值

| 属性       | 类型                          | 说明                                     |
| ---------- | ----------------------------- | ---------------------------------------- |
| throttleFn | `(...args) => R \| undefined` | 节流后的函数，调用时传入与 fn 相同的参数 |
| cancel     | `() => void`                  | 取消未执行的 trailing 定时器，并重置状态 |

## 使用示例

### 基本用法

```tsx
import { useState } from 'react';
import { useThrottle } from '@resin-hooks/core';

function SearchInput() {
  const [value, setValue] = useState('');
  const [throttledValue, setThrottledValue] = useState('');

  const { throttleFn, cancel } = useThrottle(
    (val: string) => setThrottledValue(val),
    { interval: 500, leading: true, trailing: true },
  );

  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          throttleFn(val);
        }}
      />
      <p>节流后的值: {throttledValue}</p>
      <button onClick={cancel}>取消未执行</button>
    </div>
  );
}
```

### 使用 resultCallback 获取执行结果

```tsx
const { throttleFn } = useThrottle((id: number) => fetchUser(id), {
  interval: 1000,
  resultCallback: (user) => {
    console.log('获取到用户:', user);
  },
});

throttleFn(1);
```

### leading 与 trailing 组合

```tsx
// leading: true, trailing: true - 首次立即执行，间隔末再执行一次（最多两次）
const { throttleFn } = useThrottle(fn, {
  interval: 300,
  leading: true,
  trailing: true,
});

// leading: false, trailing: true - 仅间隔末执行一次
const { throttleFn } = useThrottle(fn, {
  interval: 300,
  leading: false,
  trailing: true,
});

// leading: true, trailing: false - 仅首次或满足间隔时执行，无 trailing 补执行
const { throttleFn } = useThrottle(fn, {
  interval: 300,
  leading: true,
  trailing: false,
});
```

## 使用场景

- **搜索输入**：用户输入时限制请求频率，减少接口调用
- **滚动/resize 监听**：限制 scroll、resize 等高频事件的回调执行
- **按钮防重复点击**：在间隔内只响应一次点击
- **实时统计/埋点**：限制上报频率，避免过于频繁

## 注意事项

- 组件卸载时会自动清理 trailing 定时器，无需手动处理
- `throttleFn` 在 `interval`、`leading`、`trailing`、`resultCallback` 变化时会重新创建
- `cancel` 会清空未执行的 trailing，并将内部状态重置，下次调用会重新开始节流周期
