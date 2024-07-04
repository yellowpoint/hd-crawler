// For more information, see https://crawlee.dev/
import chromium from '@sparticuz/chromium-min';
import { PuppeteerCrawler, Configuration, PlaywrightCrawler } from 'crawlee';
import { configDotenv } from 'dotenv';
import puppeteer from 'puppeteer-core';
// 本地 Chrome 执行包路径
export const localExecutablePath =
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
// 远程执行包
export const remoteExecutablePath =
  'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar';

configDotenv();
const isDev = process.env.NODE_ENV === 'development';

export const crawlStart = async (config) => {
  // console.log('CRAWLEE_STORAGE_DIR', process.env.CRAWLEE_STORAGE_DIR);

  const startUrls = config.url;
  console.log('startUrls', startUrls);

  // 运行环境
  const launchOptions = isDev
    ? {
        executablePath: localExecutablePath,
      }
    : {
        args: chromium.args,
        executablePath: await chromium.executablePath(remoteExecutablePath),
        headless: true,
      };
  // console.log('launchOptions', launchOptions);
  const crawler = new PuppeteerCrawler(
    {
      // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
      requestHandler: config.requestHandler,

      // Comment this option to scrape the full website.
      maxRequestsPerCrawl: config.maxRequestsPerCrawl,
      // headless: false
      launchContext: {
        launcher: puppeteer,
        launchOptions,
      },
    },
    new Configuration({
      // 启动时清除所有之前会话的数据，加上这个就导致输出的json不全，不加的话新的请求又不发起爬取
      purgeOnStart: true,
      // persistStorage: false
    }),
  );

  // 使用 run 方法时，无法获取到 requestHandler 返回的值，所以需要使用 addRequests 和 run 的组合方式。
  await crawler.addRequests(startUrls);
  const res = await crawler.run();

  console.log('结束了', startUrls);
};
