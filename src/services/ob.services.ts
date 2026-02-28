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
    remarks?: string;
    workDate: string;
    employeeId: number;
}

async function isPayrollLocked(employeeId: number, workDate: string) {
    const dtr = await prisma.dTR.findFirst({
        where: {
            employeeId,
            workDate,
            payroll: {
                is: {
                    status: "POSTED",
                },
            },
        },
    });
    return !!dtr;
}

export async function createObReqService(data: OBRequestType) {
    const locked = await isPayrollLocked(data.employeeId, data.workDate);
    if (locked) throw new Error("Payroll is locked");
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

export async function getObRequestByIdService(id: number) {
    const result = await prisma.officialBusiness.findUnique({
        where: { id },
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
    const locked = await isPayrollLocked(Number(data?.employeeId), data?.workDate!);
    if (locked) throw new Error("Payroll is locked");
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