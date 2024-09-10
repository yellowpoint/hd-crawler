import { sleep } from 'crawlee';

import { crawlerBase } from '../base.js';

const config = {
  url: ['https://www.tmbbs.com/forum-xinwenbaoliao-1.html'],
  outputFileName: 'tianmen.json',
  selector: '.xst',
};

crawlerBase(config);
