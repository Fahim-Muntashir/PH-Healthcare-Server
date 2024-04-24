import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  
    try {
        const result = await userServices.createAdmin(req.body)
        res.status(200).json({
        success: true,
        message:"Admin Created successfully",
        data:result
    })
    
  } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong",
            error:error
    })
  }  // console.log(req.body);
  
}

export const userController = {
    createAdmin
}