import { crawlerBase } from './lib/base.js';

const defaultConfig = {
  url: 'https://www.browsenodes.com/amazon.com/browseNodeLookup/2617942011.html',
  match: ['https://www.browsenodes.com/amazon.com/**'],
  maxRequestsPerCrawl: 3,
  outputFileName: 'Arts&Crafts&Sewing.json',
};

crawlerBase(defaultConfig);
