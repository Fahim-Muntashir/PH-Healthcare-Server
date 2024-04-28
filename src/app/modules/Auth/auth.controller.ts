import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendHelpers";

const loginUser = catchAsync(async (req:Request, res:Response) => {
    const result = await AuthService.loginUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: "Logged In Successfully",
        data:result,
    }
    )
})

export const AuthController = {
    loginUser,
}