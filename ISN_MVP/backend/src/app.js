import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error.middleware.js';
import routes from './routes/index.js';

export function createApp(){
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({limit:'10mb'}));
  app.use(morgan('combined'));
  app.use('/api', routes);
  app.get('/health', (req,res)=>res.json({status:'ok'}));
  app.get('/version', (req,res)=>res.json({version:'v1.1-scaffold'}));
  app.use(errorMiddleware);
  return app;
}
export default createApp;
