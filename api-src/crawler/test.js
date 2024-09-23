import { crawlerRun } from './base.js';

// const res = await crawlerRun({
//   url: 'https://www.baidu.com',
// });


const res = await crawlerRun({
  url: 'https://www.google.com/search?q=' + encodeURIComponent('sofa'),
  type: 'googleTop10',
});

console.log('res', res);
