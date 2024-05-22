import { crawlStart } from './core.js'
import { defaultConfig } from './config.js'
import { write } from './utils.js';

await crawlStart(defaultConfig);
await write(defaultConfig);
