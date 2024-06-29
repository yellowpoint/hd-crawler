export const getRelatedSearchesAndAlsoAsks = async (page, keyword) => {
  const people_also_ask = await page.evaluate(() => {
    const elementHandle = document.querySelectorAll('.related-question-pair');
    const text = Array.from(elementHandle).map((child) =>
      child.getAttribute('data-q'),
    );
    return text;
  });

  await page.click('textarea');
  await page.waitForSelector('#Alh6id');
  let presentation = await page.evaluate(async () => {
    const elementHandle = document.querySelectorAll(
      '#Alh6id li.PZPZlf .wM6W7d',
    );
    const text = Array.from(elementHandle).map((child) => child.textContent);
    return text;
  });
  // // 使用page.evaluate在页面上下文中执行滚动代码
  // await page.evaluate(() => {
  //   // 计算滚动的目标位置，这里是页面的总高度
  //   const totalHeight = document.body.scrollHeight;
  //   // 滚动到页面底部
  //   window.scrollTo(0, totalHeight);
  // });
  const related_searches = await page.evaluate(async () => {
    const elementHandle = document.querySelectorAll('#bres a');
    const text = Array.from(elementHandle).map((child) =>
      child.textContent.trim(),
    );
    return text;
  });

  return {
    people_also_ask,
    presentation,
    related_searches,
  };
};
