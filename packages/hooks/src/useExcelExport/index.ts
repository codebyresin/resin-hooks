import { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';

/** 列配置：key 为数据字段名，label 为 Excel 表头显示 */
export type ExcelColumnConfig = { key: string; label: string };

/**
 * 字段 → 表头映射表
 * 用于将后端返回的英文字段名映射为导出时显示的表头文案（如中文）
 */
export type HeadersMap = Record<string, string>;

export interface UseExcelExportOptions {
  /** 导出文件名，默认 'export.xlsx' */
  filename?: string;
  /** 工作表名，默认 'Sheet1' */
  sheetName?: string;
  /** 每批处理行数，用于算进度，默认 5000 */
  chunkSize?: number;
  /**
   * 【数据类型映射表】字段 key → Excel 表头文案
   * 后端返回英文字段时，通过此映射转为中文/定制表头
   * 例：{ txnId: '交易流水号', amount: '交易金额' }
   * 未映射的字段保持原字段名
   */
  headersMap?: HeadersMap;
  /**
   * 【部分导出】指定要导出的列（字段 key 数组）
   * 场景：后端返回很多字段，前端列表只展示部分，导出时也只需部分
   * 不传或空数组 = 导出全部字段
   */
  columns?: string[];
  /**
   * 【高级】表头动态处理：根据数据字段返回列配置，可过滤、排序、重命名
   * 优先级最高，覆盖 headersMap + columns
   * 例：(keys) => keys.filter(k => columns.includes(k)).map(k => ({ key: k, label: map[k] ?? k }))
   */
  headersTransform?: (dataKeys: string[]) => ExcelColumnConfig[];
}

export interface UseExcelExportReturn {
  /** 执行导出，传入数据数组或返回数据的 async 函数 */
  exportExcel: (
    data:
      | Record<string, unknown>[]
      | (() => Promise<Record<string, unknown>[]>),
  ) => Promise<void>;
  /** 进度 0-100 */
  progress: number;
  /** 是否正在导出 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 取消当前导出 */
  cancel: () => void;
}

/**
 * useExcelExport - 前端 Excel 导出 Hook
 *
 * ## 设计思路
 *
 * 1. 【数据类型映射】headersMap：后端用英文字段（id, amount），导出需中文表头，
 *    传入 headersMap 做字段 → 表头映射。
 *
 * 2. 【部分导出】columns：后端返回 20 个字段，列表只展示 8 个，导出也只想要这 8 个。
 *    传入 columns = [a,b,c...] 限定导出列；不传则导出全部。
 *
 * 3. 【通用数据流】Hook 始终拿到完整数据（fetch 全部），通过 columns/headersTransform
 *    做“列筛选 + 表头映射”，无需改动接口，前端配置即可。
 *
 * 4. 【优先级】headersTransform > columns + headersMap > 全量 + headersMap
 */
export function useExcelExport(
  options: UseExcelExportOptions = {},
): UseExcelExportReturn {
  const {
    filename = 'export.xlsx',
    sheetName = 'Sheet1',
    chunkSize = 5000,
    headersMap,
    columns,
    headersTransform,
  } = options;

  /** 导出进度 0-100 */
  const [progress, setProgress] = useState(0);
  /** 是否正在导出 */
  const [loading, setLoading] = useState(false);
  /** 错误信息 */
  const [error, setError] = useState<Error | null>(null);

  /** 取消标志，每批开始前检查 */
  const abortedRef = useRef(false);

  const cancel = useCallback(() => {
    abortedRef.current = true;
  }, []);

  /** 让出主线程，便于 UI 更新进度 */
  function yieldToUI() {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  const exportExcel = useCallback(
    async (
      data:
        | Record<string, unknown>[]
        | (() => Promise<Record<string, unknown>[]>),
    ) => {
      abortedRef.current = false;
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        /** 数据源：同步数组或 async 函数 */
        const rows: Record<string, unknown>[] =
          typeof data === 'function' ? await data() : data;

        if (!Array.isArray(rows) || rows.length === 0) {
          setError(new Error('无数据可导出'));
          return;
        }

        const total = rows.length;
        /** 数据中的全部字段名（后端返回的 key） */
        const rawKeys = Object.keys(rows[0] ?? {});

        /**
         * 列配置：确定导出哪些列、表头怎么显示
         * 优先级：headersTransform > columns + headersMap > 全量 + headersMap
         */
        let resolvedColumns: ExcelColumnConfig[];
        if (headersTransform) {
          resolvedColumns = headersTransform(rawKeys);
        } else {
          /** 未用 headersTransform 时：用 columns 过滤（若有），再 headersMap 映射 */
          const keysToExport =
            columns && columns.length > 0
              ? rawKeys.filter((k) => columns.includes(k))
              : rawKeys;
          resolvedColumns = keysToExport.map((k) => ({
            key: k,
            label: headersMap?.[k] ?? k,
          }));
        }

        const dataKeys = resolvedColumns.map((c) => c.key);
        const displayHeaders = resolvedColumns.map((c) => c.label);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([displayHeaders]);

        for (let i = 0; i < total; i += chunkSize) {
          if (abortedRef.current) {
            setProgress(0);
            return;
          }

          const chunk = rows.slice(i, i + chunkSize);
          const aoa = chunk.map((obj) => dataKeys.map((k) => obj[k] ?? ''));
          XLSX.utils.sheet_add_aoa(ws, aoa, { origin: -1 });

          const processed = Math.min(i + chunkSize, total);
          setProgress((processed / total) * 100);
          await yieldToUI();
        }

        if (abortedRef.current) {
          setProgress(0);
          return;
        }

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, filename);
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [filename, sheetName, chunkSize, headersMap, columns, headersTransform],
  );

  return { exportExcel, progress, loading, error, cancel };
}
