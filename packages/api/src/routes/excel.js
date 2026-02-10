const express = require('express');
const ExcelJS = require('exceljs');
const router = express.Router();
const {
  genTransactions,
  genTransactionsEn,
  genAccounts,
  genAccountsEn,
} = require('../mock/bankData');

/** 交易流水英文字段 → 中文表头映射 */
const TRANSACTIONS_HEADERS_MAP = {
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

/** 账户列表英文字段 → 中文表头映射 */
const ACCOUNTS_HEADERS_MAP = {
  accountNo: '账号',
  accountName: '户名',
  bank: '开户行',
  accountType: '账户类型',
  balance: '余额',
  openDate: '开户日期',
  status: '状态',
};

// GET /api/excel/ping - 健康检查
router.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'excel route ok' });
});

// GET /api/excel/export - 返回 JSON 数据（供前端 useExcelExport 用 xlsx 生成）
// 支持 query: type, count, keys=zh|en, txnType=交易类型筛选, columns=逗号分隔的列
router.get('/export', (req, res, next) => {
  try {
    const {
      type = 'transactions',
      count = 500,
      keys = 'en',
      txnType,
      columns,
    } = req.query;
    const num = Math.min(Math.max(Number(count) || 500, 1), 200000);
    const useEn = keys === 'en';

    let data;
    if (type === 'accounts') {
      const accountCount = Math.min(num, 10000);
      data = useEn ? genAccountsEn(accountCount) : genAccounts(accountCount);
    } else {
      data = useEn ? genTransactionsEn(num) : genTransactions(num);
      if (txnType) {
        const typeKey = useEn ? 'type' : '交易类型';
        data = data.filter((row) => row[typeKey] === txnType);
      }
    }

    // 若指定 columns，只返回这些列
    if (columns && typeof columns === 'string' && data.length > 0) {
      const cols = columns
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (cols.length > 0) {
        const allKeys = Object.keys(data[0]);
        const validCols = cols.filter((c) => allKeys.includes(c));
        if (validCols.length > 0) {
          data = data.map((row) => {
            const o = {};
            validCols.forEach((k) => (o[k] = row[k]));
            return o;
          });
        }
      }
    }

    res.json({ ok: true, data, total: data.length });
  } catch (err) {
    console.error('[excel/export]', err);
    next(err);
  }
});

// GET /api/excel/download - 后端用 exceljs 生成 Excel 文件并返回
// 支持 query: type=transactions|accounts, count=数量, filename=文件名, keys=zh|en, txnType=交易类型筛选
router.get('/download', async (req, res) => {
  const {
    type = 'transactions',
    count = 500,
    filename = '银行流水.xlsx',
    keys = 'zh',
    txnType,
  } = req.query;
  const num = Math.min(Math.max(Number(count) || 500, 1), 200000);
  const useEn = keys === 'en';

  let data;
  if (type === 'accounts') {
    data = useEn
      ? genAccountsEn(Math.min(num, 100))
      : genAccounts(Math.min(num, 100));
  } else {
    data = useEn ? genTransactionsEn(num) : genTransactions(num);
    if (txnType) {
      const key = useEn ? 'type' : '交易类型';
      data = data.filter((row) => row[key] === txnType);
    }
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    type === 'accounts' ? '账户列表' : '交易流水',
    {
      headerFooter: { firstHeader: '', firstFooter: '' },
    },
  );

  const dataKeys = Object.keys(data[0] || {});
  const headersMap = useEn
    ? type === 'accounts'
      ? ACCOUNTS_HEADERS_MAP
      : TRANSACTIONS_HEADERS_MAP
    : null;
  const headers = headersMap
    ? dataKeys.map((k) => headersMap[k] ?? k)
    : dataKeys;
  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };

  data.forEach((row) => {
    sheet.addRow(dataKeys.map((k) => row[k]));
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
  );

  await workbook.xlsx.write(res);
  res.end();
});

// POST /api/excel/import - Excel 导入（需 multer 处理 multipart/form-data）
router.post('/import', (req, res) => {
  res.json({ message: 'Excel import - TODO' });
});

module.exports = router;
