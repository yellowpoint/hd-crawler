// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, Configuration } from 'crawlee';
import { configDotenv } from 'dotenv';

configDotenv();
export const crawlStart = async (config) => {
  const startUrls = config.url;
  console.log('startUrls', startUrls);
  console.log(' process.env.NODE_ENV', process.env.NODE_ENV);

  const crawler = new PuppeteerCrawler(
    {
      // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
      requestHandler: config.requestHandler,

      // Comment this option to scrape the full website.
      maxRequestsPerCrawl: config.maxRequestsPerCrawl, // 这个是最多发出多少个请求
      // maxConcurrency: isDev ? undefined : 1, // 最大并发数
      // headless: false
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
