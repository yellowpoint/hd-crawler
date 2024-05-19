// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, Configuration } from 'crawlee';
import { router } from './routes.js';
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium-min";
import { configDotenv } from "dotenv";
configDotenv();
export const crawlStart = async (config) => {
  const startUrls = config.url;
  console.log('startUrls', startUrls);
  const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar";

  // 运行环境
  const isDev = process.env.NODE_ENV === "development";
  const launchOptions = isDev
    ? undefined
    : {
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true
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

