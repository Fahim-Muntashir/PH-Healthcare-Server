import prisma from "../../../shared/prisma"
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";

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


export const AuthService={
    loginUser,
    refreshToken
}