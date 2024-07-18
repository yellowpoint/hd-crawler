import express from 'express';

import crawlerRouter from './crawler/crawler.js';
import googleRouter from './crawler/google.js';
import crudRouter from './crud.js';
// import { crawlerWiki } from './crawler/wiki.js';

const routes = express.Router();

routes.use('/api/google', googleRouter);
routes.use('/api/crawler', crawlerRouter);
routes.use('/api/crud', crudRouter);

// api.post('/wiki', async (req, res) => {
//   const outputFileContent = await crawlerWiki(req);
//   res.json({
//     code: 0,
//     data: outputFileContent,
//   });
// });

export default routes;
