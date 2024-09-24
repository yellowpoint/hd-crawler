import { Dataset } from 'crawlee';

export const config = ({ keyword, maxPages = 1 }) => ({
  url: `https://www.amazon.com/s?k=${keyword}&__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E7%BD%91%E7%AB%99&ref=nb_sb_noss`,
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
            let price = '';
            const priceElement = el.querySelector('.a-price .a-offscreen');
            if (priceElement) {
              const priceText = priceElement.textContent.trim();
              if (priceText.startsWith('$')) {
                price = priceText;
              } else {
                // 如果主要价格元素不包含价格，尝试其他可能的价格元素
                const alternatePriceElement = el.querySelector('.a-color-base');
                if (alternatePriceElement) {
                  const alternatePriceText = alternatePriceElement.textContent.trim();
                  if (alternatePriceText.startsWith('$')) {
                    price = alternatePriceText;
                  }
                }
              }
            }

            // 如果仍然没有找到有效价格，设置为空字符串或自定义消息
            if (!price) {
              price = '';
            } else {
              // 移除价格中的美元符号和逗号，保留数字和小数点
              price = price.replace(/[$,]/g, '');

              // 尝试将价格转换为浮点数
              const numericPrice = parseFloat(price);
              if (!isNaN(numericPrice)) {
                price = numericPrice;
              } else {
                price = '';
              }
            }

            const ratingText = el.querySelector('.a-icon-star-small .a-icon-alt')?.textContent.trim() || '';
            const rating = parseFloat(ratingText.split(' ')[0]) || '';

            const reviewCountText = el.querySelector('span[aria-label$="stars"]')?.nextElementSibling?.textContent.trim() || '';
            const reviewCount = parseInt(reviewCountText.replace(/[^0-9]/g, '')) || '';

            let sales = '';
            const salesElement = el.querySelector('.a-row.a-size-base.a-color-secondary .a-size-base.a-link-normal');
            if (salesElement) {
              const salesText = salesElement.textContent.trim();
              const salesMatch = salesText.match(/#([\d,]+) (?:in|Best Seller in) (.+)/);
              if (salesMatch) {
                const [, number, category] = salesMatch;
                sales = `#${number.replace(/,/g, '')} in ${category.trim()}`;
              }
            }

            // 如果没有找到销量信息，尝试获取"Best Seller"标签
            if (!sales) {
              const badgeElement = el.querySelector('.a-badge-text');
              if (badgeElement) {
                const badgeText = badgeElement.textContent.trim();
                if (badgeText.includes('Best Seller')) {
                  sales = badgeText;
                }
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
    await Dataset.pushData({ type: 'amazonSearch', keyword, lastPage: currentPage, listCount: allResults.length, list: allResults });

    log.info('所有结果:', allResults);
    return allResults;
  },
});


