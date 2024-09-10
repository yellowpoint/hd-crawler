import { sleep } from 'crawlee';

import { crawlerBase } from '../base.js';

const config = {
  url: ['https://www.tmbbs.com/forum-xinwenbaoliao-1.html'],
  // maxRequestsPerCrawl: 3,
  outputFileName: 'tianmen.json',
  // headless: false,
  getPage: async (page, selector = 'body') => {
    const res = await page.evaluate((selector) => {
      const results = document.querySelectorAll('.xst');
      if (results.length) {
        return Array.from(results)
          .map((el) => el.innerText)
          .join('\n');
      }
      const el = document.querySelector(selector);
      return el?.innerText || el?.innerHtml || '';
    }, selector);
    // await sleep(10000);
    return res;
  },
};

crawlerBase(config);
