import { sleep } from 'crawlee';

import { crawlerBase } from '../base.js';
import { create } from '../server.js';

const config = (props) => ({
  ...props,
  // maxRequestsPerCrawl: 3,
  outputFileName: 'googleTop10.json',
  // headless: false,
  getPage: async (page, selector = 'body', { enqueueLinks }) => {
    const res = await page.evaluate((selector) => {
      const results_ad = Array.from(document.querySelectorAll('.uEierd'))?.map(
        (el) => {
          return {
            url: el.querySelector('a')?.href,
            title: el.querySelector('[role="heading"]')?.innerText,
            isAd: true,
          };
        },
      );
      const results = Array.from(document.querySelectorAll('.MjjYud'))?.map(
        (el) => {
          return {
            url: el.querySelector('a')?.href,
            title: el.querySelector('h3')?.innerText,
          };
        },
      );
      const res = [...results_ad, ...results];
      return { html: res, subPages: res.slice(0, 10) };
    }, selector);

    // await sleep(100000);
    return res;
  },
});

// crawlerBase(
//   config({
//     url: ['https://www.google.com/search?q=' + encodeURIComponent('sofa')],
//   }),
// );

export default config;
