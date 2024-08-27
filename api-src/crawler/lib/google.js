export const goolgeImg = async ({ page, imgUrl }) => {
  // await page.waitForNavigation();
  // await page.waitForSelector('.nDcEnd');

  await page.click('div[aria-label="Search by image"]');
  await page.evaluate((imgUrl) => {
    console.log('获取到图片地址为：', imgUrl);
    document.querySelector('.cB9M7').value = imgUrl;
    document.querySelector('.Qwbd3').click();
  }, imgUrl);

  // todo 用这个没有的元素卡住，才能弹出来，page.click都不行额,
  // await page.waitForSelector('a[aria-label="Upload an image"]');
  await page.waitForTimeout(3000);

  // await page.click('.nDcEnd');
  // await page.waitForSelector('.cB9M7');
  // return;
  // 点击相机图标，打开图片上传界面
  // await page.click('.nDcEnd');
  // await page.click('div[aria-label="Search by image"]');
  // await page.waitForSelector('a[aria-label="Upload an image"]');

  // 等待结果页面加载并获取结果
  await page.waitForNavigation();

  // 获取并打印搜索结果链接
  const results = await page.evaluate(() => {
    const links = [];
    document
      .querySelectorAll('a.GZrdsf')
      .forEach((link) =>
        links.push({ label: link.getAttribute('aria-label'), link: link.href }),
      );
    return links;
  });
  console.log('搜索结果:', results);

  return results;
};
