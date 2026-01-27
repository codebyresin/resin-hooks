# useVirtualList

虚拟列表 Hook，用于高效渲染大量数据列表。只渲染可见区域的项目，大幅提升性能。

## 基本信息

- **引入**：`import { useVirtualList } from '@resin-hooks/core';`
- **类型**：`useVirtualList<T>(list: T[], options?: UseVirtualListOptions): UseVirtualListReturn<T>`

## 参数

| 参数    | 类型                    | 默认值 | 说明             |
| ------- | ----------------------- | ------ | ---------------- |
| list    | `T[]`                   | -      | 要渲染的数据列表 |
| options | `UseVirtualListOptions` | `{}`   | 配置选项         |

### UseVirtualListOptions

| 参数            | 类型                                    | 默认值 | 说明                                 |
| --------------- | --------------------------------------- | ------ | ------------------------------------ |
| containerHeight | `number`                                | `400`  | 容器高度（像素）                     |
| itemHeight      | `number \| ((index: number) => number)` | `50`   | 每个项目的高度（像素），支持动态高度 |
| overscan        | `number`                                | `5`    | 预渲染的项目数量（用于平滑滚动体验） |

## 返回值

返回一个对象，包含：

1. **list** (`VirtualListItem<T>[]`): 可见区域的项目列表
   - `data`: 项目数据
   - `index`: 项目在原始列表中的索引
   - `offset`: 项目在容器中的偏移位置（像素）

2. **containerProps** (`object`): 容器样式对象，需要应用到滚动容器上
   - `style`: CSS 样式对象
   - `onScroll`: 滚动事件处理函数
   - `ref`: 容器引用回调函数

3. **totalHeight** (`number`): 总高度（像素），用于设置占位元素的高度

4. **scrollTo** (`(index: number) => void`): 滚动到指定索引

5. **scrollToOffset** (`(offset: number) => void`): 滚动到指定偏移位置

## 使用示例

### 基本用法（固定高度）

```tsx
import { useState } from 'react';
import { useVirtualList } from '@resin-hooks/core';

function VirtualListExample() {
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
```

### 动态高度

```tsx
import { useVirtualList } from '@resin-hooks/core';

function DynamicHeightList() {
  const list = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    height: i % 2 === 0 ? 50 : 80, // 动态高度
  }));

  const {
    list: visibleList,
    containerProps,
    totalHeight,
  } = useVirtualList(list, {
    containerHeight: 400,
    itemHeight: (index) => list[index].height, // 使用函数返回动态高度
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
              height: item.data.height,
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
```

### 滚动控制

```tsx
import { useVirtualList } from '@resin-hooks/core';

function ScrollableList() {
  const list = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

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
      <div>
        <button onClick={() => scrollTo(0)}>滚动到顶部</button>
        <button onClick={() => scrollTo(Math.floor(list.length / 2))}>
          滚动到中间
        </button>
        <button onClick={() => scrollTo(list.length - 1)}>滚动到底部</button>
      </div>
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
    </div>
  );
}
```

## 工作原理

1. **计算可见区域**：根据滚动位置和容器高度，计算需要渲染的项目范围
2. **预渲染**：在可见区域前后额外渲染一定数量的项目（overscan），提供平滑的滚动体验
3. **绝对定位**：使用绝对定位将项目放置在正确的位置
4. **占位元素**：使用占位元素（totalHeight）保持正确的滚动条高度

## 性能优势

- **只渲染可见项目**：对于 10000 条数据，只渲染约 10-20 条，大幅减少 DOM 节点
- **内存占用低**：不需要将所有数据都渲染到 DOM 中
- **滚动流畅**：通过预渲染和优化计算，确保滚动体验流畅

## 使用场景

- **长列表渲染**：需要渲染大量数据的列表（如聊天记录、商品列表）
- **性能优化**：当列表项数量超过 100 时，使用虚拟列表可以显著提升性能
- **无限滚动**：结合数据加载，实现无限滚动列表
- **表格渲染**：大数据量表格的虚拟滚动

## 注意事项

1. **固定高度 vs 动态高度**：
   - 固定高度性能更好，计算更快
   - 动态高度需要预先计算所有项目的位置，初始化稍慢

2. **项目高度**：
   - 固定高度时，确保所有项目高度一致
   - 动态高度时，确保高度计算函数准确

3. **容器样式**：
   - 必须将 `containerProps` 应用到滚动容器
   - 占位元素必须设置 `height: totalHeight` 和 `position: relative`

4. **项目定位**：
   - 每个项目必须使用 `position: absolute` 和 `top: item.offset`
