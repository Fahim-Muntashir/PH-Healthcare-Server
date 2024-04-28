import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/paginations";

const getAllFromDB = async (params: IAdminFilterRequest, options: IPaginationOptions) => {
    try {
        const { limit, page, skip } = paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = params;
      
        const andConditions: Prisma.AdminWhereInput[] = [];

        if (params.searchTerm) {
            andConditions.push({
                OR: adminSearchAbleFields.map(field => ({
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
        andConditions.push({
            isDeleted: false,
        })

        const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

        const result = await prisma.admin.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy ? { [options.sortBy]: options.sortOrder || 'asc' } : { createdAt: 'desc' }
        });

        const total = await prisma.admin.count({
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


// Get Using Id


const getByIdFromDB = async (id:string):Promise<Admin | null> => { 
    const result = await prisma.admin.findUnique({
        where: {
            id: id,
            isDeleted: false
        }
    })
    return(result)
}



const updateIntoDB = async (id: string,data:Partial<Admin>) => {
  
   await prisma.admin.findUniqueOrThrow({
        where: {
           id,
            isDeleted:false,
            
        }
   })
    
    const result = await prisma.admin.update({
        where: {
            id
        },data
    })

    return(result)
}

// Delete Data
const deleteFromDB = async (id: string):Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: { id }
        });
         await transactionClient.user.delete({
            where: { email: adminDeletedData.email }
        });
        return adminDeletedData;
    });
    return result;
}


// Delete Data
const softDeleteFromDB = async (id: string):Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: { id },
            data: { isDeleted: true },
        });
        await transactionClient.user.update({
            where: { email: adminDeletedData.email },
            data: {
                status: UserStatus.DELETE
            }
        });
        return adminDeletedData;
    });
    return result;
}

export const AdminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB,
};
