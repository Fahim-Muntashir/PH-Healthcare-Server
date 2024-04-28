import express, { Application, NextFunction, Request, Response, response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middleware/gloabalErrorHandelr';
import httpStatus from 'http-status';

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

app.use((req: Request, res: Response, next: NextFunction)=> {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Api Not Found',
    error: {
      path: req.originalUrl,
      message:"Your Url Not Found"
    }
  })
})

app.use(globalErrorHandler);



export default app;