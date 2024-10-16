import { crawlerRun } from './base.js';


// const res = await crawlerRun({
//   url: 'https://www.baidu.com',
// });


const res = await crawlerRun({
  keyword: 'sofa',
  type: 'googlesearchresult',
});

// const res = await crawlerRun({
//   keyword: 'sofa',
//   type: 'amazonproduct',
//   maxPages: 2,
// });


// const res = await crawlerRun({
//   url: 'https://www.thinkwithgoogle.com/',
//   maxRequestsPerCrawl: 5,
//   maxDepth: 2,
//   maxPagesPerDepth: 2,
//   returnTreeStructure: true,
//   match: 'https://www.thinkwithgoogle.com/**',
//   exclude: ['https://www.thinkwithgoogle.com/intl/**', 'https://www.thinkwithgoogle.com/_qs/**'],
// });

// console.log('res', res);
