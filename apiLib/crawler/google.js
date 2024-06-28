import { readFile } from 'fs/promises';

import { PrismaClient } from '@prisma/client';
import { BasicCrawler, Dataset } from 'crawlee';
import express from 'express';
import expressWs from 'express-ws';

import { getRelatedSearchesAndAlsoAsks } from './googleUtils.js';
import { crawlStart } from './lib/crawlerSetup.js';
import { write, savePageScreenshot } from './lib/utils.js';

const prisma = new PrismaClient();
const router = express.Router();
expressWs(router);
const logAndWsSend = (log, ws) => {
  console.log(log);
  ws?.send?.(log);
};
const googleCrawler = async (keyword, level = 1, ws, parentKeyword) => {
  const requestHandler = async ({ request, sendRequest, log, page }) => {
    const { url } = request;

    logAndWsSend(keyword + '，开始获取------------------------', ws);
    const { people_also_ask, presentation, related_searches } =
      await getRelatedSearchesAndAlsoAsks(page, keyword);

    let result = {
      keyword,
      url,
      people_also_ask,
      presentation,
      related_searches,
    };

    try {
      logAndWsSend(keyword + '，获取数据完成：' + JSON.stringify(result), ws);

      logAndWsSend(keyword + '，开始存储', ws);
      await Dataset.pushData(result);
      await addData(keyword, JSON.stringify(result), parentKeyword);
      logAndWsSend(keyword + '，存储成功', ws);
    } catch (error) {
      logAndWsSend(keyword + '，存储失败：' + error, ws);
    }

    if (level < 2) {
      // 添加通配符搜索
      const keywordAndxing = ['*' + keyword, keyword + '*'];
      logAndWsSend(
        keyword + '，添加通配符搜索：' + JSON.stringify(keywordAndxing),
        ws,
      );
      logAndWsSend(
        keyword + '，添加搜索框提示词搜索：' + JSON.stringify(presentation),
        ws,
      );

      // const suggestArrPromise = [...keywordAndxing, ...presentation].map(
      const suggestArrPromise = [...keywordAndxing, ...presentation]
        .slice(0, 5)
        .map((i) => {
          return googleCrawler(i, level + 1, ws, keyword)
            .then(() => i + ',成功了')
            .catch((error) => {
              console.error('Error in processing item:', error);
              return i + ',报错了';
            });
        });
      const suggestArr = await Promise.all(suggestArrPromise);
      logAndWsSend(keyword + '所有搜索完成：' + JSON.stringify(suggestArr), ws);
    }
  };
  return await crawlStart({
    url: ['https://www.google.com/search?q=' + encodeURIComponent(keyword)],
    requestHandler,
  });
};

const addData = async (keyword, content, parentKeyword) => {
  const page = await prisma.google.findUnique({ where: { keyword } });
  let parentKeywords = page?.parentKeywords;
  if (parentKeyword) {
    parentKeywords = JSON.parse(parentKeywords || '[]');
    parentKeywords.push(parentKeyword);
    parentKeywords = JSON.stringify(parentKeywords);
  }
  let dbData = {
    keyword,
    content,
  };
  if (parentKeywords) {
    dbData.parentKeywords = parentKeywords;
  }
  if (page) {
    const updatedPage = await prisma.google.update({
      where: { id: page.id },
      data: dbData,
    });
    return true;
  } else {
    const newPage = await prisma.google.create({
      data: dbData,
    });
    return false;
  }
};

const getData = async (keyword) => {
  const main = await prisma.google.findUnique({ where: { keyword } });
  if (!main) return null;
  const children = await prisma.google.findMany({
    where: {
      OR: [{ parentKeywords: { contains: keyword } }],
    },
  });
  const res = { ...main, children };
  return res;
};
const getDataAll = async (keyword, content) => {
  const dbres = await prisma.google.findMany({
    where: {
      parentKeywords: null,
    },
    orderBy: { id: 'desc' },
  });
  return dbres;
};
export const crawlerGoogle = async (req, ws) => {
  let config = req.body;
  const keyword = config?.keyword;
  console.log('keyword', keyword);
  if (!keyword) throw new Error('keyword is required');

  await googleCrawler(keyword, 1, ws);
  const outputFileName = await write(config);

  console.log('outputFileName', outputFileName);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  outputFileContent = JSON.parse(outputFileContent);
  outputFileContent.reverse();
  const isExists = await addData(keyword, JSON.stringify(outputFileContent));
  // console.log('outputFileContent', outputFileContent);
  return outputFileContent;
};
export const crawlerGoogleWs = async (keyword, ws) => {
  console.log('keyword', keyword);
  if (!keyword) throw new Error('keyword is required');

  await googleCrawler(keyword, 1, ws);
};

router.post('/get', async (req, res) => {
  let config = req.body;
  const keyword = config?.keyword;
  console.log('keyword', keyword);
  if (!keyword) {
    return res.send({ message: 'keyword is required', code: 1 });
  }
  const outputFileContent = await getData(keyword);
  return res.send({ data: outputFileContent, code: 0 });
});
router.post('/add', async (req, res) => {
  const outputFileContent = await crawlerGoogle(req);
  // const dbres = await getDataAll();
  return res.send({ data: outputFileContent, code: 0 });
});
router.ws('/addws', async (ws, req) => {
  // console.log('addws', req);
  ws.send('来自服务端推送的消息');
  ws.on('message', async (msg) => {
    ws.send(`收到客户端的消息为：${msg}`);
    if (!msg) {
      ws.send('keyword is required');
      return;
    }
    await crawlerGoogleWs(msg, ws);
  });

  // return res.send({ data: outputFileContent, code: 0 });
});

router.post('/all', async (req, res) => {
  const dbres = await getDataAll();
  return res.send({ data: dbres, code: 0 });
});

export default router;
