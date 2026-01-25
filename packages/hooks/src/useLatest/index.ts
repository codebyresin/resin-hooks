import { useRef, useEffect } from 'react';

/**
 * useLatest Hook
 *
 * 用于保存最新的值引用，解决闭包中访问到旧值的问题。
 *
 * @template T - 值的类型
 * @param {T} value - 需要保存的最新值
 * @returns {React.MutableRefObject<T>} 返回一个 ref 对象，其 current 属性始终指向最新的值
 * @remarks
 * - 每次组件重新渲染时，ref.current 会被更新为最新的值
 * - 返回的 ref 对象引用保持不变，不会触发额外的重新渲染
 * - 常用于解决 useEffect、useCallback 等 hook 中闭包捕获旧值的问题
 */

export function useLatest<T>(value: T) {
  const ref = useRef(value);
  // 每次渲染时更新 ref.current 为最新的值
  // 这样即使 ref 对象引用不变，也能访问到最新的值
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
