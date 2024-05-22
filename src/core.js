// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, Configuration, PlaywrightCrawler } from 'crawlee';
import { router } from './routes.js';
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium-min";
import { configDotenv } from "dotenv";

import { localExecutablePath, remoteExecutablePath } from '../api/puppeteer.js';
configDotenv();
const isDev = process.env.NODE_ENV === "development";

export const crawlStart = async (config) => {
  console.log('CRAWLEE_STORAGE_DIR', process.env.CRAWLEE_STORAGE_DIR);


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
    }
  console.log('launchOptions', launchOptions);
  const crawler = new PuppeteerCrawler({

    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,

    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: config.maxRequestsPerCrawl,
    // headless: false
    launchContext: {
      launcher: puppeteer,
      launchOptions
    }
  },
    new Configuration({
      // 启动时清除所有之前会话的数据，加上这个就导致输出的json不全，不加的话新的请求又不发起爬取
      purgeOnStart: true,
      // persistStorage: false
    })
  );


  await crawler.run(startUrls);


  console.log('结束了', startUrls);
}


