export const goolgeImg = async (page) => {
  // await page.goto('https://images.google.com');

  // 点击相机图标，打开图片上传界面
  await page.click('div[aria-label="Search by image"]');

  // 选择“上传图片”选项
  await page.waitForSelector('a[aria-label="Upload an image"]');
  await page.click('.cB9M7');
  // 输入图片链接，并回车
  await page.type(
    'input[aria-label="Paste image URL"]',
    'https://hehehai.cn/logo.png',
    { delay: 100 },
  );
  await page.click('input[aria-label="Search by image"]');
  // 上传图片
  const filePath = '/public/imgs/logo.png'; // 这里替换为你的图片路径
  const input = await page.$('input[type="file"]');
  await input.uploadFile(filePath);

  // 等待结果页面加载并获取结果
  await page.waitForNavigation();

  // 获取并打印搜索结果链接
  const results = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('.g a').forEach((link) => links.push(link.href));
    return links;
  });
  console.log('搜索结果:', results);

  return results;
};
