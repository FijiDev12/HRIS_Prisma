import { prisma } from "../util/prisma.util";

interface OTRequestType {
    employeeId: number;
    workDate: string;
    startTime: string;
    endTime: string;
    totalMinutes: number;
    reason: string;
    createdBy: number;
}

interface OTApproveType {
    approverId: number;
    remark?: string;
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

export async function createOtReqService(data: OTRequestType) {
    const locked = await isPayrollLocked(data.employeeId, data.workDate);
    if (locked) throw new Error("Payroll is locked");
    const result = prisma.overtimeRequest.create({ data });

    return result;
}

export async function getOtRequestService() {
    const result = prisma.overtimeRequest.findMany({
        include: {
            employee: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function getOtRequestByIdService(id: number) {
    const result = await prisma.overtimeRequest.findUnique({
        where: { id },
        include: {
            employee: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function getOtRequestByEmpIdService(employeeId: number) {
    const result = await prisma.overtimeRequest.findMany({
        where: { employeeId },
        include: {
            employee: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function approveOtRequestService(id: number, data: Partial<OTApproveType>) {
    const locked = await isPayrollLocked(Number(data?.employeeId), data?.workDate!);
    if (locked) throw new Error("Payroll is locked");
    const updateData = {
        ...data,
        status: "APPROVED" as const,
        approvedAt: new Date(),
    };

    const result = await prisma.overtimeRequest.update({
        where: { id },
        data: updateData
    });

    return result;
}

export async function rejectOtRequestService(id: number, data: Partial<OTApproveType>) {
    const updateData = {
        ...data,
        status: "REJECTED" as const,
        approvedAt: new Date(),
    };

    const result = await prisma.overtimeRequest.update({
        where: { id },
        data: updateData
    });

    return result;
}