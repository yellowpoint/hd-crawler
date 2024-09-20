import { sleep } from 'crawlee';

import { crawlerBase } from '../base.js';
import cookies from './cookies.json' assert { type: "json" };

const config = {
  url: ['https://jandan.net/member'],
  outputFileName: 'jandan.json',
  selector: 'body',
  // headless: false,
  cookie: cookies,
  getPage: async (page, selector = 'body') => {
    const res = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el?.innerText || el?.innerHtml || '';
    }, selector);
    // await sleep(10000);
    return res;
  },
};

crawlerBase(config);
