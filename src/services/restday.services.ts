import { prisma } from "../util/prisma.util";

interface RestDayType {
    employeeId: number;
    restDate: Date;
}

export async function createRestDayService(data: RestDayType) {
    return prisma.restDay.create({
        data
    });
}

export async function getRestDayService() {
    return prisma.restDay.findMany({
        where: {
            deletedAt: null
        },
        include: {
            employee: {
                select: {
                    employeeNo: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    });
}

export async function getRestDayByEmpIdService(employeeId: number) {
    return prisma.restDay.findMany({
        where: {
            employeeId,
            deletedAt: null
        },
        include: {
            employee: {
                select: {
                    employeeNo: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    });
}

export async function updateRestDayService(
    id: number,
    data: Partial<RestDayType>
) {
    return prisma.restDay.update({
        where: { id },
        data
    });
}

export async function deleteRestDayService(id: number) {
    return prisma.restDay.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
}