/**
 * 银行相关 Mock 数据
 * 用于 Excel 导出/导入演示
 */

const TXN_TYPES = ['转账', '存款', '取款', '消费'];
const TXN_TYPES_EN = ['transfer', 'deposit', 'withdraw', 'payment'];
const STATUSES = ['成功', '失败', '处理中'];
const STATUSES_EN = ['success', 'failed', 'pending'];
const BANKS = ['中国工商银行', '中国建设银行', '中国农业银行', '中国银行'];
const BANKS_EN = ['ICBC', 'CCB', 'ABC', 'BOC'];
const ACCOUNT_TYPES = ['储蓄卡', '信用卡', '对公账户'];
const ACCOUNT_TYPES_EN = ['savings', 'credit', 'corporate'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomId() {
  return `T${Date.now()}${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function formatTime(d) {
  return d.toTimeString().slice(0, 8);
}

/** 生成交易流水（中文 key） */
function genTransactions(count) {
  const rows = [];
  let balance = 100000 + Math.random() * 500000;
  const baseDate = new Date('2024-01-01');

  for (let i = 0; i < count; i++) {
    const type = randomItem(TXN_TYPES);
    const amount = Number((Math.random() * 50000 - 5000).toFixed(2));
    balance = Number((balance + amount).toFixed(2));
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(i / 100));

    rows.push({
      交易流水号: randomId(),
      交易日期: formatDate(date),
      交易时间: formatTime(new Date()),
      交易类型: type,
      交易金额: amount,
      账户余额: balance,
      对方账户: `6222${String(Math.floor(Math.random() * 1e12)).padStart(12, '0')}`,
      对方户名: `用户${i % 20}`,
      交易状态: randomItem(STATUSES),
      备注: type === '转账' ? `转账备注${i}` : '',
    });
  }
  return rows;
}

/** 生成交易流水（英文 key） */
function genTransactionsEn(count) {
  const rows = [];
  let balance = 100000 + Math.random() * 500000;
  const baseDate = new Date('2024-01-01');

  for (let i = 0; i < count; i++) {
    const typeIdx = Math.floor(Math.random() * TXN_TYPES.length);
    const type = TXN_TYPES[typeIdx];
    const typeEn = TXN_TYPES_EN[typeIdx];
    const amount = Number((Math.random() * 50000 - 5000).toFixed(2));
    balance = Number((balance + amount).toFixed(2));
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(i / 100));

    rows.push({
      txnId: randomId(),
      txnDate: formatDate(date),
      txnTime: formatTime(new Date()),
      type: type,
      amount: amount,
      balance: balance,
      counterpartyAccount: `6222${String(Math.floor(Math.random() * 1e12)).padStart(12, '0')}`,
      counterpartyName: `User${i % 20}`,
      status: randomItem(STATUSES_EN),
      remark: type === '转账' ? `Transfer note ${i}` : '',
    });
  }
  return rows;
}

/** 生成账户列表（中文 key） */
function genAccounts(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const openDate = new Date('2023-01-01');
    openDate.setDate(openDate.getDate() + i * 3);
    rows.push({
      账号: `6222${String(Math.floor(Math.random() * 1e12)).padStart(12, '0')}`,
      户名: `账户${i + 1}`,
      开户行: randomItem(BANKS),
      账户类型: randomItem(ACCOUNT_TYPES),
      余额: Number((Math.random() * 100000).toFixed(2)),
      开户日期: formatDate(openDate),
      状态: randomItem(STATUSES),
    });
  }
  return rows;
}

/** 生成账户列表（英文 key） */
function genAccountsEn(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const openDate = new Date('2023-01-01');
    openDate.setDate(openDate.getDate() + i * 3);
    rows.push({
      accountNo: `6222${String(Math.floor(Math.random() * 1e12)).padStart(12, '0')}`,
      accountName: `Account${i + 1}`,
      bank: randomItem(BANKS_EN),
      accountType: randomItem(ACCOUNT_TYPES_EN),
      balance: Number((Math.random() * 100000).toFixed(2)),
      openDate: formatDate(openDate),
      status: randomItem(STATUSES_EN),
    });
  }
  return rows;
}

module.exports = {
  genTransactions,
  genTransactionsEn,
  genAccounts,
  genAccountsEn,
};
