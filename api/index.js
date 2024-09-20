import app from '../api-src/app.js';
import router from '../api-src/router.js';

app.use('/', router);
app.get('/api/test', (req, res) => res.send('Express on Vercel'));

app.listen(4000, function () {
  console.log('Server started. Go to http://localhost:4000/');
});

export default app;
