import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    console.log(req.body);
    const result = await userServices.createAdmin(req.body)
    res.send(result)
}

export const userController = {
    createAdmin
}