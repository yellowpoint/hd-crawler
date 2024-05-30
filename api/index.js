import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

import googleRouter from './crawler/google.js';
import { crawlerWiki } from './crawler/wiki.js';
import dbRouter from './db/testdb.js';
import 'express-async-errors';

configDotenv();

const app = express();
const port = Number(process.env.API_PORT) || 4000;
const hostname = process.env.API_HOST || 'localhost';

const errorMiddleware = (err, req, res, next) => {
  // 确定错误对象和状态码
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // 发送错误响应
  res.status(statusCode).json({
    success: false,
    message,
  });
};

app.use(cors());
app.use(express.json());

// 添加统一的/api路由
const api = express.Router();
app.use('/api', api);
app.use('/api', dbRouter);
app.use('/api/google', googleRouter);

api.post('/wiki', async (req, res) => {
  const outputFileContent = await crawlerWiki(req);
  res.json({
    code: 0,
    data: outputFileContent,
  });
});

app.use((err, req, res, next) => {
  // 确定错误对象和状态码
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // 发送错误响应
  res.status(statusCode).json({
    success: false,
    message,
  });
});

app.listen(port, hostname, () => {
  console.log(`API server listening at http://${hostname}:${port}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // 执行一些清理工作，然后退出进程
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 执行一些清理工作，然后退出进程
  // process.exit(1);
});

export default app;
