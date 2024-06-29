import { readFile } from 'fs/promises';

import axios from 'axios';

import { crawlStart } from './lib/crawlerSetup.js';
import { write } from './lib/utils.js';
import { router } from './lib/wiki_routes.js';

export const defaultConfig = {
  url: ['https://en.wikipedia.org/wiki/Yellow'],
  match: ['https://en.wikipedia.org/**'],
  maxRequestsPerCrawl: 3,
  outputFileName: 'wiki.json',
};

export const crawlerWiki = async (req) => {
  let config = req.body;
  config = config?.url ? config : defaultConfig;
  console.log('config', config);

  const crawlConfig = {
    ...config,
    requestHandler: router,
  };

  await crawlStart(crawlConfig);
  const outputFileName = await write(config);
  console.log('outputFileName', outputFileName);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  // console.log('outputFileContent', outputFileContent);
  outputFileContent = JSON.parse(outputFileContent);
  const mainPage = outputFileContent[0];
  console.log('mainPage', mainPage.url);
  const res2 = await axios.post('http://localhost:4000/api/page', mainPage);
  return outputFileContent;
};
