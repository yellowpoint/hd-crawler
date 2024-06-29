import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();

const api = express.Router();

api.post('/page', async (req, res) => {
  const { url } = req.body;
  const page = await prisma.page.findUnique({ where: { url } });
  if (page) {
    const updatedPage = await prisma.page.update({
      where: { id: page.id },
      data: req.body,
    });
    res.json(updatedPage);
  } else {
    const newPage = await prisma.page.create({
      data: req.body,
    });
    res.json(newPage);
  }
});

// 更新一个 page
api.put('/page/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, content } = req.body;
  const page = await prisma.page.update({
    where: {
      id: Number(id),
    },
    data: req.body,
  });
  res.json(page);
});

// 删除一个 page
api.delete('/page/:id', async (req, res) => {
  const { id } = req.params;
  const page = await prisma.page.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(page);
});

// 获取一个 page
api.get('/page/:id', async (req, res) => {
  const { id } = req.params;
  const page = await prisma.page.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(page);
});

// 获取所有的 page
api.get('/pages', async (req, res) => {
  const pages = await prisma.page.findMany();
  res.json(pages);
});

export default api;
