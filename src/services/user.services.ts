import { comparePassword, hashPassword } from "../util/hash.util.";
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
            email: data.email,
            password: await hashPassword(data.password),
            role: {
                connect: { id: Number(data.roleId) }
            },
            employeeId: Number(data.employeeId)
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

export async function updateUserService(
    id: number,
    data: Partial<UserType>
) {
    const updateData: any = {};

    if (data.email) {
        updateData.email = data.email;
    }

    if (data.password) {
        updateData.password = await hashPassword(data.password);
    }

    if (data.roleId) {
        updateData.role = {
            connect: { id: data.roleId }
        };
    }

    if (data.employeeId !== undefined) {
        updateData.employeeId = data.employeeId;
    }

    const result = await prisma.user.update({
        where: { id },
        data: updateData
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

export async function updateUserChangePassService(
    id: number,
    data: any
) {
    const existingUser = await prisma.user.findUnique({
        where: { id },
        include: { employee: true }
    });

    if (!existingUser) {
        throw new Error("User not found")
    }

    const updateData: any = {}

    if (data.password) {
        const isSamePassword = await comparePassword(
            data.password,
            existingUser.password
        );

        if (isSamePassword) {
            throw new Error("New password cannot be the same as the current password");
        }

        updateData.password = await hashPassword(data.password);
    }

    const result = await prisma.user.update({
        where: { id },
        data: updateData
    });

    if (existingUser.employeeId) {
        await prisma.employee.update({
            where: { id: existingUser.employeeId },
            data: {
                tempPassword: false
            }
        });
    }

    return result;
}
