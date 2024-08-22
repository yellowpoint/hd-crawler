import { readFile } from 'fs/promises';

import axios from 'axios';
import { createPlaywrightRouter, Dataset, KeyValueStore } from 'crawlee';

import { crawlStart } from './crawlerSetup.js';
import { getPageHtmlBase, write } from './utils.js';

export const defaultConfig = {
  url: ['https://www.browsenodes.com/amazon.com/browseNodeLookup/468240.html'],
  match: ['https://www.browsenodes.com/amazon.com/**'],
  // maxRequestsPerCrawl: 3,
  outputFileName: 'Tools&HomeImprovement.json',
};

export const router = createPlaywrightRouter();

const saveData = async (props) => {
  const { request, page, log, pushData, urls } = props;

  const title = await page.title();
  const html = await getPageHtmlBase(page, defaultConfig?.selector);
  const url = request.loadedUrl;
  log.info(`${title}`, { url });
  if (!title || !html) return;
  const results = {
    url,
    title,
    content: html,
    urlsCount: urls?.length,
    // urls,
  };

  await pushData(results); // 有这个下面才有数据
  // await Dataset.exportToJSON('OUTPUT');
};

router.addDefaultHandler(async (props) => {
  const { enqueueLinks, log, page, crawler } = props;

  log.info(`开始获取`);

  // let urls = await getAhref(page);
  // console.log('urls', urls);
  await saveData({ ...props });

  // urls = urls.map((url) => ({
  //   url: url.href,
  //   userData: {
  //     label: 'detail',
  //   },
  // }));

  // await crawler.addRequests(urls);

  await enqueueLinks({
    globs: defaultConfig.match,
    // label: 'detail',
  });
});

router.addHandler('detail', async (props) => {
  const { request, page, log, pushData } = props;
  await saveData(props);
});

export const crawlerBase = async (req) => {
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
  outputFileContent = JSON.parse(outputFileContent);
  return outputFileContent;
};
