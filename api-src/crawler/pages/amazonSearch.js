

export const config = ({ url: keyword }) => ({
  url:
    'https://www.amazon.com/s?crid=3RY1E18CCW2MS&sprefix=so%27f%2Caps%2C469&ref=nb_sb_noss&k=' +
    encodeURIComponent(keyword),
  outputFileName: 'amazonSearch.json',
  // headless: false,
  selector: '[data-component-type="s-search-result"]',
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


