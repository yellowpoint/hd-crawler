// 引入依赖
import chromium from '@sparticuz/chromium-min';
import { configDotenv } from 'dotenv';
import puppeteer from 'puppeteer-core';

configDotenv();
// 本地 Chrome 执行包路径
export const localExecutablePath =
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
// 远程执行包
export const remoteExecutablePath =
  'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar';

// 运行环境
const isDev = process.env.NODE_ENV === 'development';
console.log('localExecutablePath', isDev);

async function crawlStartPup() {
  let browser = null;
  console.log('crawlStartPup', isDev);
  try {
    // 启动
    browser = await puppeteer.launch({
      args: isDev ? [] : chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: isDev
        ? localExecutablePath
        : await chromium.executablePath(remoteExecutablePath),
      headless: chromium.headless,
    });

    // 打开页面
    const page = await browser.newPage();
    // 等待页面资源加载完毕
    await page.goto('https://hehehai.cn', {
      waitUntil: 'networkidle0',
      timeout: 100000,
    });
    // 打印页面标题
    const title = await page.title();
    console.log('page title', title);
    return {
      title,
    };
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  } finally {
    // 释放资源
    await browser.close();
  }
}
export default crawlStartPup;
