import { defaultConfig } from './config.js';
import { crawlStart } from './core.js';
import { write } from './utils.js';

await crawlStart(defaultConfig);
await write(defaultConfig);
