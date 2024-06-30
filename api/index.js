import express from 'express';

const app = express();

app.get('/api/index', (req, res) => res.send('Express on Vercel'));

app.listen(3000, () => console.log('Server ready on port 3000.'));

export default app;
