import { readFile } from 'fs/promises';

import axios from 'axios';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

import { defaultConfig } from './lib/config.js';
import { crawlStart } from './lib/core.js';
import { write } from './lib/utils.js';
import crawlStartPup from './puppeteer.js';
import dbRouter from './testdb.js';

configDotenv();

const app = express();
const port = Number(process.env.API_PORT) || 4000;
const hostname = process.env.API_HOST || 'localhost';

app.use(cors());
app.use(express.json());

// 添加统一的/api路由
const api = express.Router();
app.use('/api', api);
app.use('/api', dbRouter);

api.post('/crawl', async (req, res) => {
  let config = req.body;
  config = config?.url ? config : defaultConfig;
  console.log('config', config);

  try {
    await crawlStart(config);
    const outputFileName = await write(config);
    console.log('outputFileName', outputFileName);
    let outputFileContent = await readFile(outputFileName, 'utf-8');
    // console.log('outputFileContent', outputFileContent);
    outputFileContent = JSON.parse(outputFileContent);
    const mainPage = outputFileContent[0];
    console.log('mainPage', mainPage.url);
    const res2 = await axios.post('http://localhost:4000/api/page', mainPage);
    console.log('res2');
    res.contentType('application/json');
    return res.send({ data: outputFileContent, code: 0 });
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
