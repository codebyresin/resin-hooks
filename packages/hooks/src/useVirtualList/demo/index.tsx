import { useState } from 'react';
import { useVirtualList } from '../index';

export default function VirtualListExample() {
  const [list] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })),
  );

  const {
    list: visibleList,
    containerProps,
    totalHeight,
  } = useVirtualList(list, {
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
              width: '100%',
            }}
          >
            {item.data.name}
          </div>
        ))}
      </div>
    </div>
  );
}
