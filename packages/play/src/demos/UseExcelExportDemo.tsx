import { useState, useCallback } from 'react';
import { useExcelExport } from '@resin-hooks/core';
import './demo.css';

/** 多级表头节点类型（与 ExcelHeader 兼容） */
type MultiHeader = { label: string; key?: string; children?: MultiHeader[] };

/** 单级表头：字段 key → 中文表头 */
const SIMPLE_HEADERS_MAP: Record<string, string> = {
  name: '姓名',
  age: '年龄',
  department: '部门',
  salary: '薪资',
};

/** 多级表头示例 */
const MULTI_LEVEL_HEADERS: MultiHeader[] = [
  {
    label: '基本信息',
    children: [
      { label: '姓名', key: 'name' },
      { label: '年龄', key: 'age' },
      {
        label: '工作信息',
        children: [
          { label: '部门', key: 'department' },
          { label: '薪资', key: 'salary' },
        ],
      },
    ],
  },
  {
    label: '联系方式',
    children: [
      { label: '手机', key: 'phone' },
      { label: '邮箱', key: 'email' },
    ],
  },
];

/** 多级表头对应的字段映射 */
const MULTI_HEADERS_MAP: Record<string, string> = {
  name: '姓名',
  age: '年龄',
  department: '部门',
  salary: '薪资',
  phone: '手机',
  email: '邮箱',
};

/** 生成模拟数据 */
function genMockData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: `员工${i + 1}`,
    age: 22 + (i % 20),
    department: ['研发部', '产品部', '市场部', '人力资源'][i % 4],
    salary: (8000 + Math.random() * 12000).toFixed(0),
    phone: `138${String(i).padStart(8, '0')}`,
    email: `user${i + 1}@example.com`,
  }));
}

export default function UseExcelExportDemo() {
  const [mode, setMode] = useState<'simple' | 'multi'>('simple');
  const [dataCount, setDataCount] = useState(100);
  const [useAsync, setUseAsync] = useState(false);

  const { exportExcel, progress, loading, errorInfo } = useExcelExport({
    fileName: mode === 'simple' ? '员工列表.xlsx' : '员工列表-多级表头.xlsx',
    sheetName: 'Sheet1',
    headersMap: mode === 'simple' ? SIMPLE_HEADERS_MAP : MULTI_HEADERS_MAP,
    ...(mode === 'multi' && { headers: MULTI_LEVEL_HEADERS }),
  });

  const handleExport = useCallback(() => {
    if (useAsync) {
      // 模拟异步拉取数据
      exportExcel(async () => {
        await new Promise((r) => setTimeout(r, 500));
        return genMockData(dataCount);
      });
    } else {
      exportExcel(genMockData(dataCount));
    }
  }, [exportExcel, dataCount, useAsync]);

  return (
    <div>
      <h2>useExcelExport Demo</h2>
      <p className="demo-description">
        将数据导出为 Excel 文件。支持单级表头、多级表头，以及同步/异步数据源。
      </p>

      <div className="demo-section">
        <div className="excel-controls excel-controls--block">
          <div className="excel-control-row">
            <label>表头模式：</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'simple' | 'multi')}
            >
              <option value="simple">单级表头</option>
              <option value="multi">多级表头</option>
            </select>
          </div>

          <div className="excel-control-row">
            <label>导出条数：</label>
            <select
              value={dataCount}
              onChange={(e) => setDataCount(Number(e.target.value))}
            >
              <option value={50}>50 条</option>
              <option value={100}>100 条</option>
              <option value={500}>500 条</option>
              <option value={1000}>1000 条</option>
            </select>
          </div>

          <div className="excel-control-row">
            <label>
              <input
                type="checkbox"
                checked={useAsync}
                onChange={(e) => setUseAsync(e.target.checked)}
              />
              使用异步数据源（模拟接口请求）
            </label>
          </div>
        </div>

        <div className="excel-buttons">
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '导出中...' : '导出 Excel'}
          </button>
          {loading && (
            <div className="excel-progress-wrap">
              <progress value={progress} max={100} className="excel-progress" />
              <span>{Math.round(progress)}%</span>
            </div>
          )}
        </div>

        {errorInfo && (
          <div className="excel-error">错误：{errorInfo.message}</div>
        )}
      </div>

      <div className="demo-code">
        <h3>使用示例</h3>
        <pre>
          <code>{`// 单级表头
const { exportExcel, loading, progress, errorInfo } = useExcelExport({
  fileName: '导出数据.xlsx',
  headersMap: { name: '姓名', age: '年龄' },
});

// 同步数据
exportExcel([{ name: '张三', age: 25 }]);

// 异步数据
exportExcel(async () => {
  const res = await fetch('/api/data');
  return res.json();
});`}</code>
        </pre>
      </div>
    </div>
  );
}
