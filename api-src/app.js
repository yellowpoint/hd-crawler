import cors from 'cors';
import 'dotenv/config';
import express from 'express';
// import expressWs from 'express-ws';

import crawlerRouter from './crawler/crawler.js';
import googleRouter from './crawler/google.js';
import { crawlerWiki } from './crawler/wiki.js';

import 'express-async-errors';

const app = express();
// expressWs(app);

const port = Number(process.env.API_PORT) || 4000;
const hostname = process.env.API_HOST || 'localhost';

app.use(cors());
app.use(express.json());

// const api = express.Router();
// api.get('/test', async (req, res) => {
//   res.json({
//     code: 0,
//     data: 'test',
//   });
// });
// api.post('/wiki', async (req, res) => {
//   const outputFileContent = await crawlerWiki(req);
//   res.json({
//     code: 0,
//     data: outputFileContent,
//   });
// });

// app.use('/api', api);
// app.use('/api/google', googleRouter);
// app.use('/api/crawler', crawlerRouter);

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

// app.listen(port, hostname, () => {
//   console.log(`API server listening at http://${hostname}:${port}`);
// });

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

// const errorMiddleware = (err, req, res, next) => {
//   // 确定错误对象和状态码
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'An unexpected error occurred';

//   // 发送错误响应
//   res.status(statusCode).json({
//     success: false,
//     message,
//   });
// };
