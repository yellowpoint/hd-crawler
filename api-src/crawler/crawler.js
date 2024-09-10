import { PrismaClient } from '@prisma/client';
import { BasicCrawler, Dataset } from 'crawlee';
import express from 'express';

import { crawlerBase } from './lib/base.js';

const prisma = new PrismaClient();
const db = prisma.crawler;
const api = express.Router();

const addData = async (data) => {
  return await prisma.crawler.create({
    data,
  });
};

const getData = async (data) => {
  const res = await db.findUnique({ where: data });
  return res;
};

const getDataAll = async () => {
  const dbres = await db.findMany({ orderBy: { id: 'desc' } });
  return dbres;
};

api.post('/add', async (req, res) => {
  let config = req.body;
  const { url } = config;
  const outputFileContent = await crawlerBase(config);
  console.log('开始存入数据库', url);
  if (Array.isArray(outputFileContent)) {
    const promises = outputFileContent.map((item) => addData(item));
    await Promise.all(promises);
  } else {
    await addData(outputFileContent);
  }
  return res.send({ data: outputFileContent, code: 0 });
});
api.post('/all', async (req, res) => {
  const dbres = await getDataAll();
  return res.send({ data: dbres, code: 0 });
});
api.post('/get', async (req, res) => {
  const dbres = await getData(req.body);
  return res.send({ data: dbres, code: 0 });
});

export default api;
