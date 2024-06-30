import express from 'express';

import google from './crawler/google.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
  res.send(`Reached home!`);
});

routes.use('/api/google', google);

export default routes;
