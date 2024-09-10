import { readFile } from 'fs/promises';

import axios from 'axios';
import { createPlaywrightRouter, Dataset, KeyValueStore } from 'crawlee';

import { crawlStart } from '../run.js';
import { getPageHtmlWiki, write } from '../utils.js';

export const defaultConfig = {
  url: ['https://en.wikipedia.org/wiki/Yellow'],
  match: ['https://en.wikipedia.org/**'],
  maxRequestsPerCrawl: 3,
  outputFileName: 'wiki.json',
};

export const router = createPlaywrightRouter();

/**
 * 根据wiki链接特征，分析urls哪些是有效的内容的
 * @param {Array<{ href: string, title: string }>} pageLinks
 * @returns {Array<{ href: string, title: string }>} 有效的链接
 */
export const filterValidWikiLinks = (pageLinks) => {
  const validLinks = pageLinks.filter((link) => {
    const urlPattern = /^https:\/\/en\.wikipedia\.org\/.*$/;

    if (!urlPattern.test(link.href)) return false;
    const actionRegex =
      /action=(history|edit)|title=|Help:|Special:|Wikipedia:|Main_Page|Candle#|ISBN|Doi/;
    if (actionRegex.test(link.href)) return false;
    // 过滤掉切换语言的链接
    // if (link.href.includes('/wiki/')) return false;
    // 过滤掉没有标题的链接
    if (!link.title) return false;
    return true;
  });
  return validLinks;
};
const getAhref = async (page) => {
  const pageLinks = await page.$$eval(
    '.mw-body-content a:not(.reflist a):not(.navbox a)',
    (as) =>
      as
        .filter((a) => a.href.startsWith('http'))
        .map((a) => ({ href: a.href, title: a.textContent || '' })),
  );
  const validLinks = filterValidWikiLinks(pageLinks);
  // console.log('validLinks', validLinks);

  return validLinks;
};
const saveData = async (props) => {
  const { request, page, log, pushData, urls } = props;

  const title = await page.title();
  const html = await getPageHtmlWiki(page, defaultConfig?.selector);
  const url = request.loadedUrl;
  log.info(`${title}`, { url });
  if (!title || !html) return;
  const results = {
    url,
    title,
    content: html,
    urlsCount: urls?.length,
    // urls,
  };

  await pushData(results); // 有这个下面才有数据
  // await Dataset.exportToJSON('OUTPUT');

  // const screenshot = await page.screenshot();
  // const key = url.replace(/[:/]/g, '_');
  // // Save the screenshot to the default key-value store
  // await KeyValueStore.setValue(key, screenshot, { contentType: 'image/png' });
};

router.addDefaultHandler(async (props) => {
  const { enqueueLinks, log, page, crawler } = props;

  log.info(`开始获取`);

  let urls = await getAhref(page);
  // console.log('urls', urls);
  await saveData({ ...props, urls });

  urls = urls.map((url) => ({
    url: url.href,
    userData: {
      label: 'detail',
    },
  }));

  await crawler.addRequests(urls);

  // await enqueueLinks({
  //     globs: defaultConfig.match,
  //     label: 'detail',
  // });
});

router.addHandler('detail', async (props) => {
  const { request, page, log, pushData } = props;
  await saveData(props);
});

export const crawlerWiki = async (req) => {
  let config = req.body;
  config = config?.url ? config : defaultConfig;
  console.log('config', config);

  const crawlConfig = {
    ...config,
    requestHandler: router,
  };

  await crawlStart(crawlConfig);
  const outputFileName = await write(config);
  console.log('outputFileName', outputFileName);
  let outputFileContent = await readFile(outputFileName, 'utf-8');
  // console.log('outputFileContent', outputFileContent);
  outputFileContent = JSON.parse(outputFileContent);
  const mainPage = outputFileContent[0];
  console.log('mainPage', mainPage.url);
  const res2 = await axios.post('http://localhost:4000/api/page', mainPage);
  return outputFileContent;
};
