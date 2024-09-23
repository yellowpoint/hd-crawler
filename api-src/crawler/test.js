import { crawlerRun } from './base.js';


// const res = await crawlerRun({
//   url: 'https://www.baidu.com',
// });


// const res = await crawlerRun({
//   // url: 'https://www.google.com/search?q=' + encodeURIComponent('sofa'),
//   keyword: 'sofa',
//   type: 'googleTop10',
// });

const res = await crawlerRun({
  keyword: 'sofa',
  type: 'amazonSearch',
});
console.log('res', res);
