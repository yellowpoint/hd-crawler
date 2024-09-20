import express from 'express';

import crawlerRouter from './crawler/server.js';

const routes = express.Router();

routes.use('/api/crawler', crawlerRouter);

export default routes;
