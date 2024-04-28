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

export const AdminController = {
    getAllFromDB
}