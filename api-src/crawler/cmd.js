import { crawlerBase } from './lib/base.js';

const config = {
  url: 'https://www.browsenodes.com/amazon.com/browseNodeLookup/2617942011.html',
  match: ['https://www.browsenodes.com/amazon.com/**'],
  maxRequestsPerCrawl: 3,
  outputFileName: 'Arts&Crafts&Sewing.json',
  getPage: (page, selector = 'body') => {
    return page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el?.innerText || '';
    }, selector);
  },
};

crawlerBase(config);
