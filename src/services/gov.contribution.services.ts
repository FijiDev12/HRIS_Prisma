import { prisma } from "../util/prisma.util";

export const createGovContributionService = async (data: any) => {
    const existing = await prisma.govContribution.findFirst({
        where: {
            type: data.type,
            deletedAt: null,
        },
    });

    if (existing) {
        throw new Error(`${data.type} contribution already exists.`);
    }
    return prisma.govContribution.create({ data });
};

export const getAllGovContributionsService = async () => {
    return prisma.govContribution.findMany({ where: { deletedAt: null } });
};

export const updateGovContributionService = async (id: number, data: any) => {
    return prisma.govContribution.update({
        where: { id },
        data,
    });
};

export const deleteGovContributionService = async (id: number) => {
    return prisma.govContribution.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
};

export const getGovContributionByIdService = async (id: number) => {
    return prisma.govContribution.findUnique({
        where: { id },
    });
};