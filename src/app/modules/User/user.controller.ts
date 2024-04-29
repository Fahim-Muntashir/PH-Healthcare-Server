import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
console.log(req.body);

        const result = await userServices.createAdmin(req)
        res.status(200).json({
        success: true,
        message:"Admin Created successfully",
        data:result
        })
})


const createDoctor = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  
          const result = await userServices.createDoctor(req)
          res.status(200).json({
          success: true,
          message:"Admin Created successfully",
          data:result
          })
  })
  
export const userController = {
  createAdmin,
  createDoctor
}