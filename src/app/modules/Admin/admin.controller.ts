import  { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { adminFilterFields } from './admin.constant';
import pick from '../../../shared/pick';


const getAllFromDB = async (req: Request, res: Response) => {
    try {
    
  const filters=pick(req.query, adminFilterFields)
    
        const options = pick(req.query, ['limit', 'page', 'sortBy','sortOrder'])
        

        console.log(options);

    const result = await AdminService.getAllFromDB(filters,options);

    res.status(200).json({
        success:true,
        message: "Admin Data Fetched !",
        data: result.data,
        meta:result.meta,
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
    res.status(200).json({
        success:true,
        message: "Single Admin Data Fetched",
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



// Update Into db

const updateIntoDB = async (req: Request, res: Response) => { 
    const { id } = req.params;
try {
    const result = await AdminService.updateIntoDB(id,req.body);
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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

export const AdminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}