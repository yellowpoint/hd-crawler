// For more information, see https://crawlee.dev/
import chromium from '@sparticuz/chromium-min';
import { PuppeteerCrawler, Configuration } from 'crawlee';
import puppeteer from 'puppeteer-core';

import 'dotenv/config';

const isDev = process.env.NODE_ENV === 'development';

let launchContext = undefined;
if (!isDev) {
  // 远程执行包，主要用于 vercel,因为其运行环境需要用更小的浏览器包
  const remoteExecutablePath = '/www/wwwroot/hd-crawler/chromium-v119.0.2-pack';
  launchContext = {
    launcher: puppeteer,
    launchOptions: {
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
    },
  };
  console.log('launchContext', launchContext.launchOptions.executablePath);
  // 默认存储目录，vercel需要配置此变量到 tmp
  console.log('CRAWLEE_STORAGE_DIR', process.env.CRAWLEE_STORAGE_DIR);
}

export const crawlStart = async (config) => {
  let startUrls = config.url;
  startUrls = typeof startUrls === 'string' ? [startUrls] : startUrls;
  if (!Array.isArray(startUrls) || startUrls.length === 0) {
    throw new Error('没有传入爬取的 url');
  }
  console.log('爬取任务开始', startUrls);

  const crawler = new PuppeteerCrawler(
    {
      requestHandler: config.requestHandler,
      maxRequestsPerCrawl: config.maxRequestsPerCrawl, // 这个是最多发出多少个请求
      maxConcurrency: isDev ? undefined : config.maxConcurrency || 1, // 最大并发数
      headless: config.headless, // false 则显示浏览器
      launchContext: launchContext,
    },
    new Configuration({
      // 启动时清除所有之前会话的数据，加上这个就导致输出的json不全，不加的话新的请求又不发起爬取
      purgeOnStart: true,
      // persistStorage: false
    }),
  );

  // 使用 run 方法时，无法获取到 requestHandler 返回的值，所以需要使用 addRequests 和 run 的组合方式。
  await crawler.run(startUrls);

  console.log('爬取任务结束', startUrls);
};
