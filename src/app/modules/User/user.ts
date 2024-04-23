import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req:Request,res:Response) => {
    res.send({
        message:"Router Is Working Perpesctly",
    })
})

export const UserRoutes= router;