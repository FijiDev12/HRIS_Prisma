import { prisma } from "../util/prisma.util";

interface RoleType {
    roleName: string;
    createdBy: number;
}

export async function createRoleService(data: RoleType) {
    const result = await prisma.role.create({ data });

    return result;
}

export async function getRolesService() {
    const result = await prisma.role.findMany({
        where: { deletedAt: null }
    })

    return result;
}

export async function getRoleByIdService(id: number) {
    const result = await prisma.role.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateRoleService(id: number, data: Partial<RoleType>) {
    const result = await prisma.role.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteRoleService(id: number) {
    const result = await prisma.role.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
}