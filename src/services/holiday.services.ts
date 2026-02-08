import { prisma } from "../util/prisma.util";

interface HolidayType {
    holidayName: string;
    holidayDate: string | Date;
    siteId: number;
    createdBy: number;
    type: 'REGULAR' | 'SPECIAL';
}

export async function createHolidayService(data: HolidayType) {
    const result = await prisma.holidayType.create({
        data: {
            ...data,
            holidayDate: new Date(data.holidayDate)
        }
    });

    return result;
}

export async function getHolidaysService() {
    const result = await prisma.holidayType.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getHolidayByIdService(id: number) {
    const result = await prisma.holidayType.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateHolidayService(id: number, data: Partial<HolidayType>) {
    const result = await prisma.holidayType.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteHolidayService(id: number) {
    const result = await prisma.holidayType.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}