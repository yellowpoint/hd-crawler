import express from 'express';

import promptRouter from './ai/prompt.js';
import googleRouter from './crawler/pages/google.js';
import crawlerRouter from './crawler/server.js';
import crudRouter from './crud.js';
import keywordPlannerApi from './keywordPlanner/server.js';
import uploadRouter from './upload.js';

const routes = express.Router();

routes.use('/api/google', googleRouter);
routes.use('/api/crawler', crawlerRouter);
routes.use('/api/crud', crudRouter);
routes.use('/api/prompt', promptRouter);
routes.use('/api/gkp', keywordPlannerApi);

routes.use('/api/upload', uploadRouter);
routes.use('/api/uploads/', express.static('./uploads/'));

export default routes;
