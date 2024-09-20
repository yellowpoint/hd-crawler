import aws_chromium from '@sparticuz/chromium';
import { Configuration, PlaywrightCrawler } from 'crawlee';

import { getRequestHandler } from './base.js';

export const handler = async (req) => {
  console.log('handler参数：', req);
  try {
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
        typeConfig = (await import(typePath)).default;
        console.log(typePath + ' 获取成功');
      } catch (error) {
        throw new Error("type doesn't exist:" + type);
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
        launchContext: {
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

    // 返回成功结果
    return {
      statusCode: 200,
      body: await crawler.getData(),
    };
  } catch (error) {
    console.error('爬取过程中发生错误:', error);

    // 返回错误结果
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '爬取失败', error: error.message }),
    };
  }
};
