# useStorage

用于在 `localStorage` / `sessionStorage` 中存储数据，并支持**可选过期时间**和**跨标签页同步**的 Hook。

## 基本信息

- **引入**：`import { useStorage } from '@resin-hooks/core';`
- **类型**：

```ts
type StorageType = 'local' | 'session';

interface UseStorageOptions<T> {
  key: string; // 存储的 key（必传）
  expire?: number | null; // 过期时间（毫秒），null / 不传 表示不过期
  type?: StorageType; // 存储类型，默认 local
  defaultValue?: T; // 默认值（存储中无数据或已过期时使用）
}

type UseStorageReturn<T> = [
  T | undefined,
  (value: T, expire?: number | null) => void,
  () => void,
];
```

## 参数

| 参数         | 类型                   | 默认值      | 说明                                      |
| ------------ | ---------------------- | ----------- | ----------------------------------------- |
| options      | `UseStorageOptions<T>` | **必填**    | 存储配置                                  |
| key          | `string`               | -           | 存储使用的 key，建议在项目内保持唯一      |
| expire       | `number \| null`       | `null`      | 过期时间（毫秒），`null` 表示不过期       |
| type         | `'local' \| 'session'` | `'local'`   | 使用 `localStorage` 还是 `sessionStorage` |
| defaultValue | `T`                    | `undefined` | 没有存储值时返回的默认值                  |

## 返回值

返回一个三元组：

1. **value** (`T \| undefined`)：当前存储中的值（可能为默认值或未初始化）
2. **setValue** (`(value: T, expire?: number \| null) => void`)：写入存储并更新状态，可传入自定义过期时间覆盖默认 `expire`
3. **removeValue** (`() => void`)：删除存储，并将状态重置为 `defaultValue`

## 使用示例

### 1. 基础用法（localStorage 持久化 Token）

```tsx
import { useStorage } from '@resin-hooks/core';

function TokenManager() {
  const [token, setToken, removeToken] = useStorage<string>({
    key: 'auth_token',
    type: 'local',
    defaultValue: '',
  });

  const handleLogin = () => {
    // 模拟登录返回 token
    setToken('mock-token-123');
  };

  return (
    <div>
      <p>当前 Token: {token || '(未登录)'}</p>
      <button onClick={handleLogin}>登录并保存 Token</button>
      <button onClick={removeToken}>退出登录（清除 Token）</button>
    </div>
  );
}
```

### 2. 设置过期时间（如 30 分钟自动过期）

```tsx
import { useStorage } from '@resin-hooks/core';

function ExpireToken() {
  const [token, setToken, removeToken] = useStorage<string>({
    key: 'auth_token',
    type: 'local',
    // 30 分钟过期
    expire: 30 * 60 * 1000,
    defaultValue: '',
  });

  const handleLogin = () => {
    setToken('mock-token-123');
  };

  const handleLoginWithCustomExpire = () => {
    // 也可以在调用时指定过期时间（优先级更高）
    setToken('mock-token-456', 5 * 60 * 1000); // 5 分钟过期
  };

  return (
    <div>
      <p>当前 Token: {token || '(未登录或已过期)'}</p>
      <button onClick={handleLogin}>30 分钟过期登录</button>
      <button onClick={handleLoginWithCustomExpire}>5 分钟过期登录</button>
      <button onClick={removeToken}>清除 Token</button>
    </div>
  );
}
```

### 3. 使用 sessionStorage（会话级存储）

```tsx
import { useStorage } from '@resin-hooks/core';

function SessionStorageExample() {
  const [value, setValue, clearValue] = useStorage<string>({
    key: 'session_note',
    type: 'session',
    defaultValue: '',
  });

  return (
    <div>
      <input
        placeholder="只在当前标签页会话内生效"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={clearValue}>清空</button>
    </div>
  );
}
```

## 跨标签页同步

`useStorage` 内部监听了浏览器的 `storage` 事件：

- 当相同 `key` 的值在**其他标签页**被修改或删除时，当前页面的状态会自动更新
- 若存储的数据已过期，会自动移除并恢复为 `defaultValue`

这非常适合以下场景：

- 多标签页间同步登录状态 / Token
- 一处修改配置，多处页面实时同步

## 使用场景

- **登录/鉴权信息**：Token、用户信息本地持久化存储
- **表单草稿**：表单内容自动保存到本地，下次进入可恢复
- **个性化设置**：主题、布局偏好、语言等用户配置
- **会话级数据**：只在当前浏览器标签页有效的数据（使用 `sessionStorage`）

## 注意事项

- **仅浏览器环境可用**：依赖 `window.localStorage` / `window.sessionStorage`，SSR 环境请在客户端渲染阶段使用
- **key 建议全局唯一**：避免不同模块不小心复用同一个 key
- **存储内容需可序列化**：内部使用 `JSON.stringify` / `JSON.parse`，请确保传入的值可被序列化
- **过期时间单位为毫秒**：`expire` 和 `setValue` 第二个参数都以毫秒为单位
- 若需要更复杂的缓存策略（如多 key 管理、命名空间、批量清理），建议在业务侧封装一层再基于 `useStorage` 使用
