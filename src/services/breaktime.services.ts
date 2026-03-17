import { prisma } from "../util/prisma.util";

interface BreakTimeType {
    shiftId: number;
    startTime: string;
    endTime: string;
    duration: number;
    isPaid: boolean;
    isFlexible: boolean;
}

export async function createBreakTimeService(data: BreakTimeType) {
    const result = await prisma.breakTime.create({ data });

    return result;
}

export async function getBreakTimesService() {
    const result = await prisma.breakTime.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getBreakTimeByIdService(id: number) {
    const result = await prisma.breakTime.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateBreakTimeService(id: number, data: Partial<BreakTimeType>) {
    const result = await prisma.breakTime.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteBreakTimeService(id: number) {
    const result = await prisma.breakTime.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}