import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

const handleCrud = async (req, res) => {
  const { model, operation, id, data, page = 1, pageSize = 10 } = req.body;
  // const { page = 1, pageSize = 10 } = req.query;

  switch (operation) {
    case 'create':
      try {
        const result = await prisma[model].create({
          data,
        });
        res.send({ data: result, code: 0 });
      } catch (error) {
        res.status(400).send({ data: error.message, code: 1 });
      }
      break;

    case 'readOne':
      try {
        const result = await prisma[model].findUnique({
          where: { id: Number(id) },
        });
        if (!result) {
          return res.status(404).send({ data: 'Not found', code: 1 });
        }
        res.send({ data: result, code: 0 });
      } catch (error) {
        res.status(400).send({ data: error.message, code: 1 });
      }
      break;

    case 'readMany':
      try {
        const result = await prisma[model].findMany({
          take: Number(pageSize),
          skip: (Number(page) - 1) * Number(pageSize),
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
        res.status(400).send({ data: error.message, code: 1 });
      }
      break;

    case 'update':
      try {
        const result = await prisma[model].update({
          where: { id: Number(id) },
          data,
        });
        res.send({ data: result, code: 0 });
      } catch (error) {
        res.status(400).send({ data: error.message, code: 1 });
      }
      break;

    case 'delete':
      try {
        await prisma[model].delete({
          where: { id: Number(id) },
        });
        res.send({ data: 'Success', code: 0 });
      } catch (error) {
        res.status(400).send({ data: error.message, code: 1 });
      }
      break;

    default:
      res.status(400).send({ data: 'Invalid operation', code: 1 });
  }
};

// 定义统一的CRUD路由
router.post('/', handleCrud);

export default router;
