import { prisma } from "../util/prisma.util";

interface RestDayType {
    employeeId: number;
    dayOfWeek: number;
}

export async function createRestDayService(data: RestDayType) {
    const result = await prisma.restDay.create({ data });

    return result;
}

export async function getRestDayService() {
    const result = await prisma.restDay.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getRestDayByIdService(id: number) {
    const result = await prisma.restDay.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateRestDayService(id: number, data: Partial<RestDayType>) {
    const result = await prisma.restDay.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteRestDayService(id: number) {
    const result = await prisma.restDay.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}