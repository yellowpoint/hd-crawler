import app from './app.js';
import router from './router.js';

app.use('/', router);

app.listen(4000, function () {
  console.log('Server started. Go to http://localhost:4000/');
});
