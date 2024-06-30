import express from 'express';

import crawlerRouter from './crawler/crawler.js';
import googleRouter from './crawler/google.js';
// import { crawlerWiki } from './crawler/wiki.js';

const routes = express.Router();

routes.use('/api/google', googleRouter);
routes.use('/api/crawler', crawlerRouter);

export default routes;
