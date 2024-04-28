import prisma from "../../../shared/prisma"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";

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
    "aasdfadf",
    "5m",
    )

const refreshToken = jwtHelpers.genarateToken({
    email: userData.email,
    role:userData.role,
},
"sdfadfawedf",
"30d",
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
        decodedData = jwtHelpers.verifyToken(token, 'sdfadfawedf');
        console.log(decodedData);
    } catch (err) {
        throw new Error("You Are Now Authorized!!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,                        status:UserStatus.ACTIVE,


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