import  { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { adminFilterFields } from './admin.constant';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendHelpers';
import httpStatus from 'http-status';




const getAllFromDB = async (req: Request, res: Response) => {
    try {
    
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
} catch (error:any) {
    res.status(500).json({
        success: false,
        message: error?.name || "Something went wrong",
        error:error
})
}
}



const getByIdFromDB = async (req: Request, res: Response) => { 
    const { id } =  req.params;
try {
    const result = await AdminService.getByIdFromDB(id);
    
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Fetched Successfully",
        data:result,
    })
 
}catch (error:any) {
    res.status(500).json({
        success: false,
        message: error?.name || "Something went wrong",
        error:error
})
}
}



// Update Into db

const updateIntoDB = async (req: Request, res: Response) => { 
    const { id } = req.params;
try {
    const result = await AdminService.updateIntoDB(id,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: " Admin Data Updated!",
        data: result,
    })
}catch (error:any) {
    res.status(500).json({
        success: false,
        message: error?.name || "Something went wrong",
        error:error
})
}
}

const deleteFromDB = async (req: Request, res: Response) => { 
    const { id } = req.params;
try {
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: " Admin Data Deleted!",
        data: result,
    })

}catch (error:any) {
    res.status(500).json({
        success: false,
        message: error?.name || "Something went wrong",
        error:error
})
}
}
const softDeleteFromDB = async (req: Request, res: Response) => { 
    const { id } = req.params;
try {
    const result = await AdminService.softDeleteFromDB(id);
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: " Admin Data soft Deleted!",
        data: result,
    })
  


}catch (error:any) {
    res.status(500).json({
        success: false,
        message: error?.name || "Something went wrong",
        error:error
})
}
}

export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}