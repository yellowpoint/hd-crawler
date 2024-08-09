import fs from 'fs';
import path from 'path';

import dayjs from 'dayjs';
import express from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.accessSync('./uploads');
    } catch (error) {
      fs.mkdirSync('./uploads');
    }
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // 防止文件名重复，使用日期+时间+随机数
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const newName = `${timestamp}-${Math.floor(Math.random() * 100000)}`;
    cb(null, newName);
  },
});
const upload = multer({ storage });

const routes = express.Router();

routes.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;
  res.send({
    code: 0,
    msg: '上传成功',
    data: {
      name: file.filename,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`,
    },
  });
});

export default routes;
