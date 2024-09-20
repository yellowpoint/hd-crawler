import fs from 'fs';
import path from 'path';

import 'dotenv/config';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import open from 'open';

const client_id = process.env.GOOGLE_ADS_CLIENT_ID;
const client_secret = process.env.GOOGLE_ADS_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/oauth2callback';

const oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);

// 生成授权URL
const scopes = ['https://www.googleapis.com/auth/adwords'];
const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

const app = express();

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);

    // 将刷新令牌写入 .env 文件
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // 更新或添加 GOOGLE_ADS_REFRESH_TOKEN
    if (envContent.includes('GOOGLE_ADS_REFRESH_TOKEN=')) {
      envContent = envContent.replace(
        /GOOGLE_ADS_REFRESH_TOKEN=.*/,
        `GOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}`,
      );
    } else {
      envContent += `\nGOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}`;
    }

    fs.writeFileSync(envPath, envContent);

    res.send('认证成功!刷新令牌已写入 .env 文件。');
    process.exit(0);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send('获取令牌时出错');
  }
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
  console.log('正在打开授权页面...');
  open(url);
});
