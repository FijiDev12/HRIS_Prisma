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
    reason: string;
    createdBy: number;
    isHalfday: boolean;
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

function calculateWorkingDays(
    startDate: Date,
    endDate: Date,
    holidays: Date[],
    restDays: number[],
    isHalfDay: boolean
): number {
    let totalDays = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
        const day = current.getDay();

        const isRestDay = restDays.includes(day);
        const isHoliday = holidays.some(
            h => h.toDateString() === current.toDateString()
        );

        if (!isRestDay && !isHoliday) {
            totalDays++;
        }

        current.setDate(current.getDate() + 1);
    }

    if (isHalfDay) {
        return 0.5;
    }

    return totalDays;
}

export async function createLeaveReqService(data: LeaveRequestType) {
    const { employeeId, leaveTypeId, fromDate, toDate, isHalfday } = data;
    const currentYear = new Date().getFullYear();

    if (new Date(toDate) < new Date(fromDate)) {
        throw new Error("End date cannot be before start date.");
    }

    return await prisma.$transaction(async (tx) => {
        const overlapping = await tx.leaveRequest.findFirst({
        where: {
            employeeId,
            status: { not: "REJECTED" },
            OR: [
                {
                    fromDate: { lte: toDate },
                    toDate: { gte: fromDate },
                },
            ],
        },
        });

        if (overlapping) {
            throw new Error("Leave request overlaps with existing leave.");
        }

        const holidays = await tx.holidayType.findMany({
            where: {
                holidayDate: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate),
                },
            },
        });
        const holidayDates = holidays.map((h: any) => new Date(h.date));

        const restDayRecords = await tx.restDay.findMany({
            where: { employeeId },
        });
        const restDays = restDayRecords.map(r => r.dayOfWeek);

        const totalDays = calculateWorkingDays(
            new Date(fromDate),
            new Date(toDate),
            holidayDates,
            restDays,
            isHalfday
        );

        if (totalDays <= 0) {
            throw new Error("Selected dates fall on rest days or holidays.");
        }

        const leaveBalance = await tx.leaveBalance.findFirst({
            where: {
                employeeId,
                leaveTypeId,
                year: currentYear,
                deletedAt: null,
            },
        });

        if (!leaveBalance) {
            throw new Error("Leave balance not found for this employee and leave type.");
        }

        if (leaveBalance.remainingDays < totalDays) {
            throw new Error(
                `Insufficient leave balance. Remaining: ${leaveBalance.remainingDays} days`
            );
        }

        const leaveRequest = await tx.leaveRequest.create({
            data: {
                ...data,
                totalDays,
            },
        });

        await tx.leaveBalance.update({
            where: { id: leaveBalance.id },
            data: {
                usedDays: leaveBalance.usedDays + totalDays,
                remainingDays: leaveBalance.remainingDays - totalDays,
            },
        });

        return leaveRequest;
    });
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

export async function getLeaveRequestByIdService(id: number) {
    console.log("id:", id)
    const result = await prisma.leaveRequest.findUnique({
        where: { id },
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