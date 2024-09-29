import express from 'express';
import { crawlerRun } from './base.js';
const router = express.Router();

// 定义一个简单的爬虫接口
router.get('/create', async (req, res) => {
  try {
    const params = req.query;
    // 这里可以添加爬虫启动的逻辑
    const result = await crawlerRun(params);
    res.send({ code: 0, data: result });
  } catch (error) {
    console.log('error', error);
    res.send({ data: error.message, code: 1 });
  }
});

export default router;
