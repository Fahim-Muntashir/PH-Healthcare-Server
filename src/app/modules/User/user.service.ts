import { Doctor, Prisma, UserRole, UserStatus } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/filUploader";
import { Request } from "express";
import { IFile } from "../../interfaces/interface";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { userSearcAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";



const createAdmin = async (req: Request) => {
       const file = req.file as IFile;
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


const createDoctor = async (req: Request):Promise<Doctor> => {
    const file = req.file as IFile;
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
 return result
 
}

const createPatient = async (req: Request) => {
    const file = req.file as IFile;
    if (file) {
     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
     req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
 }
 const hasedPassword: string = await bcrypt.hash(req.body.password, 12);
 const userData = {
     email: req.body.patient.email,
     password: hasedPassword,
     role: UserRole.PATIENT,
 }
 const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
         data: userData
     });

     const createdPatientData = await transactionClient.patient.create({
         data: req.body.patient
     });

     return createdPatientData;
 })
 return {
     result
 }
}


const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    try {
        const { limit, page, skip } = paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = params;
      
        const andConditions: Prisma.UserWhereInput[] = [];

        if (params.searchTerm) {
            andConditions.push({
                OR: userSearcAbleFields.map(field => ({
                    [field]: {
                        contains: params.searchTerm,
                        mode: 'insensitive'
                    }
                }))
            });
        }

        if (Object.keys(filterData).length > 0) {
            andConditions.push({
                AND: Object.keys(filterData).map(key => ({
                    [key]: {
                        equals: (filterData as any)[key]
                    }
                }))
            });
        }



        const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

        const result = await prisma.user.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder ? {
                [options.sortBy]: options.sortOrder 
            } : {
                createdAt: 'desc'
        },
            select: {
                id: true,
                email: true,
                role: true,
                needPasswordChange: true,
                status: true,
                createdAt: true,
                updatedAt: true,
        }
    }
        );

        const total = await prisma.user.count({
            where:whereConditions
        });

        return {
            meta: {
            page,
                limit,
                total,
            
        },data:result
        };
    } catch (error) {
        console.error("Error in getAllFromDB:", error);
        throw error;
    }
};


const changeProfileStatus = async (id:string,status:UserRole) => {

    const userData = await prisma.user.findFirstOrThrow({
        where: {
            id
        }
    })

    const updatUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    })
    return updatUserStatus
}





const getMyProfile = async (user:any) => {
    console.log(user.email);
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status:true,
        }
    })

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return {...userInfo,...profileInfo};
}



const updateMyProfile = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });


    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }



    let profileInfo;


    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })

    }

    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    return { ...profileInfo };
}





export const userServices = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}