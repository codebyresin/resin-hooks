import { useState, useCallback } from 'react';
import { useExcelExport } from '@resin-hooks/core';
import './demo.css';

const API_BASE = 'http://localhost:8080/api/excel';

/** 交易流水：字段 key → 中文表头 */
const TRANSACTIONS_COLUMNS: Record<string, string> = {
  txnId: '交易流水号',
  txnDate: '交易日期',
  txnTime: '交易时间',
  type: '交易类型',
  amount: '交易金额',
  balance: '账户余额',
  counterpartyAccount: '对方账户',
  counterpartyName: '对方户名',
  status: '交易状态',
  remark: '备注',
};

/** 账户列表：字段 key → 中文表头 */
const ACCOUNTS_COLUMNS: Record<string, string> = {
  accountNo: '账号',
  accountName: '户名',
  bank: '开户行',
  accountType: '账户类型',
  balance: '余额',
  openDate: '开户日期',
  status: '状态',
};

/** 数据类型选项 */
const DATA_TYPE_OPTIONS = [
  { value: 'transactions', label: '交易流水' },
  { value: 'accounts', label: '账户列表' },
];

/** 导出数量选项 */
const COUNT_OPTIONS = [
  { value: 100, label: '100 条' },
  { value: 500, label: '500 条' },
  { value: 1000, label: '1000 条' },
  { value: 5000, label: '5000 条' },
  { value: 10000, label: '10000 条' },
];

/** 交易类型筛选 */
const TXN_TYPES = [
  { value: '', label: '全部' },
  { value: '转账', label: '转账' },
  { value: '存款', label: '存款' },
  { value: '取款', label: '取款' },
  { value: '消费', label: '消费' },
];

/** 生成模拟数据（无后端时使用） */
function genMockData(type: 'transactions' | 'accounts', count: number) {
  if (type === 'transactions') {
    return Array.from({ length: count }, (_, i) => ({
      txnId: `T${Date.now()}${i}`,
      txnDate: '2024-01-15',
      txnTime: '10:30:00',
      type: ['转账', '存款', '取款', '消费'][i % 4],
      amount: (Math.random() * 5000 - 500).toFixed(2),
      balance: (10000 + i * 100).toFixed(2),
      counterpartyAccount: `6222${String(i).padStart(12, '0')}`,
      counterpartyName: `用户${i}`,
      status: '成功',
      remark: '',
    }));
  }
  return Array.from({ length: count }, (_, i) => ({
    accountNo: `6222${String(i).padStart(12, '0')}`,
    accountName: `账户${i + 1}`,
    bank: '中国银行',
    accountType: '储蓄卡',
    balance: (Math.random() * 100000).toFixed(2),
    openDate: '2023-01-01',
    status: '正常',
  }));
}

export default function UseExcelExportDemo() {
  const [dataType, setDataType] = useState<'transactions' | 'accounts'>(
    'transactions',
  );
  const [count, setCount] = useState(500);
  const [filterType, setFilterType] = useState('');
  const [downloadStatus, setDownloadStatus] = useState('');
  const [useMock, setUseMock] = useState(false);

  const columnsMap =
    dataType === 'transactions' ? TRANSACTIONS_COLUMNS : ACCOUNTS_COLUMNS;

  const { exportExcel, progress, loading, error, cancel } = useExcelExport({
    filename: dataType === 'accounts' ? '账户列表.xlsx' : '交易流水.xlsx',
    chunkSize: 2000,
    headersMap: columnsMap,
  });

  const handleExport = useCallback(() => {
    setDownloadStatus('');
    if (useMock) {
      exportExcel(genMockData(dataType, count));
    } else {
      exportExcel(async () => {
        const params = new URLSearchParams({
          type: dataType,
          count: String(count),
          keys: 'en',
        });
        if (filterType) params.set('txnType', filterType);
        const res = await fetch(`${API_BASE}/export?${params}`);
        const { data } = await res.json();
        return data;
      });
    }
  }, [exportExcel, dataType, count, filterType, useMock]);

  return (
    <div>
      <h2>useExcelExport Demo</h2>
      <p className="demo-description">
        选择导出数据类型与数量。使用模拟数据无需后端；真实接口需先启动{' '}
        <code>pnpm api:dev</code>。
      </p>

      <div className="demo-section">
        <div className="excel-controls excel-controls--block">
          <div className="excel-control-row">
            <label>导出数据类型：</label>
            <select
              value={dataType}
              onChange={(e) =>
                setDataType(e.target.value as 'transactions' | 'accounts')
              }
            >
              {DATA_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="excel-control-row">
            <label>导出数量：</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {COUNT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="excel-control-row">
            <label>
              <input
                type="checkbox"
                checked={useMock}
                onChange={(e) => setUseMock(e.target.checked)}
              />
              使用模拟数据（无需后端）
            </label>
          </div>

          {dataType === 'transactions' && (
            <div className="excel-control-row">
              <label>交易类型筛选：</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {TXN_TYPES.map((t) => (
                  <option key={t.value || 'all'} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="excel-buttons">
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '导出中...' : '导出'}
          </button>
          {loading && (
            <div className="excel-progress-wrap">
              <progress value={progress} max={100} className="excel-progress" />
              <span>{Math.round(progress)}%</span>
              <button
                onClick={cancel}
                className="btn btn-secondary excel-cancel-btn"
              >
                取消
              </button>
            </div>
          )}
          {downloadStatus && (
            <span className="excel-download-status">{downloadStatus}</span>
          )}
        </div>

        {error && <div className="excel-error">错误：{error.message}</div>}
      </div>
    </div>
  );
}
