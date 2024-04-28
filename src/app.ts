import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import { UserRoutes } from './app/modules/User/user.route';
import { adminRoutes } from './app/modules/Admin/admin.route';
import router from './app/routes';

const app: Application = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
      Message:"Ph Healthcare Server"
  })  
})

app.use('/api/v1',router)

export default app;