import { useState, useEffect } from 'react';
import './App.css';
import UseBooleanDemo from './demos/UseBooleanDemo';
import UseLatestDemo from './demos/UseLatestDemo';
import UseVirtualListDemo from './demos/UseVirtualListDemo';

type DemoType = 'useBoolean' | 'useLatest' | 'useVirtualList';

const demos: { key: DemoType; name: string; component: React.ComponentType }[] =
  [
    { key: 'useBoolean', name: 'useBoolean', component: UseBooleanDemo },
    { key: 'useLatest', name: 'useLatest', component: UseLatestDemo },
    {
      key: 'useVirtualList',
      name: 'useVirtualList',
      component: UseVirtualListDemo,
    },
  ];

function App() {
  // 从 URL 参数获取要显示的 demo
  const getInitialDemo = (): DemoType => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demo = params.get('demo') as DemoType;
      if (demo && demos.some((d) => d.key === demo)) {
        return demo;
      }
    }
    return 'useBoolean';
  };

  const [currentDemo, setCurrentDemo] = useState<DemoType>(getInitialDemo());
  const CurrentDemoComponent =
    demos.find((d) => d.key === currentDemo)?.component || UseBooleanDemo;

  // 监听 URL 参数变化
  useEffect(() => {
    const handlePopState = () => {
      const demo = getInitialDemo();
      setCurrentDemo(demo);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Resin Hooks Playground</h1>
        <p>交互式演示各种 React Hooks</p>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <nav className="demo-nav">
            {demos.map((demo) => (
              <button
                key={demo.key}
                className={`nav-item ${currentDemo === demo.key ? 'active' : ''}`}
                onClick={() => setCurrentDemo(demo.key)}
              >
                {demo.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="demo-container">
          <div className="demo-wrapper">
            <CurrentDemoComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
