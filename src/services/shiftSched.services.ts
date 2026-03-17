import { prisma } from "../util/prisma.util";

interface ShiftSchedType {
    shiftName: string;
    startTime?: string;
    endTime?: string;
    flexStart?: string;
    flexEnd?: string;
}

export async function createShiftService(data: ShiftSchedType) {
    const { shiftName, startTime, endTime, flexStart, flexEnd } = data;

    const existing = await prisma.shift.findFirst({
        where: { shiftName }
    });

    if (existing) {
        throw new Error("Shift name already exists.");
    }

    if (!startTime && !flexStart) {
        throw new Error("Shift must have either fixed time or flex time.");
    }

    if (startTime && endTime) {
        const start = new Date(`1900-01-01T${startTime}`);
        const end = new Date(`1900-01-01T${endTime}`);

        if (start.getTime() === end.getTime()) {
            throw new Error("Start time and end time cannot be the same.");
        }
    }

    if (flexStart && flexEnd) {
        const fStart = new Date(`1900-01-01T${flexStart}`);
        const fEnd = new Date(`1900-01-01T${flexEnd}`);

        if (fStart >= fEnd) {
            throw new Error("Flex start must be earlier than flex end.");
        }
    }

    return prisma.shift.create({
        data
    });
}

export async function getShiftService() {
    const result = await prisma.shift.findMany({
        where: { deletedAt: null },
        include: { breaks: { where: { deletedAt: null } } }
    });

    return result;
}

export async function getShiftByIdService(id: number) {
    const result = await prisma.shift.findUnique({
        where: { id, deletedAt: null },
        include: { breaks: { where: { deletedAt: null } } }
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