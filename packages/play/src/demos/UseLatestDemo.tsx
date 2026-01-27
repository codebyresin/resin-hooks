import { useState, useEffect } from 'react';
import { useLatest } from '@resin-hooks/core';
import './demo.css';

export default function UseLatestDemo() {
  const [count, setCount] = useState(0);
  const latestCount = useLatest(count);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      // 即使 count 在外部更新，这里也能访问到最新的值
      setLog((prev) => [...prev, `定时器读取到最新值: ${latestCount.current}`]);
    }, 2000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依赖数组为空，但能访问到最新的 count（这是 useLatest 的用途）

  const addLog = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  return (
    <div>
      <h2>useLatest Demo</h2>
      <p className="demo-description">
        useLatest 用于保存最新的值引用，解决闭包中访问到旧值的问题。 即使
        useEffect 的依赖数组为空，也能访问到最新的值。
      </p>

      <div className="demo-section">
        <div className="demo-value">
          <strong>当前 count:</strong>
          <span className="value-badge true">{count}</span>
        </div>

        <div className="demo-buttons">
          <button
            onClick={() => {
              setCount(count + 1);
              addLog(`手动更新 count: ${count + 1}`);
            }}
            className="btn btn-primary"
          >
            增加 count
          </button>
          <button
            onClick={() => {
              setCount(0);
              addLog('重置 count: 0');
            }}
            className="btn btn-secondary"
          >
            重置
          </button>
        </div>

        <div className="demo-log">
          <h3>日志 (定时器每 2 秒读取 latestCount.current):</h3>
          <div className="log-container">
            {log.length === 0 ? (
              <p className="log-empty">暂无日志</p>
            ) : (
              log.map((item, index) => (
                <div key={index} className="log-item">
                  {item}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLog([])}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            清空日志
          </button>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例:</h3>
        <pre>
          <code>{`const [count, setCount] = useState(0);
const latestCount = useLatest(count);

useEffect(() => {
  const timer = setInterval(() => {
    // 即使依赖数组为空，也能访问到最新的 count
    console.log('Latest count:', latestCount.current);
  }, 1000);
  return () => clearInterval(timer);
}, []); // 依赖数组为空`}</code>
        </pre>
      </div>
    </div>
  );
}
