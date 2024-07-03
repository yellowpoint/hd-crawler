import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import expressWs from 'express-ws';

import 'express-async-errors';

const app = express();
expressWs(app);

app.use(cors());
app.use(express.json());

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
