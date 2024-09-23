import { Dataset } from 'crawlee';

export const config = ({ keyword, maxPages = 5 }) => ({
  url: `https://www.amazon.com/s?k=${keyword}&__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&ref=nb_sb_noss`,
  // exportCSV: true,
  requestHandler: async ({ page, request, enqueueLinks, log }) => {
    let allResults = [];
    let currentPage = 1;

    while (currentPage <= maxPages) {
      log.info(`正在处理第 ${currentPage} 页`);

      await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 30000 });

      const pageTitle = await page.title();
      log.info(`页面标题: ${pageTitle}`);

      const pageResults = await page.evaluate(() => {
        const results = document.querySelectorAll('[data-component-type="s-search-result"]');
        console.log(`找到 ${results.length} 个搜索结果`);
        if (results.length) {
          return Array.from(results).map(el => {
            const title = el.querySelector('h2')?.textContent.trim() || '';
            const price = el.querySelector('.a-offscreen')?.textContent.trim() || '';
            const rating = el.querySelector('.a-icon-star-small .a-icon-alt')?.textContent.trim() || '';
            const reviewCount = el.querySelector('.a-size-base.s-underline-text')?.textContent.trim() || '';

            let sales = '';
            const badgeElement = el.querySelector('.a-badge-text');
            if (badgeElement) {
              const badgeText = badgeElement.textContent.trim();
              if (badgeText.includes('Best Seller')) {
                sales = badgeText;
              }
            }

            return {
              title,
              price,
              rating,
              reviewCount,
              sales
            };
          });
        } else {
          console.log('没有找到搜索结果，返回整个 body 内容');
          return [{ error: document.body.innerText }];
        }
      });

      log.info(`第 ${currentPage} 页结果数量: ${pageResults.length}`);

      // 使用Dataset API存储数据

      // 同时将结果添加到allResults数组
      allResults = allResults.concat(pageResults);

      const hasNextPage = await page.evaluate(() => {
        const nextButton = document.querySelector('.s-pagination-next:not(.s-pagination-disabled)');
        return !!nextButton;
      });

      if (!hasNextPage || currentPage >= maxPages) {
        break;
      }

      await page.click('.s-pagination-next');
      currentPage++;
    }
    await Dataset.pushData({ type: 'amazonSearch', keyword, lastPage: currentPage,listCount: allResults.length, list: allResults });

    log.info('所有结果:', allResults);
    return allResults;
  },
});


