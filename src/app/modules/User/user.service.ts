import { PrismaClient,UserRole } from "@prisma/client"
import * as bcrypt from "bcrypt"


const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
    
    const hasedPassword: string = await bcrypt.hash(data.password, 12);
    console.log(hasedPassword);

    const userData = {
        email: data.admin.email,
        password: hasedPassword,
        role: UserRole.ADMIN,
    }

    const result = await prisma.$transaction(async (transactionClient) => {
       await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        });

        return createdAdminData;
    })

    return {
        result
    }
}

export const userServices = {
    createAdmin
}