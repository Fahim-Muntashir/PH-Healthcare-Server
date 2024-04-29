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
        message: "Woow token Genarate Successfully",
        data:result,

        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange:result.needpasswordChange,
        // },
    }
    )
})


const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
   
    const user = req.user;

    const result = await AuthService.changePassword(user,req.body);
   
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: "Password Changed Successfully",
        data:result,
    }
    )
})


const forgotpassword =  catchAsync(async (req: Request, res: Response) => {
   
    const result = await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message: "Forgot Password Successfully",
        data:result,
    }
    )

})


export const AuthController = {
    loginUser,refreshToken,changePassword,forgotpassword
}