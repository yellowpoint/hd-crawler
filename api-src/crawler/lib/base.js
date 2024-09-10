import { readFile } from 'fs/promises';

import { createPlaywrightRouter, Dataset, KeyValueStore, sleep } from 'crawlee';

import { crawlStart } from './crawlerSetup.js';
import { getPageHtmlBase, write } from './utils.js';

let pageCounter = 0;
const getRequestHandler = (config) => {
  const { getPage } = config;
  const getPageHtml = getPage || getPageHtmlBase;
  const router = createPlaywrightRouter();

  const saveData = async (props) => {
    const { request, page, log, pushData } = props;

    const title = await page.title();
    const html = await getPageHtml(page, config?.selector);

    const url = request.loadedUrl;
    log.info(`${title}`, { url });
    // if (!title ) return;
    const results = {
      url,
      title,
      html,
    };

    await pushData(results); // 有这个下面才有数据
    // await Dataset.exportToJSON('OUTPUT');
  };

  router.addDefaultHandler(async (props) => {
    const { enqueueLinks, log, page, request } = props;
    pageCounter++;
    log.info(`Crawling: Page ${pageCounter} - URL: ${request.loadedUrl}...`);
    await saveData(props);

    if (config.match) {
      // 这个就是自动继续爬取a标签，匹配与过滤
      await enqueueLinks(
        {
          globs:
            typeof config.match === 'string' ? [config.match] : config.match,
          exclude:
            typeof config.exclude === 'string'
              ? [config.exclude]
              : config.exclude ?? [],
        },
        // label: 'detail',
      );
    }
  });
  // 处理上面的label
  // router.addHandler('detail', async (props) => {
  //   await saveData(props);
  // });
  return router;
};

export const crawlerBase = async (config) => {
  const requestHandler = getRequestHandler(config);
  const crawlConfig = {
    ...config,
    requestHandler,
  };
  await crawlStart(crawlConfig);
  const outputFileName = await write(config);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  outputFileContent = JSON.parse(outputFileContent);
  return outputFileContent;
};
