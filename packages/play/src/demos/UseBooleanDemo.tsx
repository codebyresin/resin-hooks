import { useBoolean } from '@resin-hooks/core';
import './demo.css';

export default function UseBooleanDemo() {
  const [value, { setTrue, setFalse, toggle, set }] = useBoolean(false);

  return (
    <div>
      <h2>useBoolean Demo</h2>
      <p className="demo-description">
        useBoolean 提供了一个便捷的方式来管理布尔值状态，包含常用的操作方法。
      </p>

      <div className="demo-section">
        <div className="demo-value">
          <strong>当前值:</strong>
          <span className={`value-badge ${value ? 'true' : 'false'}`}>
            {value ? 'true' : 'false'}
          </span>
        </div>

        <div className="demo-buttons">
          <button onClick={setTrue} className="btn btn-primary">
            设置为 true
          </button>
          <button onClick={setFalse} className="btn btn-secondary">
            设置为 false
          </button>
          <button onClick={toggle} className="btn btn-accent">
            切换 (toggle)
          </button>
          <button onClick={() => set(!value)} className="btn btn-info">
            设置为 {!value ? 'true' : 'false'}
          </button>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例:</h3>
        <pre>
          <code>{`const [value, { setTrue, setFalse, toggle, set }] = useBoolean(false);

// 使用
<button onClick={setTrue}>设置为 true</button>
<button onClick={setFalse}>设置为 false</button>
<button onClick={toggle}>切换</button>
<button onClick={() => set(true)}>设置为 true</button>`}</code>
        </pre>
      </div>
    </div>
  );
}
