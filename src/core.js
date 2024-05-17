// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, Configuration } from 'crawlee';
import { router } from './routes.js';
// import aws_chromium from '@sparticuz/chromium';

export const crawlStart = async (config) => {
  const startUrls = config.url;
  console.log('startUrls', startUrls);
  // const launchOptions = process.env.NODE_ENV === 'production'
  //   ? {
  //     args: aws_chromium.args,
  //     executablePath: await aws_chromium.executablePath(),
  //     headless: aws_chromium.headless,
  //   }
  //   : undefined
  const crawler = new PlaywrightCrawler({

    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,

    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: config.maxRequestsPerCrawl,
    // headless: false
    // launchContext: {
    //   launchOptions
    // }
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

