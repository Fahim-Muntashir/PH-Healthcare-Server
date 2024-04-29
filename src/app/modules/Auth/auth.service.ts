import prisma from "../../../shared/prisma"
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./sendEmail";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const loginUser = async (payload:{email:string,password:string}) => {
    
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status:UserStatus.ACTIVE,
        }
    })
    

    const isCorrectPassword:boolean = await bcrypt.compare(payload.password, userData.password);


    if (!isCorrectPassword) { 
        throw new Error("Password incorrect!");
    }

    const accessToken = jwtHelpers.genarateToken({
        email: userData.email,
        role:userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
    )

const refreshToken = jwtHelpers.genarateToken({
    email: userData.email,
    role:userData.role,
},
config.jwt.refresh_token_secret as Secret,
config.jwt.refresh_token_expires_in as string,
)


    return {
        accessToken,
        refreshToken,
        needpasswordChange:userData.needPasswordChange,
    };

}

const refreshToken = async (token: string) => {
    let decodedData;
  
  
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
        console.log(decodedData);
    } catch (err) {
        throw new Error("You Are Now Authorized!!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE,


        }
    })
    
    const accessToken = jwtHelpers.genarateToken({
        email: userData.email,
        role:userData.role,
    },
    "aasdfadf",
    "5m",
    )
    return {
        accessToken,
        needpasswordChange:userData.needPasswordChange,
    };}


const changePassword = async (user:any,payload:any) => {
   
   
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE,
        }
    })
    
    
    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);


    if (!isCorrectPassword) { 
        throw new Error("Password incorrect!");
    }

    const hasedPassword: string = await bcrypt.hash(payload.newPassword, 12);


    await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hasedPassword,
            needPasswordChange:false,
        }
    })

    return {
        message: "Password changed successfully"
        
    }

}


const forgotPassword = async(payload:{email:string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status:UserStatus.ACTIVE,
            }
    })
    
    const resetPassToken=jwtHelpers.genarateToken({email:userData.email, role:userData.password},config.jwt.reset_pass_secret as Secret,config.jwt.reset_pass_token_expires_in as string)


    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;


    await emailSender(userData.email,
        `<div>
        <p>Dear User,</p>
        <p>Your password Reset Link : <a href=${resetPassLink}>
        <button>Reset Password</button>
        </a></p>
        </div>`
    )

    console.log(resetPassLink);


    console.log(resetPassToken);


}


const resetPassword = async(token:string,payload:{id:string,password:string})=> {
    console.log(token,payload);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE,
        }
    })

    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret);


    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN,"forbidden")
    }

   // hash password
   const password = await bcrypt.hash(payload.password, 12);

   // update into database
   await prisma.user.update({
       where: {
           id: payload.id
       },
       data: {
           password
       }
   })
    
}



export const AuthService={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,resetPassword
}