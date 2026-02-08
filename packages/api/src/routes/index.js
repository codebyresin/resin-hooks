const express = require('express');
const excelRouter = require('./excel');
const chatRouter = require('./chat');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

router.use('/excel', excelRouter);
router.use('/chat', chatRouter);

module.exports = router;
