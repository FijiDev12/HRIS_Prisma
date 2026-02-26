import { hashPassword } from "../util/hash.util.";
import { prisma } from "../util/prisma.util";

interface UserType {
    email: string;
    password: string;
    roleId: number;
    employeeId?: number;
}

export async function createUserService(data: UserType) {
    const result = await prisma.user.create({
        data: {
            ...data,
            password: await hashPassword(data.password)
        }
    });

    return result;
}

export async function getUsersService() {
    const result = await prisma.user.findMany({
        include: { role: true, employee: true },
        where: { deletedAt: null }
    });

    return result;
}

export async function getUserByIdService(id: number) {
    const result = await prisma.user.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateUserService(id: number, data: Partial<UserType>) {
    const updateUserData: any = { ...data }
    if (data.password) {
        updateUserData.password = await hashPassword(data.password)
    }
    const result = await prisma.user.update({
        where: { id },
        data: updateUserData
    });

    return result;
}

export async function deleteUserService(id: number) {
    const result = await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}