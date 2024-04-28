import { Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (params: any, options: any) => {
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
                        equals: filterData[key]
                    }
                }))
            });
        }

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

export const AdminService = {
    getAllFromDB
};
