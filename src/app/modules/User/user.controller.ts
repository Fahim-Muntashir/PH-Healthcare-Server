import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields, userSearcAbleFields } from "./user.constant";
import sendResponse from "../../../shared/sendHelpers";
import httpStatus from "http-status";

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
          message:"DOCTOR Created successfully",
          data:result
          })
  })
  
  const createPatient = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
    
            const result = await userServices.createPatient(req)
            res.status(200).json({
            success: true,
            message:"Patient Created successfully",
            data:result
            })
  })
    

  const getAllFromDB = catchAsync(async (req, res) => {
    
        const filters=pick(req.query, userFilterableFields)
          
              const options = pick(req.query, ['limit', 'page', 'sortBy','sortOrder'])
      
              console.log(options);
                 const result = await userServices.getAllFromDB(filters,options);
              
               sendResponse(res, {
                  statusCode: httpStatus.OK,
                  success: true,
                  message:"User Fetched Successfully",
                  meta: result.meta,
                 data: result.data,
              })
      
      })
      

const changeProfileStatus = catchAsync(async (req:Request, res:Response) => {

        const { id } = req.params;
        const result = await userServices.changeProfileStatus(id,req.body)

        sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message:"User Status Change Successfully",
               data: result,
            })
        
})

export const userController = {
  createAdmin,
        createDoctor, createPatient,
        getAllFromDB,
        changeProfileStatus
  
}