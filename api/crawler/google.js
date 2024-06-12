import { readFile } from 'fs/promises';

import { PrismaClient } from '@prisma/client';
import { BasicCrawler, Dataset } from 'crawlee';
import express from 'express';

import { crawlStart } from './lib/crawlerSetup.js';
import { write, savePageScreenshot } from './lib/utils.js';

const prisma = new PrismaClient();
const api = express.Router();

const googleCrawler = async (keyword) => {
  const crawlConfig = {
    url: ['https://www.google.com/search?q=' + encodeURIComponent(keyword)],
    requestHandler: async ({ request, sendRequest, log, page }) => {
      const { url } = request;
      log.info(`Processing ${url}...`);

      // await savePageScreenshot(page);
      const people_also_ask = await page.evaluate(() => {
        const elementHandle = document.querySelectorAll(
          '.related-question-pair',
        );
        const text = Array.from(elementHandle).map((child) =>
          child.getAttribute('data-q'),
        );
        return text;
      });

      await page.click('textarea');
      // await page.waitForSelector('#Alh6id');
      const presentation = await page.evaluate(async () => {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        const elementHandle = document.querySelectorAll(
          '#Alh6id li.PZPZlf .wM6W7d',
        );
        const text = Array.from(elementHandle).map(
          (child) => child.textContent,
        );
        return text;
      });
      // // 使用page.evaluate在页面上下文中执行滚动代码
      // await page.evaluate(() => {
      //   // 计算滚动的目标位置，这里是页面的总高度
      //   const totalHeight = document.body.scrollHeight;

      //   // 滚动到页面底部
      //   window.scrollTo(0, totalHeight);
      // });
      const related_searches = await page.evaluate(async () => {
        const elementHandle = document.querySelectorAll('#bres a');
        const text = Array.from(elementHandle).map((child) =>
          child.textContent.trim(),
        );
        return text;
      });

      // Store the HTML and URL to the default dataset.
      await Dataset.pushData({
        keyword,
        url,
        people_also_ask,
        presentation,
        related_searches,
        // html: body,
      });
    },
  };
  await crawlStart(crawlConfig);
};
const addData = async (keyword, content) => {
  const page = await prisma.google.findUnique({ where: { keyword } });
  const dbData = {
    keyword,
    content,
  };
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

const getData = async (keyword, content) => {
  const res = await prisma.google.findUnique({ where: { keyword } });
  if (res) {
    return res;
  } else {
    return false;
  }
};
const getDataAll = async (keyword, content) => {
  const dbres = await prisma.google.findMany({ orderBy: { id: 'desc' } });
  return dbres;
};
export const crawlerGoogle = async (req) => {
  let config = req.body;
  const keyword = config?.keyword;
  console.log('keyword', keyword);
  if (!keyword) throw new Error('keyword is required');

  await googleCrawler(keyword);
  const outputFileName = await write(config);
  console.log('outputFileName', outputFileName);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  outputFileContent = JSON.parse(outputFileContent);
  outputFileContent = outputFileContent[0];
  const isExists = await addData(keyword, JSON.stringify(outputFileContent));
  // console.log('outputFileContent', outputFileContent);
  return outputFileContent;
};

api.post('/add', async (req, res) => {
  const outputFileContent = await crawlerGoogle(req);
  const dbres = getDataAll();
  return res.send({ data: dbres, code: 0 });
});
api.post('/all', async (req, res) => {
  const dbres = getDataAll();
  return res.send({ data: dbres, code: 0 });
});

export default api;
