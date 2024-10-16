import aws_chromium from '@sparticuz/chromium';
import {
  createPlaywrightRouter,
  Configuration,
  PlaywrightCrawler,
  Dataset
} from 'crawlee';
import { readFile, writeFile } from 'fs/promises';
import { getPageHtmlBase, write, TempDir } from './utils.js';
import * as path from 'path';


let currentDepth = 0;
let pageCounter = 0;
let treeStructure = [];
let depthPageCounts = {};  // 新增: 用于跟踪每一层的页面数量

export const getRequestHandler = (config) => {
  let { getPage, type } = config;
  const router = createPlaywrightRouter();

  const saveData = async (props) => {
    const { request, page, log, isSub } = props;
    let getPageHtml = getPage || getPageHtmlBase;
    if (isSub) {
      getPageHtml = getPageHtmlBase;
      type = 'subPage';
    }
    const title = await page.title();
    const htmlRes = await getPageHtml(page, config?.selector, props);
    const html = htmlRes?.html ?? htmlRes;
    const subPages = htmlRes?.subPages;

    const url = request.loadedUrl;
    log.info(`${title}`, { url });
    const results = {
      url,
      title,
      html: JSON.stringify(html),
      children: [],
    };
    if (subPages) {
      results.subPages = JSON.stringify(subPages);
    }
    if (type) {
      results.type = type;
    }

    console.log(`Saving data: ${url}, depth: ${request.userData.depth}, parent: ${request.userData.parentUrl}`);

    // 使用 Dataset.pushData 保存数据
    await Dataset.pushData(results);

    // 如果配置中指定了返回树状数据,则构建树状结构
    if (config.returnTreeStructure) {
      addToTreeStructure(results, request.userData.depth, request.userData.parentUrl);
    }

    return subPages;
  };

  const addToTreeStructure = (data, depth, parentUrl) => {
    console.log(`Adding to tree: ${data.url}, depth: ${depth}, parent: ${parentUrl}`);
    if (depth === 0) {
      treeStructure.push(data);
    } else {
      let parent = findParent(treeStructure, parentUrl);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(data);
      } else {
        console.log(`Parent not found for ${data.url}, adding to root`);
        treeStructure.push(data);
      }
    }
  };

  const findParent = (nodes, url) => {
    for (let node of nodes) {
      if (node.url === url) return node;
      if (node.children) {
        let found = findParent(node.children, url);
        if (found) return found;
      }
    }
    return null;
  };

  router.addDefaultHandler(async (props) => {
    const { enqueueLinks, log, page, request, crawler } = props;
    pageCounter++;
    currentDepth = request.userData.depth || 0;

    // 更新当前深度的页面计数
    depthPageCounts[currentDepth] = (depthPageCounts[currentDepth] || 0) + 1;

    log.info(`Crawling: Page ${pageCounter} - URL: ${request.loadedUrl} - Depth: ${currentDepth}, Parent: ${request.userData.parentUrl}`);

    const subPages = await saveData(props);

    // 检查是否达到最大深度或当前层的最大页面数
    if (config.maxDepth !== undefined && currentDepth >= config.maxDepth) {
      log.info(`Reached max depth of ${config.maxDepth}. Stopping further crawling.`);
      return;
    }
    if (config.maxPagesPerDepth !== undefined && depthPageCounts[currentDepth] >= config.maxPagesPerDepth) {
      log.info(`Reached max pages (${config.maxPagesPerDepth}) for depth ${currentDepth}. Stopping further crawling at this depth.`);
      return;
    }

    if (subPages) {
      let urls = subPages?.map?.(({ url }) => url)?.filter(Boolean);

      urls = urls.map((url) => ({
        url: url,
        userData: {
          label: 'detail',
          depth: currentDepth + 1,
          parentUrl: request.loadedUrl,
        },
      }));
      console.log('urls', urls);
      await crawler.addRequests(urls);
    }

    if (config.match) {
      await enqueueLinks(
        {
          globs:
            typeof config.match === 'string' ? [config.match] : config.match,
          exclude:
            typeof config.exclude === 'string'
              ? [config.exclude]
              : (config.exclude ?? []),
          transformRequestFunction: (req) => {
            req.userData.depth = currentDepth + 1;
            req.userData.parentUrl = request.loadedUrl;
            console.log(`Enqueueing: ${req.url}, depth: ${req.userData.depth}, parent: ${req.userData.parentUrl}`);
            return req;
          },
        },
      );
    }
  });

  router.addHandler('detail', async (props) => {
    await saveData({ ...props, isSub: true });
  });
  return router;
};

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);
export const crawlerRun = async (config = {}) => {
  let { type = 'base' } = config;
  let typeConfig;
  if (type && type !== 'base') {
    type = type.toLowerCase();

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
    typeConfig = typeConfig(config);
  }
  if (typeConfig) {
    config = { ...config, ...typeConfig };
  }
  console.log('爬取任务开始', config);

  const crawler = new PlaywrightCrawler(
    {
      requestHandler: config?.requestHandler ?? getRequestHandler(config),
      maxRequestsPerCrawl: config.maxRequestsPerCrawl,
      maxConcurrency: config.maxConcurrency,
      headless: config.headless,
      launchContext: isDev ? undefined : {
        launchOptions: {
          executablePath: await aws_chromium.executablePath(),
          args: aws_chromium.args,
          headless: true,
        },
      },
    },
    new Configuration({
      purgeOnStart: true,
    }),
  );

  let startUrls = config.url;
  startUrls = typeof startUrls === 'string' ? [startUrls] : startUrls;
  if (!Array.isArray(startUrls) || startUrls.length === 0) {
    throw new Error('没有传入爬取的 url');
  }

  // 为起始URL添加深度信息
  startUrls = startUrls.map(url => ({
    url,
    userData: { depth: 0 }  // 改回0
  }));

  await crawler.run(startUrls);

  try {
    if (config.returnTreeStructure) {
      // 将树状结构写入临时目录中的文件
      const treeOutputFileName = path.join(TempDir, 'tree_output.json');
      await writeFile(treeOutputFileName, JSON.stringify(treeStructure, null, 2));
      console.log('树状结构已保存到:', treeOutputFileName);
      return treeStructure;
    }
    let result;
    const outputFileName = await write(config);
    result = await readFile(outputFileName, 'utf-8');
    result = JSON.parse(result);
    return result;

  } catch (error) {
    throw error;
  }

};
