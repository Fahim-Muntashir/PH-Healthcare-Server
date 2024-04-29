import prisma from "../../../shared/prisma"
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./sendEmail";

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


    const resetPassLink = config.reset_pass_link + `?email=${userData.email}&token=${resetPassToken}`;


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



export const AuthService={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
}