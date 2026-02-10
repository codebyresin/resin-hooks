import { useState, useCallback, useMemo } from 'react';
import { useExcelExport } from '@resin-hooks/core';
import './demo.css';

/** 多级表头节点类型（与 ExcelHeader 兼容） */
type MultiHeader = { label: string; key?: string; children?: MultiHeader[] };

/** 用户定义的分组 */
type HeaderGroup = { id: string; label: string };

/** 交易流水：字段 key → 中文表头 */
const TRANSACTIONS_HEADERS_MAP: Record<string, string> = {
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
const ACCOUNTS_HEADERS_MAP: Record<string, string> = {
  accountNo: '账号',
  accountName: '户名',
  bank: '开户行',
  accountType: '账户类型',
  balance: '余额',
  openDate: '开户日期',
  status: '状态',
};

const TRANSACTION_COLUMNS = [
  { key: 'txnId', label: '交易流水号' },
  { key: 'txnDate', label: '交易日期' },
  { key: 'txnTime', label: '交易时间' },
  { key: 'type', label: '交易类型' },
  { key: 'amount', label: '交易金额' },
  { key: 'balance', label: '账户余额' },
  { key: 'counterpartyAccount', label: '对方账户' },
  { key: 'counterpartyName', label: '对方户名' },
  { key: 'status', label: '交易状态' },
  { key: 'remark', label: '备注' },
];

const ACCOUNT_COLUMNS = [
  { key: 'accountNo', label: '账号' },
  { key: 'accountName', label: '户名' },
  { key: 'bank', label: '开户行' },
  { key: 'accountType', label: '账户类型' },
  { key: 'balance', label: '余额' },
  { key: 'openDate', label: '开户日期' },
  { key: 'status', label: '状态' },
];

const DATA_COUNT_OPTIONS = [
  { value: 1000, label: '1,000 条' },
  { value: 5000, label: '5,000 条' },
  { value: 10000, label: '1 万 条' },
  { value: 50000, label: '5 万 条' },
  { value: 100000, label: '10 万 条' },
  { value: 150000, label: '15 万 条' },
];

const CHUNK_SIZE_OPTIONS = [
  { value: 2000, label: '2000' },
  { value: 5000, label: '5000' },
  { value: 10000, label: '10000' },
];

const TXN_TYPES = [
  { value: '', label: '全部' },
  { value: 'transfer', label: '转账' },
  { value: 'deposit', label: '存款' },
  { value: 'withdraw', label: '取款' },
  { value: 'payment', label: '消费' },
];

const API_BASE = '/api/excel';

/** 生成模拟交易流水 */
function genMockTransactions(count: number) {
  const types = ['transfer', 'deposit', 'withdraw', 'payment'];
  const statuses = ['success', 'failed', 'pending'];
  const rows: Record<string, unknown>[] = [];
  let balance = 100000 + Math.random() * 500000;

  for (let i = 0; i < count; i++) {
    const type = types[i % 4];
    const amount = Number((Math.random() * 50000 - 5000).toFixed(2));
    balance = Number((balance + amount).toFixed(2));

    rows.push({
      txnId: `T${Date.now()}${i}`,
      txnDate: '2024-01-15',
      txnTime: '10:30:00',
      type,
      amount,
      balance,
      counterpartyAccount: `6222${String(i).padStart(12, '0')}`,
      counterpartyName: `User${i % 20}`,
      status: statuses[i % 3],
      remark: type === 'transfer' ? `Transfer ${i}` : '',
    });
  }
  return rows;
}

/** 生成模拟账户 */
function genMockAccounts(count: number) {
  const banks = ['ICBC', 'CCB', 'ABC', 'BOC'];
  const accountTypes = ['savings', 'credit', 'corporate'];
  const statuses = ['success', 'failed', 'pending'];

  return Array.from({ length: count }, (_, i) => ({
    accountNo: `6222${String(i).padStart(12, '0')}`,
    accountName: `Account${i + 1}`,
    bank: banks[i % 4],
    accountType: accountTypes[i % 3],
    balance: Number((Math.random() * 100000).toFixed(2)),
    openDate: '2023-01-01',
    status: statuses[i % 3],
  }));
}

function nextId() {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function UseExcelExportDemo() {
  const [dataType, setDataType] = useState<'transactions' | 'accounts'>(
    'transactions',
  );
  const [count, setCount] = useState(10000);
  const [headerMode, setHeaderMode] = useState<'simple' | 'multi'>('simple');
  const [headerGroups, setHeaderGroups] = useState<HeaderGroup[]>([]);
  const [fieldGroupMap, setFieldGroupMap] = useState<Record<string, string>>(
    {},
  );
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [chunkSize, setChunkSize] = useState(5000);
  const [txnType, setTxnType] = useState('');
  const [useApi, setUseApi] = useState(true);

  const columns =
    dataType === 'transactions' ? TRANSACTION_COLUMNS : ACCOUNT_COLUMNS;
  const headersMap =
    dataType === 'transactions'
      ? TRANSACTIONS_HEADERS_MAP
      : ACCOUNTS_HEADERS_MAP;

  const allColumnKeys = columns.map((c) => c.key);
  const validSelected = selectedCols.filter((k) => allColumnKeys.includes(k));
  const cols = validSelected.length > 0 ? validSelected : allColumnKeys;

  /** 根据用户分组配置构建多级表头 */
  const multiHeaders = useMemo<MultiHeader[]>(() => {
    if (headerMode !== 'multi' || cols.length === 0) return [];
    const result: MultiHeader[] = [];
    for (const g of headerGroups) {
      const keys = cols.filter((k) => fieldGroupMap[k] === g.id);
      if (keys.length > 0) {
        result.push({
          label: g.label || '未命名',
          children: keys.map((k) => ({
            label: headersMap[k] ?? k,
            key: k,
          })),
        });
      }
    }
    const unassigned = cols.filter(
      (k) =>
        !fieldGroupMap[k] ||
        !headerGroups.some((g) => g.id === fieldGroupMap[k]),
    );
    if (unassigned.length > 0) {
      result.push({
        label: '其他',
        children: unassigned.map((k) => ({
          label: headersMap[k] ?? k,
          key: k,
        })),
      });
    }
    return result;
  }, [headerMode, headerGroups, fieldGroupMap, cols, headersMap]);

  const { exportExcel, progress, loading, errorInfo, cancel } = useExcelExport({
    fileName:
      fileName ||
      (dataType === 'transactions' ? '交易流水' : '账户列表') + '.xlsx',
    sheetName: dataType === 'transactions' ? '交易流水' : '账户列表',
    headersMap,
    colums: cols,
    chunkSize,
    ...(headerMode === 'multi' && { headers: multiHeaders }),
  });

  const toggleColumn = (key: string) => {
    setSelectedCols((prev) => {
      if (prev.length === 0) {
        return allColumnKeys.filter((k) => k !== key);
      }
      return prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
    });
  };

  const selectAllColumns = () => {
    setSelectedCols([]);
  };

  const addHeaderGroup = () => {
    setHeaderGroups((prev) => [...prev, { id: nextId(), label: '新分组' }]);
  };

  const updateHeaderGroup = (id: string, label: string) => {
    setHeaderGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, label } : g)),
    );
  };

  const removeHeaderGroup = (id: string) => {
    setHeaderGroups((prev) => prev.filter((g) => g.id !== id));
    setFieldGroupMap((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (next[k] === id) delete next[k];
      }
      return next;
    });
  };

  const assignFieldToGroup = (fieldKey: string, groupId: string | '') => {
    setFieldGroupMap((prev) => {
      const next = { ...prev };
      if (groupId) {
        next[fieldKey] = groupId;
      } else {
        delete next[fieldKey];
      }
      return next;
    });
  };

  const handleExport = useCallback(() => {
    if (useApi) {
      exportExcel(async () => {
        const params = new URLSearchParams({
          type: dataType,
          count: String(count),
          keys: 'en',
        });
        if (txnType) params.set('txnType', txnType);
        if (cols.length > 0 && cols.length < columns.length) {
          params.set('columns', cols.join(','));
        }
        const res = await fetch(`${API_BASE}/export?${params}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error || `请求失败 ${res.status}`);
        }
        if (!json.ok) throw new Error(json.error || '请求失败');
        return json.data;
      });
    } else {
      const data =
        dataType === 'transactions'
          ? genMockTransactions(count)
          : genMockAccounts(Math.min(count, 10000));
      let filtered = data;
      if (dataType === 'transactions' && txnType) {
        filtered = data.filter(
          (r) => (r as Record<string, unknown>).type === txnType,
        );
      }
      exportExcel(filtered as Record<string, unknown>[]);
    }
  }, [exportExcel, dataType, count, txnType, useApi, cols, columns.length]);

  return (
    <div>
      <h2>useExcelExport Demo</h2>
      <p className="demo-description">
        支持 10 万+ 大批量数据导出，可配置表头、导出列、chunkSize，支持取消。
        使用 API 需先启动 <code>pnpm api:dev</code>
        ；勾选「模拟数据」则无需后端。
      </p>

      <div className="demo-section">
        <div className="excel-controls excel-controls--block">
          <div className="excel-control-row">
            <label>数据类型：</label>
            <select
              value={dataType}
              onChange={(e) => {
                const v = e.target.value as 'transactions' | 'accounts';
                setDataType(v);
                setHeaderGroups([]);
                setFieldGroupMap({});
              }}
            >
              <option value="transactions">交易流水</option>
              <option value="accounts">账户列表</option>
            </select>
          </div>

          <div className="excel-control-row">
            <label>导出数量：</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {DATA_COUNT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="excel-control-row">
            <label>表头模式：</label>
            <select
              value={headerMode}
              onChange={(e) =>
                setHeaderMode(e.target.value as 'simple' | 'multi')
              }
            >
              <option value="simple">单级表头</option>
              <option value="multi">多级表头</option>
            </select>
          </div>

          {headerMode === 'multi' && (
            <div className="excel-mode-block excel-header-groups">
              <h4>多级表头分组</h4>
              <p className="excel-mode-desc">
                添加分组，并将导出列拖入分组，同组字段在 Excel
                中会合并为一级表头。
              </p>
              <button
                type="button"
                onClick={addHeaderGroup}
                className="btn btn-secondary"
              >
                添加分组
              </button>
              <div className="excel-groups-list">
                {headerGroups.map((g) => (
                  <div key={g.id} className="excel-group-card">
                    <div className="excel-group-header">
                      <input
                        type="text"
                        value={g.label}
                        onChange={(e) =>
                          updateHeaderGroup(g.id, e.target.value)
                        }
                        placeholder="分组名称"
                        className="throttle-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeaderGroup(g.id)}
                        className="btn btn-secondary excel-group-remove"
                      >
                        删除
                      </button>
                    </div>
                    <div className="excel-group-fields">
                      {cols.map((key) => {
                        const col = columns.find((c) => c.key === key);
                        const isChecked = fieldGroupMap[key] === g.id;
                        return (
                          <label key={key} className="excel-column-check">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                assignFieldToGroup(
                                  key,
                                  e.target.checked ? g.id : '',
                                )
                              }
                            />
                            {col?.label ?? key}
                          </label>
                        );
                      })}
                    </div>
                    {cols.filter((k) => fieldGroupMap[k] === g.id).length ===
                      0 && (
                      <span className="excel-group-empty">
                        暂无字段，勾选上方字段加入此分组
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {headerGroups.length === 0 && (
                <p className="excel-mode-desc">
                  点击「添加分组」后，为每个分组命名并选择要合并的字段。
                </p>
              )}
            </div>
          )}

          <div className="excel-control-row">
            <label>chunkSize：</label>
            <select
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
            >
              {CHUNK_SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {dataType === 'transactions' && (
            <div className="excel-control-row">
              <label>交易类型筛选：</label>
              <select
                value={txnType}
                onChange={(e) => setTxnType(e.target.value)}
              >
                {TXN_TYPES.map((t) => (
                  <option key={t.value || 'all'} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="excel-control-row">
            <label>文件名：</label>
            <input
              type="text"
              placeholder="留空使用默认"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="throttle-input throttle-input-full"
            />
          </div>

          <div className="excel-control-row">
            <label>导出列（不选则全部）：</label>
            <div className="excel-columns-grid">
              {columns.map((c) => (
                <label key={c.key} className="excel-column-check">
                  <input
                    type="checkbox"
                    checked={
                      selectedCols.length === 0 || selectedCols.includes(c.key)
                    }
                    onChange={() => toggleColumn(c.key)}
                  />
                  {c.label}
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={selectAllColumns}
              className="btn btn-secondary"
            >
              全选
            </button>
          </div>

          <div className="excel-control-row">
            <label>
              <input
                type="checkbox"
                checked={!useApi}
                onChange={(e) => setUseApi(!e.target.checked)}
              />
              使用模拟数据（无需后端，账户最多 1 万条）
            </label>
          </div>
        </div>

        <div className="excel-buttons">
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? `导出中 ${Math.round(progress)}%` : '导出 Excel'}
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
        </div>

        {errorInfo && (
          <div className="excel-error">错误：{errorInfo.message}</div>
        )}
      </div>
    </div>
  );
}
