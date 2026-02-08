const express = require('express');
const router = express.Router();

// POST /api/chat - AI 对话
router.post('/', (req, res) => {
  res.json({ message: 'AI chat - TODO' });
});

module.exports = router;
