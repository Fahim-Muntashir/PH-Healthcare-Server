import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendHelpers";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken,
        {
        secure: false,
        httpOnly: true
        }
    );
   
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: "Logged In Successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange:result.needpasswordChange,
        },
    }
    )
})
const refreshToken = catchAsync(async (req: Request, res: Response) => {
   
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);
   
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: "Logged In Successfully",
        data:result,

        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange:result.needpasswordChange,
        // },
    }
    )
})

export const AuthController = {
    loginUser,refreshToken
}