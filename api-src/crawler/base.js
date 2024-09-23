import aws_chromium from '@sparticuz/chromium';
import {
  createPlaywrightRouter,
  Configuration,
  PlaywrightCrawler,
} from 'crawlee';

import { getPageHtmlBase } from './utils.js';

let pageCounter = 0;
export const getRequestHandler = (config) => {
  let { getPage, type } = config;
  const router = createPlaywrightRouter();

  const saveData = async (props) => {
    const { request, page, log, pushData, isSub } = props;
    let getPageHtml = getPage || getPageHtmlBase;
    if (isSub) {
      getPageHtml = getPageHtmlBase;
      type = 'subPage';
    }
    const title = await page.title();
    // 可能返回字符串或对象
    const htmlRes = await getPageHtml(page, config?.selector, props);
    const html = htmlRes?.html ?? htmlRes;
    const subPages = htmlRes?.subPages;

    const url = request.loadedUrl;
    log.info(`${title}`, { url });
    // if (!title ) return;
    const results = {
      url,
      title,
      html: JSON.stringify(html),
    };
    if (subPages) {
      results.subPages = JSON.stringify(subPages);
    }
    if (type) {
      results.type = type;
    }

    await pushData(results); // 有这个下面才有数据
    // await Dataset.exportToJSON('OUTPUT');

    return subPages;
  };

  router.addDefaultHandler(async (props) => {
    const { enqueueLinks, log, page, request, crawler } = props;
    pageCounter++;
    log.info(`Crawling: Page ${pageCounter} - URL: ${request.loadedUrl}...`);
    const subPages = await saveData(props);
    if (subPages) {
      let urls = subPages?.map?.(({ url }) => url)?.filter(Boolean);

      urls = urls.map((url) => ({
        url: url,
        userData: {
          label: 'detail',
        },
      }));
      console.log('urls', urls);
      await crawler.addRequests(urls);
      // await enqueueLinks({
      //   urls,
      //   globs
      // });
    }
    if (config.match) {
      // 这个就是自动继续爬取a标签，匹配与过滤
      await enqueueLinks(
        {
          globs:
            typeof config.match === 'string' ? [config.match] : config.match,
          exclude:
            typeof config.exclude === 'string'
              ? [config.exclude]
              : (config.exclude ?? []),
        },
        // label: 'detail',
      );
    }
  });
  // 处理上面的label
  router.addHandler('detail', async (props) => {
    await saveData({ ...props, isSub: true });
  });
  return router;
};

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);
export const crawlerRun = async (req) => {
  let config = req?.queryStringParameters ?? req;
  let startUrls = config.url;
  startUrls = typeof startUrls === 'string' ? [startUrls] : startUrls;
  if (!Array.isArray(startUrls) || startUrls.length === 0) {
    throw new Error('没有传入爬取的 url');
  }
  const { type, keyword, url } = config;
  let typeConfig;
  if (type) {
    const typePath = `./pages/${type}.js`;
    console.log('typePath', typePath);
    try {
      typeConfig = (await import(typePath)).config;
      console.log(typePath + ' 获取成功');
    } catch (error) {
      throw new Error("type doesn't exist:" + typePath);
    }
  }
  if (typeof typeConfig === 'function') {
    typeConfig = typeConfig(keyword ?? { url });
  }
  if (typeConfig) {
    config = { ...config, ...typeConfig };
  }

  console.log('爬取任务开始', startUrls);
  const crawler = new PlaywrightCrawler(
    {
      requestHandler: getRequestHandler(config),
      launchContext: isDev?undefined:{
        launchOptions: {
          executablePath: await aws_chromium.executablePath(),
          args: aws_chromium.args,
          headless: true,
        },
      },
    },
    new Configuration({
      persistStorage: false,
    }),
  );

  await crawler.run(startUrls);
  return crawler.getData();
};
