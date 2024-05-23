import { readFile } from 'fs/promises';

import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

import { defaultConfig } from './lib/config.js';
import { crawlStart } from './lib/core.js';
import { write } from './lib/utils.js';
import crawlStartPup from './puppeteer.js';

configDotenv();

const app = express();
const port = Number(process.env.API_PORT) || 4000;
const hostname = process.env.API_HOST || 'localhost';

app.use(cors());
app.use(express.json());

// 添加统一的/api路由
const api = express.Router();
app.use('/api', api);

api.post('/crawl', async (req, res) => {
  let config = req.body;
  config = config?.url ? config : defaultConfig;
  console.log('config', config);

  try {
    await crawlStart(config);
    const outputFileName = await write(config);
    console.log('outputFileName', outputFileName);
    const outputFileContent = await readFile(outputFileName, 'utf-8');
    // console.log('outputFileContent', outputFileContent);
    res.contentType('application/json');
    return res.send({ data: JSON.parse(outputFileContent), code: 0 });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error occurred during crawling', error });
  }
});
api.post('/pup', async (req, res) => {
  try {
    const result = await crawlStartPup();
    res.contentType('application/json');
    return res.send(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error occurred during crawling', error });
  }
});

app.listen(port, hostname, () => {
  console.log(`API server listening at http://${hostname}:${port}`);
});

export default app;
