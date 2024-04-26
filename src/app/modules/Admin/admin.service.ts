import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {

    const { searchTerm, ...filterData } = params;
    const andConditions:Prisma.AdminWhereInput[] = [];
    const adminSearchFields = ['name', 'email'];

    console.log(filterData);


    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchFields.map(field => ({
                [field]: { contains: params.searchTerm,
                         mode:'insensitive'
                        }
            }))
    })
    }

    if (Object.keys(filterData).length > 0) { 
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }
    
    const whereConditions:Prisma.AdminWhereInput = {AND:andConditions};

    const result = await prisma.admin.findMany({
        where:whereConditions
    });
    return result;
}
export const AdminService = {
    getAllFromDB
}