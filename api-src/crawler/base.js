import { createPlaywrightRouter, Dataset, KeyValueStore, sleep } from 'crawlee';

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
