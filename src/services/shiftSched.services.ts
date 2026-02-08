import { prisma } from "../util/prisma.util";

interface ShiftSchedType {
    shiftName: string;
    startTime?: string;
    endTime?: string;
    flexStart?: string;
    flexEnd?: string;
}

export async function createShiftService(data: ShiftSchedType) {
    const result = await prisma.shift.create({ data });

    return result;
}

export async function getShiftService() {
    const result = await prisma.shift.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getShiftByIdService(id: number) {
    const result = await prisma.shift.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateShiftService(id: number, data: Partial<ShiftSchedType>) {
    const result = await prisma.shift.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteShiftService(id: number) {
    const result = await prisma.shift.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}