import { sleep } from 'crawlee';

import { crawlerBase } from '../base.js';

const config = {
  url: [
    'https://www.amazon.com/-/zh/dp/B0BYWLBYK8/ref=sr_1_1?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&dib=eyJ2IjoiMSJ9.eegzr05zuvk6i0pH2UVHwd9EcWRGcMcBjV3NW-c952N5rs-ifunm4CXndNDPU4bsL-12QC0FUjlSVWt9nj_0JnNPjgLTva31h9nKWRtAMhgzYi2n5WzLSQmx61mNtS979Ez7lnTrTTSB4teEms8kvi0S4dKBt_i72qde-6oIkxQybZdk1QkSKC6yFNG5W5Wdu3zjNVODpSGg34OJnGnluImi888rNIg_dRueHogyZ-oJbj9fJrnqJoku4qgAf1tyoDZGmMpen4lqNX4OE3s9jBlHXVQr1RPFo1dgsCwC-MA.QtUUB-43JNDy_25Yztm6WyNn1Cy0GuGfYUSu3i61O0I&dib_tag=se&keywords=sofa&qid=1725874919&sr=8-1',
  ],
  maxRequestsPerCrawl: 3,
  outputFileName: 'amazonList.json',
  headless: false,
  getPage: async (page, selector = 'body') => {
    const res = await page.evaluate((selector) => {
      const results = document.querySelectorAll(
        '[data-component-type="s-search-result"]',
      );
      if (results.length) {
        return Array.from(results)
          .map((el) => el.innerText)
          .join('\n');
      }
      const el = document.querySelector(selector);
      return el?.innerText || el?.innerHtml || '';
    }, selector);
    await sleep(10000);
    return res;
  },
};

crawlerBase(config);
