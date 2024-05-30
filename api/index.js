import { readFile } from 'fs/promises';

import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

import { crawlerGoogle } from './crawler/google.js';
import { crawlerWiki } from './crawler/wiki.js';
import dbRouter from './db/testdb.js';

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

api.post('/wiki', async (req, res) => {
  try {
    const outputFileContent = await crawlerWiki(req);
    res.contentType('application/json');
    return res.send({ data: outputFileContent, code: 0 });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred during crawling',
      error: error.toString(),
    });
  }
});

api.post('/google', async (req, res) => {
  try {
    const outputFileContent = await crawlerGoogle(req);
    res.contentType('application/json');
    return res.send({ data: outputFileContent, code: 0 });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred during crawling',
      error: error.toString(),
    });
  }
});

app.listen(port, hostname, () => {
  console.log(`API server listening at http://${hostname}:${port}`);
});

export default app;
