import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type RefObject,
} from 'react';
import { useCategoryScroll } from '@resin-hooks/core';
import './demo.css';

// 每个分类下展示的商品（按分类切分）
const getProductsByCategory = (categoryIndex: number) =>
  Array.from({ length: 4 }, (_, i) => {
    const id = categoryIndex * 10 + i + 1;
    return {
      id,
      name: `商品 ${id}`,
      price: ((id % 5) + 1) * 99,
      desc: '热卖推荐',
    };
  });

export type CategoryItem = {
  name: string;
  products: ReturnType<typeof getProductsByCategory>;
};

const CATEGORIES = [
  '手机数码',
  '电脑办公',
  '家用电器',
  '服饰鞋包',
  '美妆护肤',
  '家居家装',
  '食品生鲜',
  '运动户外',
  '母婴童装',
  '图书文娱',
];

const fetchCategoryData = (): Promise<CategoryItem[]> =>
  Promise.resolve(
    CATEGORIES.map((name, i) => ({
      name,
      products: getProductsByCategory(i),
    })),
  );

export default function UseSyncScrollDemo() {
  const categoryListRef = useRef<HTMLDivElement>(null);
  const categoryItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const syncingFromLeftRef = useRef(false);

  const {
    data,
    activeIndex,
    containerRef,
    sectionRefs,
    onScroll,
    scrollToIndex,
  } = useCategoryScroll(fetchCategoryData);

  // 右侧滚动导致 activeIndex 变化时，让左侧列表滚到当前高亮项可见（若本次不是由左侧滚动触发的）
  useLayoutEffect(() => {
    if (syncingFromLeftRef.current) {
      syncingFromLeftRef.current = false;
      return;
    }
    const container = categoryListRef.current;
    const item = categoryItemRefs.current[activeIndex];
    if (!container || !item) return;
    const itemTop = item.offsetTop;
    const itemH = item.offsetHeight;
    const viewH = container.clientHeight;
    const maxScroll = container.scrollHeight - viewH;
    let targetScroll = container.scrollTop;
    if (itemTop < container.scrollTop) {
      targetScroll = Math.max(0, itemTop - 8);
    } else if (itemTop + itemH > container.scrollTop + viewH) {
      targetScroll = Math.min(maxScroll, itemTop - viewH + itemH + 8);
    }
    if (targetScroll !== container.scrollTop) {
      container.scrollTop = targetScroll;
    }
  }, [activeIndex]);

  // 左侧滚动时，根据当前可见分类把右侧滚到对应区块
  const onLeftScroll = useCallback(() => {
    const left = categoryListRef.current;
    if (!left) return;
    const scrollTop = left.scrollTop;
    const threshold = 40;
    let index = 0;
    for (let i = 0; i < categoryItemRefs.current.length; i++) {
      const el = categoryItemRefs.current[i];
      if (el && el.offsetTop <= scrollTop + threshold) index = i;
    }
    syncingFromLeftRef.current = true;
    scrollToIndex(index);
  }, [scrollToIndex]);

  // 数据加载后确保左侧分类 ref 数组长度与 data 一致（sectionRefs 由 useCategoryScroll 内部维护）
  useEffect(() => {
    categoryItemRefs.current = categoryItemRefs.current.slice(0, data.length);
  }, [data.length]);

  return (
    <div>
      <h2>useCategoryScroll Demo</h2>
      <p className="demo-description">
        使用 useCategoryScroll
        拉取分类数据，右侧滚动时自动高亮对应分类并让左侧滚到当前项可见，点击左侧分类可滚动到对应区块。
      </p>

      <div className="demo-section">
        <div className="sync-scroll-row sync-scroll-shop">
          <div className="sync-scroll-categories">
            <div className="sync-scroll-label">商品分类</div>
            <div
              ref={categoryListRef}
              className="sync-scroll-box sync-scroll-category-list"
              style={{ height: 320, overflow: 'auto' }}
              onScroll={onLeftScroll}
            >
              <div className="sync-scroll-inner">
                {data.map((cat: CategoryItem, i: number) => (
                  <div
                    key={cat.name}
                    ref={(el) => {
                      categoryItemRefs.current[i] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    className={`category-item ${i === activeIndex ? 'category-item--active' : ''}`}
                    onClick={() => scrollToIndex(i)}
                    onKeyDown={(e) => e.key === 'Enter' && scrollToIndex(i)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sync-scroll-content">
            <div className="sync-scroll-label">商品内容</div>
            <div
              ref={containerRef as unknown as RefObject<HTMLDivElement>}
              className="sync-scroll-box sync-scroll-product-list"
              style={{ height: 320, overflow: 'auto' }}
              onScroll={onScroll}
            >
              <div className="sync-scroll-inner sync-scroll-products-inner sync-scroll-sections">
                {data.map((cat: CategoryItem, i: number) => (
                  <div
                    key={cat.name}
                    ref={(el) => {
                      sectionRefs.current[i] = el;
                    }}
                    className="content-section"
                  >
                    <h4 className="content-section__title">{cat.name}</h4>
                    <div className="product-grid">
                      {cat.products.map(
                        (p: {
                          id: number;
                          name: string;
                          price: number;
                          desc: string;
                        }) => (
                          <div key={p.id} className="product-card">
                            <div className="product-card__thumb" />
                            <div className="product-card__name">{p.name}</div>
                            <div className="product-card__price">
                              ¥{p.price}
                            </div>
                            <span className="product-card__tag">{p.desc}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-code">
        <h3>使用示例</h3>
        <pre>
          <code>{`const fetchCategoryData = () => Promise.resolve([
  { name: '手机数码', products: [...] },
  { name: '电脑办公', products: [...] },
  // ...
]);

const {
  data,
  activeIndex,
  containerRef,
  sectionRefs,
  onScroll,
  scrollToIndex,
} = useCategoryScroll(fetchCategoryData);

// 右侧容器: ref={containerRef} onScroll={onScroll}
// 各区块: ref={el => (sectionRefs.current[i] = el)}
// 左侧点击: scrollToIndex(i)`}</code>
        </pre>
      </div>
    </div>
  );
}
