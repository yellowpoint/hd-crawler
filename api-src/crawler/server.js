import { PrismaClient } from '@prisma/client';
import express from 'express';

import { crawlerBase } from './base.js';

const prisma = new PrismaClient();
const db = prisma.crawler;
const api = express.Router();

const createDb = async (data) => {
  return await prisma.crawler.create({
    data,
  });
};

export const create = async (config) => {
  const { url, type } = config;
  let typeConfig;
  if (type) {
    const typePath = `./pages/${type}.js`;
    try {
      typeConfig = (await import(typePath)).default;
      console.log('typeConfig', typeConfig);
    } catch (error) {
      console.log('typePath', typePath);
      console.log('typeConfig error', error);
    }
  }
  if (typeof typeConfig === 'function') {
    typeConfig = typeConfig({ url });
  }
  if (typeConfig) {
    config = { ...config, ...typeConfig };
  }
  let crawlerRes = await crawlerBase(config);
  crawlerRes = Array.isArray(crawlerRes) ? crawlerRes : [crawlerRes];
  console.log('开始存入数据库', url);
  const promises = crawlerRes.map((item) => createDb(item));
  await Promise.all(promises);

  return crawlerRes;
};

api.post('/create', async (req, res) => {
  let config = req.body;
  const crawlerRes = await create(config);
  return res.send({ data: crawlerRes, code: 0 });
});

api.post('/get', async (req, res) => {
  const dbres = await db.findUnique({ where: req.body });
  return res.send({ data: dbres, code: 0 });
});

api.post('/all', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.body;
  const dbres = await db.findMany({
    orderBy: { id: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await db.count();
  return res.send({
    data: {
      total,
      list: dbres,
    },
    code: 0,
  });
});

api.post('/update', async (req, res) => {
  const { id, data } = req.body;
  if (!id) return res.send({ code: 1, message: 'id is required' });
  const dbres = await db.update({ where: { id: Number(id) }, data });
  return res.send({ data: dbres, code: 0 });
});

api.post('/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.send({ code: 1, message: 'id is required' });
  await db.delete({ where: { id: Number(id) } });
  return res.send({ code: 0 });
});

export default api;
