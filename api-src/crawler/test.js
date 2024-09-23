import { crawlerRun } from './base.js';


// const res = await crawlerRun({
//   url: 'https://www.baidu.com',
// });


const res = await crawlerRun({
  // url: 'https://www.google.com/search?q=' + encodeURIComponent('sofa'),
  keyword: 'sofa',
  type: 'googleSearchResult',
});

// const res = await crawlerRun({
//   keyword: 'sofa',
//   type: 'amazonSearch',
//   maxPages: 2,
// });
console.log('res', res);
