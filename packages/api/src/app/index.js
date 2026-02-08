const express = require('express');
const cors = require('cors');

const routes = require('../routes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由挂载
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
