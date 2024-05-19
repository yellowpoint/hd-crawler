// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, Configuration } from 'crawlee';
import { router } from './routes.js';
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium-min";
import { configDotenv } from "dotenv";
import { localExecutablePath, remoteExecutablePath } from '../api/puppeteer.js';
configDotenv();
const isDev = process.env.NODE_ENV === "development";

export const TempDir = isDev ? './storage' : '/tmp/storage';
export const crawlStart = async (config) => {
  const startUrls = config.url;
  console.log('startUrls', startUrls);


  // 运行环境
  const launchOptions = isDev
    ? {
      executablePath: localExecutablePath,
      userDataDir: TempDir
    }
    : {
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
      userDataDir: TempDir
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
    // 启动时清除所有之前会话的数据
    new Configuration({
      purgeOnStart: true,
      // persistStorage: false
    })
  );
  await crawler.run(startUrls);



  console.log('结束了', startUrls);
}


