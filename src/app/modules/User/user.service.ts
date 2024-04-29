import { UserRole } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/filUploader";



const createAdmin = async (req: any) => {
       const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
    }
    const hasedPassword: string = await bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.admin.email,
        password: hasedPassword,
        role: UserRole.ADMIN,
    }
    const result = await prisma.$transaction(async (transactionClient) => {
       await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    })
    return {
        result
    }
}


const createDoctor = async (req: any) => {
    const file = req.file;
 if (file) {
     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
     req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
 }
 const hasedPassword: string = await bcrypt.hash(req.body.password, 12);
 const userData = {
     email: req.body.doctor.email,
     password: hasedPassword,
     role: UserRole.DOCTOR,
 }
 const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
         data: userData
     });

     const createdDoctorData = await transactionClient.doctor.create({
         data: req.body.doctor
     });

     return createdDoctorData;
 })
 return {
     result
 }
}

export const userServices = {
    createAdmin,createDoctor
}