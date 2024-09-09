import { PrismaClient } from '@prisma/client';
import express from 'express';

import { crawlerBase } from './lib/base.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/base', async (req, res) => {
  const outputFileContent = await crawlerBase(req.body);
  res.json({
    code: 0,
    data: outputFileContent,
  });
});

export default router;
