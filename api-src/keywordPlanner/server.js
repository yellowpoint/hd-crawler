import express from 'express';

import { getKeywordPlannerData } from './googleKeywordPlanner.js';

const api = express.Router();

api.post('/', async (req, res) => {
  const { keyword } = req.body;
  try {
    const data = await getKeywordPlannerData(keyword);
    res.json(data);
  } catch (error) {
    console.error('获取关键词规划器数据时出错:', error);
    res.status(500).json({ error: '获取关键词规划器数据时出错' });
  }
});

export default api;
