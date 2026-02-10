import { useState } from 'react';
import { useStorage } from '@resin-hooks/core';
import './demo.css';

type StorageType = 'local' | 'session';

export default function UseStorageDemo() {
  const [storageType, setStorageType] = useState<StorageType>('local');
  const [expireMs, setExpireMs] = useState<number | ''>('');

  const [value, setValue, removeValue] = useStorage<string>({
    key: 'resin-hooks-storage-demo',
    type: storageType,
    defaultValue: '',
    expire: typeof expireMs === 'number' && expireMs > 0 ? expireMs : null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleExpireInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) {
      setExpireMs('');
      return;
    }
    const num = Number(v);
    if (Number.isNaN(num) || num < 0) return;
    setExpireMs(num);
  };

  const applyCustomExpire = () => {
    if (typeof expireMs === 'number' && expireMs > 0) {
      setValue(value ?? '', expireMs);
    }
  };

  return (
    <div>
      <h2>useStorage Demo</h2>
      <p className="demo-description">
        useStorage 封装了 localStorage /
        sessionStorage，提供可选过期时间和跨标签页同步能力。
        可以切换存储类型、设置过期时间，并实时观察当前存储值。
      </p>

      <div className="demo-section">
        <div className="demo-controls">
          <div className="throttle-control-row">
            <label>
              存储类型：
              <select
                value={storageType}
                onChange={(e) => setStorageType(e.target.value as StorageType)}
                className="throttle-input"
              >
                <option value="local">localStorage（持久化）</option>
                <option value="session">sessionStorage（会话级）</option>
              </select>
            </label>

            <label>
              过期时间 (ms，留空为不过期)：
              <input
                type="number"
                min={0}
                step={1000}
                value={expireMs}
                onChange={handleExpireInputChange}
                className="throttle-input"
              />
            </label>
          </div>
        </div>

        <div className="demo-value">
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>当前值：</strong>
            <span className={`value-badge ${value ? 'true' : 'false'}`}>
              {value ?? '(空)'}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            当前存储键：<code>resin-hooks-storage-demo</code>
            （支持多标签页同步）
          </div>
        </div>

        <input
          type="text"
          value={value ?? ''}
          onChange={handleChange}
          placeholder="输入内容，将同步写入存储..."
          className="throttle-input throttle-input-full"
        />

        <div className="demo-buttons" style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setValue('示例值')}
            className="btn btn-primary"
          >
            设置示例值
          </button>
          <button onClick={removeValue} className="btn btn-secondary">
            清除存储
          </button>
          <button
            onClick={applyCustomExpire}
            disabled={!(typeof expireMs === 'number' && expireMs > 0)}
            className="btn btn-accent"
          >
            以当前过期时间重新写入
          </button>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例:</h3>
        <pre>
          <code>{`const [value, setValue, removeValue] = useStorage<string>({
  key: 'resin-hooks-storage-demo',
  type: 'local',
  defaultValue: '',
  // 例如：30 分钟过期
  expire: 30 * 60 * 1000,
});

return (
  <>
    <input value={value ?? ''} onChange={(e) => setValue(e.target.value)} />
    <button onClick={removeValue}>清除</button>
  </>
);`}</code>
        </pre>
      </div>
    </div>
  );
}
