# Resin-Hooks 项目面试通关指南

本文档旨在梳理 `resin-hooks` 项目的核心架构、核心 Hook 的实现原理及其在面试中的常见问答，帮助开发者深入理解项目并能够自如应对前端面试。

## 一、 项目概况

**项目名称**：resin-hooks
**项目定位**：企业级 React Hooks 工具库，专注于解决高性能列表、复杂交互、工程化数据导出等核心场景。
**技术栈**：

- **核心框架**：React 18 + TypeScript
- **构建工具**：Rollup (核心库构建)、Vite (Playground 演示)
- **文档系统**：Rspress (字节跳动出品的现代静态站点生成器)
- **包管理**：pnpm Workspace (Monorepo 架构)
- **质量保证**：Jest + React Testing Library (单元测试)

---

## 二、 核心 Hook 深度解析

### 1. useVirtualList (高性能虚拟列表)

#### **实现思路**

虚拟列表的核心在于“只渲染肉眼可见的区域”。

- **计算范围**：通过监听容器的 `onScroll` 事件获取 `scrollTop`，结合 `containerHeight` 和 `itemHeight` 计算出当前应该显示的 `startIndex` 和 `endIndex`。
- **性能优化**：
  - **固定高度**：直接 O(1) 计算索引。
  - **动态高度**：预先计算所有项的 `offsets`，使用 **二分查找** 在 O(logN) 时间内定位 `startIndex`。
  - **预渲染 (Overscan)**：在可见区域前后额外渲染几项，防止快速滚动时出现白屏。
- **布局方案**：采用 `absolute` 定位配合 `totalHeight` 占位，确保滚动条表现正常。

#### **面试题：虚拟列表如何处理动态高度？**

**回答**：

1. **预计算偏移量**：在数据初始化或变化时，遍历列表计算每一项的累计偏移高度并存入数组。
2. **快速定位**：由于偏移量数组是递增的，可以使用二分查找根据当前 `scrollTop` 快速找到 `startIndex`。
3. **渲染优化**：若高度随内容变化，可结合 `ResizeObserver` 动态更新高度缓存并重新计算偏移量。

---

### 2. useExcelExport (复杂 Excel 导出)

#### **实现思路**

封装了 `xlsx` 库，支持多级表头和大数据量导出。

- **树形表头解析**：通过递归算法计算表头深度（rowspan）和叶子节点数（colspan），生成 `xlsx` 所需的 `merges` 配置。
- **分片处理 (Chunking)**：针对大数据量，将数据切分为小块异步处理，并提供 `progress` 进度反馈，避免阻塞主线程。
- **可取消性**：使用 `ref` 记录取消状态，在分片处理间隙检测并中断。

#### **面试题：如何实现一个支持多级表头的 Excel 导出 Hook？**

**回答**：
核心难点在于将树形的表头配置转换为 Excel 的二维单元格及合并规则。

1. **深度优先遍历**：计算最大深度确定行数，计算叶子节点数确定列数。
2. **生成合并规则**：在遍历过程中，若节点有子节点则进行跨列合并；若节点是叶子节点且深度不足最大深度，则进行跨行合并。
3. **分片导出**：为了提升用户体验，可以支持传入异步 Promise 获取数据，并实现分片处理以展示导出进度。

---

### 3. useThrottle / useDebounce (函数节流与防抖)

#### **实现思路**

- **useLatest 闭包优化**：使用 `useRef` 始终保存最新的 `fn`，确保节流/防抖函数内部执行的是最新逻辑，且不需要将 `fn` 加入 `useCallback` 依赖，避免频繁生成新函数。
- **配置丰富**：支持 `leading` (首领触发) 和 `trailing` (末尾触发) 配置。
- **清理机制**：在组件卸载时自动清除定时器，防止内存泄漏或在已卸载组件上更新状态。

#### **面试题：React Hooks 实现防抖节流时为什么要用 useRef？**

**回答**：
主要为了解决 **闭包陷阱** 和 **性能问题**。

1. 如果直接在 `useEffect` 或 `useCallback` 里使用外部传入的 `fn`，必须将其加入依赖数组，这会导致每次 `fn` 变化时防抖函数都被重置，无法正常工作。
2. 使用 `useRef` 保存 `fn`，可以在不改变防抖函数引用的情况下，始终访问到最新的 `fn` 逻辑，从而实现“引用不变，逻辑更新”。

---

### 4. useLatest (解决闭包陷阱)

#### **实现思路**

极其简洁但重要的 Hook。

```typescript
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
```

通过 `useEffect` 在每次渲染后同步最新的值到 `ref.current`。

#### **面试题：什么是 React 闭包陷阱？如何解决？**

**回答**：
闭包陷阱常发生在 `useEffect`、`useCallback` 或 `setTimeout` 中，当这些异步逻辑捕获了某次渲染时的状态，而之后状态已更新，异步逻辑内部仍访问的是旧值。
**解决方案**：使用 `useRef`。因为 `ref` 对象在组件全生命周期内指向同一个引用，其 `current` 属性的修改不会受闭包影响。`useLatest` 便是这一方案的标准封装。

---

### 5. useCategoryScroll (联动滚动)

#### **实现思路**

模仿外卖 APP 的分类联动。

- **高度计算**：使用 `useLayoutEffect` 在 DOM 挂载后立即计算各区域的 `offsetTop`。
- **双向联动**：
  - **右侧滚向左侧动**：监听滚动事件，根据 `scrollTop` 在高度区间数组中匹配 `activeIndex`。
  - **左侧点向右侧跳**：调用 `containerRef.current.scrollTo` 滚动到指定高度。
- **性能优化**：对滚动监听进行 `requestAnimationFrame` 节流处理。

---

### 6. useStorage (增强型本地存储)

#### **实现思路**

封装了 `localStorage` 和 `sessionStorage`，并增加了 **过期时间** 和 **自动状态同步**。

- **序列化处理**：自动处理 `JSON.parse` 和 `JSON.stringify`，并对解析错误进行容错处理。
- **过期逻辑**：在存储数据时包裹一层对象（含 `value` 和 `expireTime`），读取时判断当前时间是否超过过期时间，若过期则自动删除。

---

### 7. useBoolean (基础状态封装)

#### **实现思路**

将常用的布尔值切换逻辑封装为 `setTrue`、`setFalse`、`toggle` 等。

- **性能优化**：使用 `useMemo` 缓存所有 `actions`，确保子组件依赖这些方法时不会因为父组件重渲染而导致不必要的重渲染。

---

## 三、 工程化亮点

1. **Monorepo 架构**：使用 `pnpm workspace` 管理 `api`、`hooks` 和 `play` 三个子包，实现代码高度解耦与复用。
2. **Rollup 精准构建**：针对 `hooks` 包，配置了 `esm` 和 `cjs` 双格式输出，并自动处理 `tslib` 和外部依赖，确保产物轻量。
3. **CI/CD 自动化发布**：
   - **文档发布**：利用 GitHub Actions 实现 Rspress 文档的自动构建与部署（GitHub Pages）。
   - **NPM 发布**：通过 GitHub Release 钩子触发 CI 流程，自动执行 `pnpm build` 并发布到 NPM，确保了发布版本的规范性与可追溯性。
4. **文档驱动开发**：使用 `Rspress` 搭建文档，支持 MDX 和组件预览，做到“代码即文档”。
5. **单元测试覆盖**：使用 `jest` + `@testing-library/react-hooks` 对每个 Hook 进行核心逻辑测试，确保重构时的健壮性。

---

## 四、 NPM 包发布流程（面试加分项）

在面试中，如果被问到“如何管理和发布一个开源 Hook 库”，可以按照以下流程回答：

### 1. 发布前的准备

- **版本规范**：遵循 [SemVer (语义化版本)](https://semver.org/lang/zh-CN/)，通过 `npm version <patch|minor|major>` 更新。
- **构建校验**：在 `prepublishOnly` 钩子中运行 `pnpm build` 和 `pnpm test`，确保发出去的包是经过编译且测试通过的。
- **文件白名单**：在 `package.json` 的 `files` 字段中明确指定只发布 `dist` 和 `README.md`，减小包体积。

### 2. CI/CD 自动化流水线

- **GitHub Actions**：配置 `.github/workflows/publish.yml`。
- **触发机制**：当在 GitHub 上创建一个新的 Release 时，自动触发流水线。
- **鉴权处理**：在 NPM 官网上创建 Automation Token，并配置在 GitHub 仓库的 Secrets 中，确保 CI 环境有权发布。

### 3. 发布后的维护

- **变更日志**：自动或手动维护 `CHANGELOG.md`，记录每个版本的核心变更。
- **README 维护**：确保 README 包含安装方式、快速开始、API 文档和示例。

---

## 五、 面试总结建议

在介绍这个项目时，建议按照 **“背景 -> 难点 -> 方案 -> 结果”** 的逻辑：

- **背景**：为了统一团队内部常用的复杂交互逻辑，提升开发效率。
- **难点**：如虚拟列表的动态高度计算性能、Excel 导出时的表头算法转换、Hook 内部的闭包陷阱处理。
- **方案**：采用 `useRef` 规避闭包陷阱，二分查找优化性能，递归算法处理树形结构等。
- **结果**：沉淀了一套高性能、易扩展的 Hook 库，通过单元测试保证了质量，并在多个业务场景中得到复用。
