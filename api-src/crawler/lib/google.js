export const goolgeImg = async ({ page, imgUrl }) => {
  // await page.waitForNavigation();
  // await page.waitForSelector('.nDcEnd');
  console.log('开始搜索图片', imgUrl);
  await page.click('div[aria-label="Search by image"]');
  console.log('点击相机图标，打开图片上传界面');

  await page.evaluate((imgUrl) => {
    console.log('获取到图片地址为：', imgUrl);
    document.querySelector('.cB9M7').value = imgUrl;
    document.querySelector('.Qwbd3').click();
  }, imgUrl);
  console.log('上传图片完成');
  // todo 用这个没有的元素卡住，才能弹出来，page.click都不行额,
  // await page.waitForSelector('a[aria-label="Upload an image"]');
  await page.waitForTimeout(3000);
  console.log('等待结果页面加载并获取结果');

  // 等待结果页面加载并获取结果
  await page.waitForNavigation();
  console.log('获取并打印搜索结果链接');
  // 获取并打印搜索结果链接
  const results = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a.GZrdsf').forEach((link) => {
      const img = link.querySelector('img');
      links.push({
        label: link.getAttribute('aria-label'),
        link: link.href,
        img: img ? img.src : '',
      });
    });
    return links;
  });
  console.log('搜索结果:', results);

  return results;
};
