import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import open from 'open';

const client_id =
  '12955740908-gr0nbhm6gfhmdeuti0h53pi1i4e78n9q.apps.googleusercontent.com';
const client_secret = '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';
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
    res.send('认证成功!请查看控制台以获取refresh_token。');
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
