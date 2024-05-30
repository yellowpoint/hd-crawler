import { readFile } from 'fs/promises';

import { BasicCrawler, Dataset } from 'crawlee';

import { crawlStart } from './lib/crawlerSetup.js';
import { write, savePageScreenshot } from './lib/utils.js';

const googleCrawler = async (key) => {
  const crawlConfig = {
    url: ['https://www.google.com/search?q=' + encodeURIComponent(key)],
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
        key,
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

export const crawlerGoogle = async (req) => {
  let config = req.body;
  const key = config?.key;
  console.log('key', key);
  if (!key) throw new Error('key is required');

  await googleCrawler(key);
  const outputFileName = await write(config);
  console.log('outputFileName', outputFileName);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  // console.log('outputFileContent', outputFileContent);
  outputFileContent = JSON.parse(outputFileContent);
  return outputFileContent;
};
