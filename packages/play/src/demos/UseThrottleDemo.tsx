import { useState } from 'react';
import { useThrottle } from '@resin-hooks/core';
import './demo.css';

export default function UseThrottleDemo() {
  const [value, setValue] = useState('');
  const [throttledValue, setThrottledValue] = useState('');

  // Default options
  const [wait, setWait] = useState(1000);
  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(true);

  const throttledSetter = useThrottle(
    (val: string) => {
      setThrottledValue(val);
    },
    { wait, leading, trailing },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    throttledSetter(val);
  };

  return (
    <div>
      <h2>useThrottle Demo</h2>
      <p className="demo-description">
        useThrottle
        用于限制函数执行的频率。在下面的输入框中输入内容，观察节流后的更新效果。
      </p>

      <div className="demo-section">
        <div className="demo-controls" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Wait (ms): </label>
            <input
              type="number"
              value={wait}
              onChange={(e) => setWait(Number(e.target.value))}
              style={{ padding: '4px', width: '80px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label>
              <input
                type="checkbox"
                checked={leading}
                onChange={(e) => setLeading(e.target.checked)}
              />{' '}
              Leading
            </label>
            <label>
              <input
                type="checkbox"
                checked={trailing}
                onChange={(e) => setTrailing(e.target.checked)}
              />{' '}
              Trailing
            </label>
          </div>
        </div>

        <div className="demo-input-area" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Type quickly..."
            className="demo-input"
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div className="demo-value">
          <div style={{ marginBottom: '10px' }}>
            <strong>Real-time Value:</strong>
            <div
              className="value-box"
              style={{
                padding: '10px',
                background: '#f5f5f5',
                marginTop: '5px',
              }}
            >
              {value || '(empty)'}
            </div>
          </div>
          <div>
            <strong>Throttled Value:</strong>
            <div
              className="value-box"
              style={{
                padding: '10px',
                background: '#e6f7ff',
                marginTop: '5px',
                border: '1px solid #91d5ff',
              }}
            >
              {throttledValue || '(empty)'}
            </div>
          </div>
        </div>

        <div className="demo-buttons" style={{ marginTop: '20px' }}>
          <button
            onClick={() => throttledSetter.cancel()}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => throttledSetter.flush()}
            className="btn btn-primary"
          >
            Flush
          </button>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例:</h3>
        <pre>
          <code>{`const [value, setValue] = useState('');
const throttledSetter = useThrottle(
  (val) => setValue(val),
  { wait: ${wait}, leading: ${leading}, trailing: ${trailing} }
);

<input 
  onChange={(e) => throttledSetter(e.target.value)} 
/>`}</code>
        </pre>
      </div>
    </div>
  );
}
