import { glob } from "glob";
import { readFile, writeFile } from "fs/promises";
import { isWithinTokenLimit } from "gpt-tokenizer";
import * as path from "path";
import { configDotenv } from "dotenv";

configDotenv();
const isDev = process.env.NODE_ENV === "development";
export const TempDir = isDev ? './storage' : '/tmp/storage';


export function getPageHtml(page, selector = "body") {
  return page.evaluate((selector) => {
    // Check if the selector is an XPath
    if (selector.startsWith("/")) {
      const elements = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let result = elements.iterateNext();
      return result ? result.textContent || "" : "";
    } else {





      const contentSection = document.querySelector('.mw-body-content');
      const refLists = contentSection.querySelectorAll('.reflist');
      const navboxes = contentSection.querySelectorAll('.navbox');
      // 遍历所有的 .reflist 元素并将其内容置为空
      refLists.forEach(refList => refList.innerHTML = '');
      // 遍历所有的 .navbox 元素并将其内容置为空
      navboxes.forEach(navbox => navbox.innerHTML = '');
      // 返回 .mw-body-content 元素的 HTML 内容，但不包括 .reflist 和 .navbox
      return contentSection.innerText;




      // Handle as a CSS selector
      const el = document.querySelector(selector);

      return el?.innerText || "";
    }
  }, selector);
}

export async function write(config) {
  let nextFileNameString = "";
  const jsonFiles = await glob(TempDir + "/datasets/default/*.json", {
    absolute: true,
  });

  console.log(`Found ${jsonFiles.length} files to combine...`);

  let currentResults = [];
  let currentSize = 0;
  let fileCounter = 1;
  const maxBytes = config.maxFileSize
    ? config.maxFileSize * 1024 * 1024
    : Infinity;

  const getStringByteSize = (str) => Buffer.byteLength(str, "utf-8");
  const outputFileName = config.outputFileName || 'output.json'
  const nextFileName = () =>
    path.join(TempDir, `${outputFileName.replace(/\.json$/, "")}-${fileCounter}.json`);

  const writeBatchToFile = async () => {
    nextFileNameString = nextFileName();
    await writeFile(
      nextFileNameString,
      JSON.stringify(currentResults, null, 2)
    );
    console.log(
      `Wrote ${currentResults.length} items to ${nextFileNameString}`
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
      config.maxTokens || Infinity
    );

    if (typeof tokenCount === "number") {
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
    const fileContent = await readFile(file, "utf-8");
    const data = JSON.parse(fileContent);
    await addContentOrSplit(data);
  }

  // Check if any remaining data needs to be written to a file.
  if (currentResults.length > 0) {
    await writeBatchToFile();
  }

  return nextFileNameString;
}


