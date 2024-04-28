import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middleware/gloabalErrorHandelr';

const app: Application = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
      Message:"Ph Healthcare Server"
  })  
})

app.use('/api/v1', router);

app.use(globalErrorHandler);



export default app;