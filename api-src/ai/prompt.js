import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

// 创建一个新的提示
router.post('/create', async (req, res) => {
  const { name, content } = req.body;
  try {
    const prompt = await prisma.prompt.create({
      data: { name, content },
    });
    res.json(prompt);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: '提示名称必须唯一' });
    } else {
      res.status(500).json({ error: '服务器错误' });
    }
  }
});

// 更新提示并保存历史记录
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;

  try {
    const prompt = await prisma.prompt.update({
      where: { id: Number(id) },
      data: { name, content },
    });

    await prisma.promptHistory.create({
      data: {
        promptId: Number(id),
        content,
      },
    });

    res.json(prompt);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: '提示名称必须唯一' });
    } else {
      res.status(500).json({ error: '服务器错误' });
    }
  }
});

// 获取提示的历史记录
router.get('/get/:id/history', async (req, res) => {
  const { id } = req.params;
  const histories = await prisma.promptHistory.findMany({
    where: { promptId: Number(id) },
    orderBy: { createdAt: 'asc' },
  });
  res.json(histories);
});

// 比较两个提示
router.get('/compare', async (req, res) => {
  const { firstId, secondId } = req.query;

  const firstPrompt = await prisma.promptHistory.findUnique({
    where: { id: Number(firstId) },
  });

  const secondPrompt = await prisma.promptHistory.findUnique({
    where: { id: Number(secondId) },
  });

  if (!firstPrompt || !secondPrompt) {
    return res.status(404).json({ error: '提示未找到' });
  }

  const diff = getDiff(firstPrompt.content, secondPrompt.content);
  res.json(diff);
});

// 一个简单的差异函数（可以使用像 diff-match-patch 这样的库来实现更复杂的差异）
function getDiff(content1, content2) {
  // 实现你的差异逻辑
  // 简单起见，这个函数仅返回两个内容
  return {
    original: content1,
    modified: content2,
  };
}

export default router;
