import { useState, useCallback } from 'react';
import { useThrottle } from '@resin-hooks/core';
import './demo.css';

export default function UseThrottleDemo() {
  const [value, setValue] = useState('');
  const [throttledValue, setThrottledValue] = useState('');
  const [execCount, setExecCount] = useState(0);

  const [interval, setInterval] = useState(500);
  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(true);

  const handleResult = useCallback(() => {
    setExecCount((c) => c + 1);
  }, []);

  const { throttleFn, cancel } = useThrottle(
    (val: string) => {
      setThrottledValue(val);
    },
    {
      interval,
      leading,
      trailing,
      resultCallback: handleResult,
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    throttleFn(val);
  };

  const handleReset = () => {
    setValue('');
    setThrottledValue('');
    setExecCount(0);
    cancel();
  };

  return (
    <div>
      <h2>useThrottle Demo</h2>
      <p className="demo-description">
        useThrottle
        用于限制函数执行频率。在输入框中快速输入，观察「实时值」与「节流后的值」的差异；可调节
        interval、leading、trailing 查看不同效果。
      </p>

      <div className="demo-section">
        <div className="demo-controls">
          <div className="throttle-control-row">
            <label>
              间隔 (ms):
              <input
                type="number"
                min={100}
                max={3000}
                step={100}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value) || 500)}
                className="throttle-input"
              />
            </label>
            <label className="throttle-checkbox">
              <input
                type="checkbox"
                checked={leading}
                onChange={(e) => setLeading(e.target.checked)}
              />
              leading（首次立即执行）
            </label>
            <label className="throttle-checkbox">
              <input
                type="checkbox"
                checked={trailing}
                onChange={(e) => setTrailing(e.target.checked)}
              />
              trailing（间隔末补执行）
            </label>
          </div>
        </div>

        <div className="demo-value" style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>实时值：</strong>
            <span
              className="value-badge"
              style={{ background: '#e5e7eb', color: '#374151' }}
            >
              {value || '(空)'}
            </span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>节流后的值：</strong>
            <span className="value-badge true">{throttledValue || '(空)'}</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            fn 执行次数：<strong>{execCount}</strong>
          </div>
        </div>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="快速输入以观察节流效果..."
          className="throttle-input throttle-input-full"
        />

        <div className="demo-buttons" style={{ marginTop: '1rem' }}>
          <button onClick={cancel} className="btn btn-secondary">
            取消未执行的 trailing
          </button>
          <button onClick={handleReset} className="btn btn-accent">
            重置
          </button>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例</h3>
        <pre>
          <code>{`const { throttleFn, cancel } = useThrottle(
  (val) => setThrottledValue(val),
  {
    interval: ${interval},
    leading: ${leading},
    trailing: ${trailing},
    resultCallback: (res) => console.log('执行结果', res),
  }
);

<input onChange={(e) => throttleFn(e.target.value)} />
<button onClick={cancel}>取消</button>`}</code>
        </pre>
      </div>
    </div>
  );
}
