import express from 'express';

import promptRouter from './ai/prompt.js';
import crawlerBaseRouter from './crawler/api.js';
import crawlerRouter from './crawler/crawler.js';
import googleRouter from './crawler/google.js';
import crudRouter from './crud.js';
import uploadRouter from './upload.js';

const routes = express.Router();

routes.use('/api/google', googleRouter);
routes.use('/api/crawler', crawlerRouter);
routes.use('/api/crawler', crawlerBaseRouter);
routes.use('/api/crud', crudRouter);
routes.use('/api/prompt', promptRouter);
routes.use('/api/upload', uploadRouter);
routes.use('/api/uploads/', express.static('./uploads/'));

export default routes;
