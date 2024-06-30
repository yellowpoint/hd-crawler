import app from '../api-src/app.js/index.js';
import route from '../api-src/crawler/google.js';

app.use('/api/google', route);
export default app;
