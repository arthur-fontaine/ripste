import { Hono } from 'hono';
import { pingRouter } from './routers/ping/ping-router';

export const app = new Hono()
  .route('/ping', pingRouter);
