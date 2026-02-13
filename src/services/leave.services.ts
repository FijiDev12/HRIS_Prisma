import { prisma } from "../util/prisma.util";

interface LeaveType {
    leaveName: string;
    createdBy: number;
}

interface LeaveRequestType {
    employeeId: number;
    leaveTypeId: number;
    fromDate: string;
    toDate: string;
    totalDays: number;
    reason: string;
    createdBy: number;
}

interface LeaveApproveType {
    approverId: number;
    remark?: string;
}

export async function createLeaveService(data: LeaveType) {
    const result = await prisma.leaveType.create({ data });

    return result;
}

export async function getLeavesService() {
    const result = await prisma.leaveType.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getLeaveByIdService(id: number) {
    const result = await prisma.leaveType.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateLeaveService(id: number, data: Partial<LeaveType>) {
    const result = await prisma.leaveType.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteLeaveService(id: number) {
    const result = await prisma.leaveType.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}

export async function createLeaveReqService(data: LeaveRequestType) {
    const { employeeId, leaveTypeId, totalDays } = data;
    const currentYear = new Date().getFullYear();

    const leaveBalance = await prisma.leaveBalance.findUnique({
        where: {
            employeeId_leaveTypeId_year: {
                employeeId,
                leaveTypeId,
                year: currentYear
            },
            deletedAt: null
        }
    });

    if (!leaveBalance) {
        throw new Error("Leave balance not found for this employee and leave type.");
    }

    if (leaveBalance.remainingDays < totalDays) {
        throw new Error(
            `Insufficient leave balance. Remaining: ${leaveBalance.remainingDays} days`
        );
    }
    const result = prisma.leaveRequest.create({ data });

    await prisma.leaveBalance.update({
        where: { id: leaveBalance.id },
        data: { usedDays: leaveBalance.usedDays + totalDays, remainingDays: leaveBalance.remainingDays - totalDays }
    });

    return result;
}

export async function getLeaveRequestService() {
    const result = prisma.leaveRequest.findMany({
        include: {
            employee: true,
            leaveType: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function getLeaveRequestByEmpIdService(employeeId: number) {
    const result = await prisma.leaveRequest.findMany({
        where: { employeeId },
        include: {
            employee: true,
            leaveType: true,
            creator: true,
            approver: true
        }
    });

    return result;
}

export async function approveLeaveRequestService(id: number, data: Partial<LeaveApproveType>) {
    const updateData = {
        ...data,
        status: "APPROVED" as const,
        approvedAt: new Date(),
    };

    const leave = await prisma.leaveRequest.update({
        where: { id },
        data: updateData
    });

    const year = new Date().getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
        where: {
        employeeId_leaveTypeId_year: {
            employeeId: leave.employeeId,
            leaveTypeId: leave.leaveTypeId,
            year
        }
        }
    });

    if (balance) {
        const usedDays = balance.usedDays + leave.totalDays;
        await prisma.leaveBalance.update({
            where: { id: balance.id },
            data: { usedDays, remainingDays: balance.totalDays - usedDays }
        });
    } else {
        await prisma.leaveBalance.create({
            data: {
                employeeId: leave.employeeId,
                leaveTypeId: leave.leaveTypeId,
                totalDays: leave.totalDays,
                usedDays: leave.totalDays,
                remainingDays: 0,
                year
            }
        });
    }
    return leave;
}

export async function rejectLeaveRequestService(id: number, data: Partial<LeaveApproveType>) {
    const updateData = {
        ...data,
        status: "REJECTED" as const,
        approvedAt: new Date(),
    };

    const result = await prisma.leaveRequest.update({
        where: { id },
        data: updateData
    });

    return result;
}

export async function createLeaveBalanceService(data: any) {
    const currentYear = new Date().getFullYear();

    const result = await prisma.leaveBalance.create({
        data: {
            employeeId: data.employeeId,
            leaveTypeId: data.leaveTypeId,
            totalDays: data.totalDays,
            remainingDays: data.totalDays,
            year: currentYear
        }
    });

    return result;
}

export async function getLeaveBalanceService() {
    const result = await prisma.leaveBalance.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getLeaveBalanceByIdService(id: number) {
    const result = await prisma.leaveBalance.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function getLeaveBalanceByEmpIdService(employeeId: number) {
    const result = await prisma.leaveBalance.findMany({
        where: { employeeId, deletedAt: null }
    });

    return result;
}

export async function updateLeaveBalanceService(id: number, data: any) {
    const result = await prisma.leaveBalance.update({
        where: { id },
        data: {
            leaveTypeId: data.leaveTypeId,
            totalDays: data.totalDays,
            remainingDays: data.totalDays,
        }
    });

    return result;
}

export async function deleteLeaveBalanceService(id: number) {
    const result = await prisma.leaveBalance.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}