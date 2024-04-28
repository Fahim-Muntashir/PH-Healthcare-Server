import  { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdminService } from './admin.service';
import { adminFilterFields } from './admin.constant';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendHelpers';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';




const getAllFromDB = catchAsync(async (req, res) => {
    
  const filters=pick(req.query, adminFilterFields)
    
        const options = pick(req.query, ['limit', 'page', 'sortBy','sortOrder'])

        console.log(options);
           const result = await AdminService.getAllFromDB(filters,options);
        
         sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message:"Admin Fetched Successfully",
            meta: result.meta,
           data: result.data,
        })

})



const getByIdFromDB = catchAsync(async (req: Request, res: Response) => { 
    const { id } =  req.params;
    const result = await AdminService.getByIdFromDB(id);
    
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Fetched Successfully",
        data:result,
    })
 

})



// Update Into db

const updateIntoDB =catchAsync( async (req: Request, res: Response) => { 
    const { id } = req.params;
    const result = await AdminService.updateIntoDB(id,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: " Admin Data Updated!",
        data: result,
    })

})

const deleteFromDB = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await AdminService.deleteFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: " Admin Data Deleted!",
            data: result,
        })
    
    }
)
const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.softDeleteFromDB(id);
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Admin Data soft Deleted!",
        data: result,
    })
} 
)
export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}