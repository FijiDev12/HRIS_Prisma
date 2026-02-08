import { prisma } from "../util/prisma.util";

interface DeptType {
    departmentName: string;
    siteId: number;
    createdBy: number;
}

export async function createDepartmentService(data: DeptType) {
    const result = await prisma.department.create({ data });

    return result;
}

export async function getDepartmentsService() {
    const result = await prisma.department.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getDepartmentByIdService(id: number) {
    const result = await prisma.department.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateDepartmentService(id: number, data: Partial<DeptType>) {
    const result = await prisma.department.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteDepartmentService(id: number) {
    const result = await prisma.department.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}