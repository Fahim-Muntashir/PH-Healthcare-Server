import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
const router = express.Router();


const auth = (...roles:string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

try {
    const token = req.headers.authorization
    if (!token) {
        throw new Error("You Are Not Authenticated !");

    }

            const verfiedUser=jwtHelpers.verifyToken(token,config.jwt.jwt_secret as Secret);
    
    console.log(verfiedUser); 
    if (roles.length && !roles.includes(verfiedUser.role)) {
        throw new Error("You Are Not Authenticated !");
    }
    next()

}
        
        
        
    catch (error) {
            console.log(error);
        }
    }
}


router.post('/',auth("ADMIN","SUPER_ADMIN"),userController.createAdmin);

export const UserRoutes= router;