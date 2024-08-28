import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

import { createPlaywrightRouter, Dataset, KeyValueStore } from 'crawlee';
import { configDotenv } from 'dotenv';
import { glob } from 'glob';
import { isWithinTokenLimit } from 'gpt-tokenizer';

configDotenv();
const isDev = process.env.NODE_ENV === 'development';
// '/tmp/storage 在vercel上用这个地址
export const TempDir = isDev ? './storage' : './storage';
console.log('TempDir', process.env.NODE_ENV, TempDir);
export function getPageHtmlBase(page, selector = 'body') {
  return page.evaluate((selector) => {
    // Check if the selector is an XPath
    if (selector.startsWith('/')) {
      const elements = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null,
      );
      let result = elements.iterateNext();
      return result ? result.textContent || '' : '';
    } else {
      // Handle as a CSS selector
      const el = document.querySelector(selector);
      return el?.innerText || '';
    }
  }, selector);
}

export function getPageHtml(page, selector = 'body') {
  return page.evaluate((selector) => {
    // Check if the selector is an XPath
    if (selector.startsWith('/')) {
      const elements = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null,
      );
      let result = elements.iterateNext();
      return result ? result.textContent || '' : '';
    } else {
      const contentSection = document.querySelector('.mw-body-content');
      const refLists = contentSection.querySelectorAll('.reflist');
      const navboxes = contentSection.querySelectorAll('.navbox');
      // 遍历所有的 .reflist 元素并将其内容置为空
      refLists.forEach((refList) => (refList.innerHTML = ''));
      // 遍历所有的 .navbox 元素并将其内容置为空
      navboxes.forEach((navbox) => (navbox.innerHTML = ''));
      // 返回 .mw-body-content 元素的 HTML 内容，但不包括 .reflist 和 .navbox
      return contentSection.innerText;

      // Handle as a CSS selector
      const el = document.querySelector(selector);

      return el?.innerText || '';
    }
  }, selector);
}

export async function write(config) {
  let nextFileNameString = '';
  const jsonFiles = await glob(TempDir + '/datasets/default/*.json', {
    absolute: true,
  });

  console.log(
    `${TempDir}/datasets/default/*.json,Found ${jsonFiles.length} files to combine...`,
  );

  let currentResults = [];
  let currentSize = 0;
  let fileCounter = 1;
  const maxBytes = config.maxFileSize
    ? config.maxFileSize * 1024 * 1024
    : Infinity;

  const getStringByteSize = (str) => Buffer.byteLength(str, 'utf-8');
  const outputFileName = config.outputFileName || 'output.json';
  const nextFileName = () =>
    path.join(
      TempDir,
      `${outputFileName.replace(/\.json$/, '')}-${fileCounter}.json`,
    );

  const writeBatchToFile = async () => {
    nextFileNameString = nextFileName();
    await writeFile(
      nextFileNameString,
      JSON.stringify(currentResults, null, 2),
    );
    console.log(
      `Wrote ${currentResults.length} items to ${nextFileNameString}`,
    );
    currentResults = [];
    currentSize = 0;
    fileCounter++;
  };

  let estimatedTokens = 0;

  const addContentOrSplit = async (data) => {
    const contentString = JSON.stringify(data);
    const tokenCount = isWithinTokenLimit(
      contentString,
      config.maxTokens || Infinity,
    );

    if (typeof tokenCount === 'number') {
      if (estimatedTokens + tokenCount > config.maxTokens) {
        // Only write the batch if it's not empty (something to write)
        if (currentResults.length > 0) {
          await writeBatchToFile();
        }
        // Since the addition of a single item exceeded the token limit, halve it.
        estimatedTokens = Math.floor(tokenCount / 2);
        currentResults.unshift(data);
      } else {
        currentResults.unshift(data);
        estimatedTokens += tokenCount;
      }
    }

    currentSize += getStringByteSize(contentString);
    if (currentSize > maxBytes) {
      await writeBatchToFile();
    }
  };

  // Iterate over each JSON file and process its contents.
  for (const file of jsonFiles) {
    const fileContent = await readFile(file, 'utf-8');
    const data = JSON.parse(fileContent);
    await addContentOrSplit(data);
  }

  // Check if any remaining data needs to be written to a file.
  if (currentResults.length > 0) {
    await writeBatchToFile();
  }

  return nextFileNameString;
}

export const savePageScreenshot = async (page) => {
  const screenshot = await page.screenshot({ fullPage: true });
  const url = page.url();
  const key = url
    .replace(/[/\\:=<>|?*\x00-\x1F%]/g, '_') // 过滤掉不能保存文件名的符号和%符号, 并且过滤掉等号
    .substring(0, 200)
    .replace(/_+/g, '_'); // 过滤掉多个下划线，保持最大长度200

  await KeyValueStore.setValue(key, screenshot, { contentType: 'image/png' });
};
