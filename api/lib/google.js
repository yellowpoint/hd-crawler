import { BasicCrawler, Dataset } from 'crawlee';

import { crawlStart } from './core.js';
import { savePageScreenshot } from './utils.js';

const googleCrawler = async (key) => {
  await crawlStart({
    url: ['https://www.google.com/search?q=' + encodeURIComponent(key)],
    async requestHandler({ request, sendRequest, log, page }) {
      const { url } = request;
      log.info(`Processing ${url}...`);

      // await savePageScreenshot(page);
      const people_also_ask = await page.evaluate(() => {
        const elementHandle = document.querySelectorAll(
          '.related-question-pair',
        );
        const text = Array.from(elementHandle).map((child) =>
          child.getAttribute('data-q'),
        );
        return text;
      });

      await page.click('textarea');
      // await page.waitForSelector('#Alh6id');
      const presentation = await page.evaluate(async () => {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        const elementHandle = document.querySelectorAll(
          '#Alh6id li.PZPZlf .wM6W7d',
        );
        const text = Array.from(elementHandle).map(
          (child) => child.textContent,
        );
        return text;
      });

      const related_searches = await page.evaluate(async () => {
        const elementHandle = document.querySelectorAll('#bres a');
        const text = Array.from(elementHandle).map((child) =>
          child.textContent.trim(),
        );
        return text;
      });

      // Store the HTML and URL to the default dataset.
      await Dataset.pushData({
        key,
        url,
        people_also_ask,
        presentation,
        related_searches,
        // html: body,
      });
    },
  });
};

export default googleCrawler;
