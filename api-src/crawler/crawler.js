import { readFile } from 'fs/promises';

import { PrismaClient } from '@prisma/client';
import { BasicCrawler, Dataset } from 'crawlee';
import express from 'express';

import { crawlStart } from './lib/crawlerSetup.js';
import { write, savePageScreenshot } from './lib/utils.js';

import ai from '../ai/ai.js';

const prisma = new PrismaClient();
const api = express.Router();

const crawler = async (url, level = 1) => {
  const crawlConfig = {
    url: [
      url || 'https://www.ruanyifeng.com/blog/2024/06/weekly-issue-304.html',
    ],
    requestHandler: async ({ request, sendRequest, log, page }) => {
      const { url } = request;
      log.info(`Processing ${url}...`);

      const articleContent = await page.evaluate(async () => {
        const elementHandle = document.querySelector('.hentry');
        // const text = elementHandle.textContent.trim();
        const text = elementHandle?.outerHTML?.trim?.();
        return text;
      });

      let aiSummary;
      if (articleContent) {
        console.log('有数据，进行ai分析');
        try {
          aiSummary = await ai({
            prompt:
              '获取博客名称，以及各个大标题分类，以及其分类下的内容整理，只返回最后格式化后的结果',
            text: articleContent,
          });
          console.log('ai分析成功');
        } catch (error) {
          console.log('ai分析失败');
          aiSummary = error || 'ai分析失败';
        }
      }

      const result = {
        url,
        aiSummary,
        html: articleContent,
      };

      await Dataset.pushData(result);
    },
  };
  return await crawlStart(crawlConfig);
};

// crawler();

const addData = async (url, content) => {
  const page = await prisma.base.findUnique({ where: { url } });
  const dbData = {
    url,
    content,
  };
  if (page) {
    const updatedPage = await prisma.base.update({
      where: { id: page.id },
      data: dbData,
    });
    return true;
  } else {
    const newPage = await prisma.base.create({
      data: dbData,
    });
    return false;
  }
};

const getData = async (url, content) => {
  const res = await prisma.base.findUnique({ where: { url } });
  if (res) {
    return res;
  } else {
    return false;
  }
};
const getDataAll = async () => {
  const dbres = await prisma.base.findMany({ orderBy: { id: 'desc' } });
  return dbres;
};
export const crawlerBase = async (req) => {
  let config = req.body;
  const { url, noCrawl } = config;
  console.log('url', url);
  if (!url) throw new Error('url is required');
  let outputFileName;
  if (noCrawl) {
    outputFileName = 'storageoutput-1.json';
  } else {
    await crawler(url);
    outputFileName = await write(config);
  }

  console.log('outputFileName', outputFileName, 'noCrawl', noCrawl);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  outputFileContent = JSON.parse(outputFileContent);
  // outputFileContent.reverse();
  console.log('开始存入数据库', url);
  const isExists = await addData(url, JSON.stringify(outputFileContent));
  // console.log('outputFileContent', outputFileContent);
  return outputFileContent;
};

api.post('/add', async (req, res) => {
  const outputFileContent = await crawlerBase(req.body);
  // const dbres = await getDataAll();
  return res.send({ data: outputFileContent, code: 0 });
});
api.post('/all', async (req, res) => {
  const dbres = await getDataAll();
  return res.send({ data: dbres, code: 0 });
});

export default api;
