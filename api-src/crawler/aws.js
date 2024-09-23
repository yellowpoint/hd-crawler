import { crawlerRun } from './base.js';

export const handler = async (req) => {
  console.log('handler参数：', req);
  try {
    const res = await crawlerRun(req);
    // 返回成功结果
    return {
      statusCode: 200,
      body: res,
    };
  } catch (error) {
    console.error('爬取过程中发生错误:', error);

    // 返回错误结果
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '爬取失败', error: error.message }),
    };
  }
};
