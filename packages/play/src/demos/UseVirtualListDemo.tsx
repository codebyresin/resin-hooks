import { useState } from 'react';
import { useVirtualList } from '@resin-hooks/core';
import './demo.css';

export default function UseVirtualListDemo() {
  const [list] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `这是第 ${i} 个列表项`,
    })),
  );

  const {
    list: visibleList,
    containerProps,
    totalHeight,
    scrollTo,
  } = useVirtualList(list, {
    containerHeight: 400,
    itemHeight: 50,
  });

  return (
    <div>
      <h2>useVirtualList Demo</h2>
      <p className="demo-description">
        虚拟列表
        Hook，用于高效渲染大量数据列表。只渲染可见区域的项目，大幅提升性能。
        这个列表包含 10000 个项目，但只渲染可见的部分。
      </p>

      <div className="demo-section">
        <div className="demo-controls">
          <button onClick={() => scrollTo(0)} className="btn btn-primary">
            滚动到顶部
          </button>
          <button
            onClick={() => scrollTo(Math.floor(list.length / 2))}
            className="btn btn-primary"
          >
            滚动到中间
          </button>
          <button
            onClick={() => scrollTo(list.length - 1)}
            className="btn btn-primary"
          >
            滚动到底部
          </button>
          <span className="demo-info">
            总项目数: {list.length} | 可见项目数: {visibleList.length}
          </span>
        </div>

        <div
          {...containerProps}
          style={{
            ...containerProps.style,
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleList.map((item) => (
              <div
                key={item.index}
                style={{
                  position: 'absolute',
                  top: item.offset,
                  height: 50,
                  width: '100%',
                  padding: '0 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: item.index % 2 === 0 ? '#fff' : '#fafafa',
                }}
              >
                <div>
                  <strong>{item.data.name}</strong>
                  <span
                    style={{
                      marginLeft: '1rem',
                      color: '#666',
                      fontSize: '0.9rem',
                    }}
                  >
                    {item.data.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例:</h3>
        <pre>
          <code>{`const { list: visibleList, containerProps, totalHeight } = useVirtualList(list, {
  containerHeight: 400,
  itemHeight: 50,
});

return (
  <div {...containerProps}>
    <div style={{ height: totalHeight, position: 'relative' }}>
      {visibleList.map((item) => (
        <div
          key={item.index}
          style={{
            position: 'absolute',
            top: item.offset,
            height: 50,
          }}
        >
          {item.data.name}
        </div>
      ))}
    </div>
  </div>
);`}</code>
        </pre>
      </div>
    </div>
  );
}
