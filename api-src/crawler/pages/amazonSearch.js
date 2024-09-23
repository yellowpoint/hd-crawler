

export const config = ({keyword}) => ({
  url: `https://www.amazon.com/s?k=${keyword}&__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&ref=nb_sb_noss`,
  // outputFileName: 'amazonSearch.json',
  // headless: false,
  // selector: '[data-component-type="s-search-result"]',
  // getPage: async (page, selector = 'body') => {
  //   const res = await page.evaluate((selector) => {
  //     const results = document.querySelectorAll(
  //       '[data-component-type="s-search-result"]',
  //     );
  //     if (results.length) {
  //       return Array.from(results).map((el) => el.innerText);
  //     }
  //     const el = document.querySelector(selector);
  //     return el?.innerText || el?.innerHtml || '';
  //   }, selector);
  //   // await sleep(10000);
  //   return res;
  // },
});


