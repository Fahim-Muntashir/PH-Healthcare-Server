import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiErrors";
import httpStatus from "http-status";

const auth = (...roles:string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

try {
    const token = req.headers.authorization
    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED,"You Are Not Authenticated !");
    }
            const verfiedUser=jwtHelpers.verifyToken(token,config.jwt.jwt_secret as Secret);
    
    console.log(verfiedUser); 
    if (roles.length && !roles.includes(verfiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN,"FORBIDDEN !");
    }
    next()
}
    catch (error) {
            console.log(error);
        }
    }
}
export default auth;