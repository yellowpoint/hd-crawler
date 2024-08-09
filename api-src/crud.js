import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

const handleCreate = async (req, res) => {
  const { model, operation, id, data, page = 1, pageSize = 10 } = req.body;

  try {
    const result = await prisma[model].create({
      data,
    });
    res.send({ data: result, code: 0 });
  } catch (error) {
    res.status(200).send({ data: error.message, code: 1 });
  }
};

const handleUpdate = async (req, res) => {
  const { model, operation, id, data, page = 1, pageSize = 10 } = req.body;

  try {
    const result = await prisma[model].update({
      where: { id: Number(id) },
      data,
    });
    if (['prompt', 'flow'].includes(model)) {
      await prisma[model + 'History'].create({
        data: {
          [model + 'Id']: Number(id),
          content: data.content,
        },
      });
    }
    res.send({ data: result, code: 0 });
  } catch (error) {
    res.status(200).send({ data: error.message, code: 1 });
  }
};

const handleCrud = async (req, res) => {
  const {
    model,
    operation,
    id,
    data,
    page = 1,
    pageSize = 10,
    filter,
  } = req.body;

  switch (operation) {
    case 'createOrUpdate':
      await (id ? handleUpdate : handleCreate)(req, res);
      break;
    case 'create':
      await handleCreate(req, res);
      break;
    case 'update':
      await handleUpdate(req, res);
      break;

    case 'readOne':
      try {
        const result = await prisma[model].findUnique({
          where: { id: Number(id) },
        });
        if (!result) {
          return res.status(200).send({ data: 'Not found', code: 1 });
        }
        res.send({ data: result, code: 0 });
      } catch (error) {
        res.status(200).send({ data: error.message, code: 1 });
      }
      break;

    case 'readMany':
      try {
        const result = await prisma[model].findMany({
          take: Number(pageSize),
          skip: (Number(page) - 1) * Number(pageSize),
          include: ['prompt', 'flow'].includes(model) && {
            histories: {
              orderBy: { createdAt: 'desc' },
              select: { id: true, [model + 'Id']: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        const total = await prisma[model].count();
        res.send({
          data: {
            total,
            list: result,
          },
          code: 0,
        });
      } catch (error) {
        res.status(200).send({ data: error.message, code: 1 });
      }
      break;
    case 'readManyWithFilter':
      const { key, value } = filter;
      try {
        const result = await prisma[model].findMany({
          where: { [key]: value },
          take: Number(pageSize),
          skip: (Number(page) - 1) * Number(pageSize),
          orderBy: { createdAt: 'desc' },
        });
        const total = await prisma[model].count({
          where: { [key]: value },
        });
        res.send({
          data: {
            total,
            list: result,
          },
          code: 0,
        });
      } catch (error) {
        res.status(200).send({ data: error.message, code: 1 });
      }
      break;
    case 'delete':
      try {
        await prisma[model].delete({
          where: { id: Number(id) },
        });
        res.send({ data: 'Success', code: 0 });
      } catch (error) {
        res.status(200).send({ data: error.message, code: 1 });
      }
      break;

    default:
      res.status(200).send({ data: 'Invalid operation', code: 1 });
  }
};

// 定义统一的CRUD路由
router.post('/', handleCrud);

export default router;
