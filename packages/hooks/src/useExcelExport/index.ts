import { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';

export type ExcelColumnConfig = {
  key: string; //字段
  label: string; //表头文字
};
// [{key:'name',label:'姓名'}]

//配置
export interface UseExcelExportOptions {
  fileName?: string; // 文件名
  sheetName?: string; // 工作表名
  headersMap?: Record<string, string>; // 字段映射
  colums?: string[]; // 指定导出的列
  headers?: ExcelHeader[]; //支持多级表头
}

//导出
export interface UseExcelExportReturn {
  exportExcel: (
    data:
      | Record<string, unknown>[]
      | (() => Promise<Record<string, unknown>[]>),
  ) => Promise<void>;
  loading: boolean;
  errorInfo: Error | null;
  progress: number;
}

//多级表头加上aoa_to_sheet+!merges
export type ExcelHeader = {
  label: string; // 表头显示文字
  key?: string; // 对应字段（只有叶子节点才有）
  children?: ExcelHeader[];
};

//?统计某个节点下的叶子节点总数（用于计算单元格跨列数）
export function countLeaf(node: ExcelHeader): number {
  if (!node.children || node.children.length === 0) return 1;
  // return node.children.reduce((acc, cur) => acc + countLeaf(cur), 0);
  let leafCount = 0;
  for (let i = 0; i < node.children.length; i++) {
    const childrenNode = node.children[i];
    leafCount += countLeaf(childrenNode);
  }
  return leafCount;
}

//?计算表头的最大深度（即 Excel 表头占多少行,行数）
export function getDepth(headers: ExcelHeader[]): number {
  let maxDepth = 0;
  for (let i = 0; i < headers.length; i++) {
    const currentHeader = headers[i];
    let currentDepth;
    if (currentHeader.children && currentHeader.children.length > 0) {
      currentDepth = 1 + getDepth(currentHeader.children);
    } else {
      currentDepth = 1;
    }
    maxDepth = Math.max(currentDepth, maxDepth);
  }
  return maxDepth;
}

//?生成 Excel 表头的每一行数据（空单元格补空字符串），并收集所有叶子节点的 key
export function buildHeaderRows(headers: ExcelHeader[]) {
  const rows: string[][] = []; //最终的表头行，row[0]是第一行
  const leafKeys: string[] = []; //收集所有叶子节点的key（对应表格的列）
  const depth = getDepth(headers); //拿到最大行

  function traverse(nodes: ExcelHeader[], level: number) {
    if (!rows[level]) rows[level] = [];

    nodes.forEach((node) => {
      //计算当前节点要跨的列数（叶子节点=1，非叶子节点=叶子数）
      const span = node.children ? countLeaf(node) : 1;
      rows[level].push(node.label);
      for (let i = 1; i < span; i++) rows[level].push('');
      if (node.children) {
        traverse(node.children, level + 1);
      } else {
        leafKeys.push(node.key!);
      }
    });
  }
  traverse(headers, 0);
  for (let i = 0; i < depth; i++) {
    if (!rows[i]) rows[i] = [];
  }
  return { headerRows: rows, leafKeys };
}

//?生成 Excel 单元格的合并规则（哪些单元格需要跨列合并）
export function buildMerges(headers: ExcelHeader[]) {
  const merges: XLSX.Range[] = []; // 合并规则数组，XLSX.Range是Excel单元格范围类型
  let colIndex = 0; // 列索引（从0开始，记录当前处理到哪一列）
  function traverse(nodes: ExcelHeader[], row: number) {
    nodes.forEach((node) => {
      const startCol = colIndex; //记录当前节点的起始列
      if (node.children && node.children.length > 0) {
        //非叶子节点，计算跨列数，生成合并规则
        const span = countLeaf(node);
        merges.push({
          s: { r: row, c: startCol }, // 合并起始位置（行row，列startCol）
          e: { r: row, c: startCol + span - 1 }, // 合并结束位置（行row，列startCol+span-1）
        });
        traverse(node.children, row + 1);
        colIndex += span;
      } else {
        colIndex += 1;
      }
    });
  }
  traverse(headers, 0);
  return merges;
}

//*core
export function useExcelExport(
  options: UseExcelExportOptions,
): UseExcelExportReturn {
  /** 导出进度 0-100 */
  const [progress, setProgress] = useState(0);
  /** 是否正在导出 */
  const [loading, setLoading] = useState(false);
  /** 错误信息 */
  const [errorInfo, setErrorInfo] = useState<Error | null>(null);

  const cancelledRef = useRef(false);

  const exportExcel = useCallback(
    async (
      data:
        | Record<string, unknown>[]
        | (() => Promise<Record<string, unknown>[]>),
    ) => {
      setLoading(true);
      setErrorInfo(null);
      setProgress(0);
      cancelledRef.current = false;
      try {
        const realData = typeof data === 'function' ? await data() : data;
        if (!Array.isArray(realData) || realData.length === 0)
          throw new Error('无数据导出');
        const wb = XLSX.utils.book_new();

        let aoa: any[][] = [];
        let merges: XLSX.Range[] | undefined;

        // ✅ 如果传了多级表头
        if (options?.headers && options.headers.length > 0) {
          const { headerRows, leafKeys } = buildHeaderRows(options.headers);
          merges = buildMerges(options.headers);

          const bodyRows = realData.map((row) =>
            leafKeys.map((key) => row[key] ?? ''),
          );

          aoa = [...headerRows, ...bodyRows];
        } else {
          // ✅ 普通单级表头
          const keys = options?.colums ?? Object.keys(realData[0]);

          const header = keys.map((k) => options?.headersMap?.[k] ?? k);

          const body = realData.map((row) => keys.map((k) => row[k] ?? ''));

          aoa = [header, ...body];
        }

        const ws = XLSX.utils.aoa_to_sheet(aoa);

        if (merges) {
          ws['!merges'] = merges;
        }

        XLSX.utils.book_append_sheet(wb, ws, options?.sheetName ?? 'Sheet1');

        XLSX.writeFile(wb, `${options?.fileName ?? '导出数据'}.xlsx`);

        setProgress(100);
      } catch (err) {
        setErrorInfo(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [
      options?.colums,
      options?.fileName,
      options?.headers,
      options?.headersMap,
      options?.sheetName,
    ],
  );

  return { exportExcel, progress, loading, errorInfo };
}
