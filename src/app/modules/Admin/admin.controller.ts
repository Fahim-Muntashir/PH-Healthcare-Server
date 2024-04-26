import  { Request, Response } from 'express';
import { AdminService } from './admin.service';

const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
    const finalObj: Partial<T> = {};

    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }

    return finalObj;
};



const getAllFromDB = async (req: Request, res: Response) => {
    try {
    
        const filters=pick(req.query, ['name', 'email', 'searchTerm','contactNumber'])
    
    const result = await AdminService.getAllFromDB(filters);

    res.status(200).json({
        success:true,
        message: "Admin Data Fetched !",
        data: result
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