import { prisma } from "../util/prisma.util";

interface OBRequestType {
    employeeId: number;
    workDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
    createdBy: number;
}

interface OBApproveType {
    approverId: number;
    remark?: string;
}

export async function createObReqService(data: OBRequestType) {
    const result = prisma.officialBusiness.create({ data });

    return result;
}

export async function getObRequestService() {
    const result = prisma.officialBusiness.findMany({
        include: {
            employee: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function getObRequestByEmpIdService(employeeId: number) {
    const result = await prisma.officialBusiness.findMany({
        where: { employeeId },
        include: {
            employee: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function approveObRequestService(id: number, data: Partial<OBApproveType>) {
    const updateData = {
        ...data,
        status: "APPROVED" as const,
        approvedAt: new Date(),
    };

    const result = await prisma.officialBusiness.update({
        where: { id },
        data: updateData
    });

    return result;
}

export async function rejectObRequestService(id: number, data: Partial<OBApproveType>) {
    const updateData = {
        ...data,
        status: "REJECTED" as const,
        approvedAt: new Date(),
    };

    const result = await prisma.officialBusiness.update({
        where: { id },
        data: updateData
    });

    return result;
}