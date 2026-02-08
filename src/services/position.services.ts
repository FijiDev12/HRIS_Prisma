import { prisma } from "../util/prisma.util";

interface PositionType {
    positionName: string;
    departmentId: number;
    createdBy: number;
}

export async function createPositionService(data: PositionType) {
    const result = await prisma.position.create({ data });

    return result;
}

export async function getPositionsService() {
    const result = await prisma.position.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getPositionByIdService(id: number) {
    const result = await prisma.position.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updatePositionService(id: number, data: Partial<PositionType>) {
    const result = await prisma.position.update({
        where: { id },
        data
    });

    return result;
}

export async function deletePositionService(id: number) {
    const result = await prisma.position.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}