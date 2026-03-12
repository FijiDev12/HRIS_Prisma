import { prisma } from "../util/prisma.util";
import { PayrollStatus } from "../../generated/prisma/enums";

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
    holidays: string[],
    restDates: string[],
    isHalfDay: boolean
): number {

    const holidaySet = new Set(holidays);
    const restSet = new Set(restDates);

    let totalDays = 0;

    const current = new Date(startDate);

    while (current <= endDate) {
        const dateStr = current.toISOString().split("T")[0];

        const isHoliday = holidaySet.has(dateStr);
        const isRestDay = restSet.has(dateStr);

        if (!isHoliday && !isRestDay) {
            totalDays++;
        }

        current.setDate(current.getDate() + 1);
    }

    if (isHalfDay) {
        return totalDays > 0 ? 0.5 : 0;
    }

    return totalDays;
}

export async function createLeaveReqService(data: LeaveRequestType) {
    const { employeeId, leaveTypeId, fromDate, toDate, isHalfday } = data;
    const currentYear = new Date().getFullYear();

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (end < start) {
        throw new Error("End date cannot be before start date.");
    }

    return prisma.$transaction(async (tx) => {
        const lockedPeriod = await tx.payrollPeriod.findFirst({
            where: {
                status: PayrollStatus.APPROVED,
                startDate: { lte: new Date(end) },
                endDate: { gte: new Date(start) },
            },
        });

        if (lockedPeriod) {
            throw new Error(
                "Cannot file leave. Payroll is already approved for this period."
            );
        }

        const startStr = start.toISOString().split("T")[0];
        const endStr = end.toISOString().split("T")[0];

        const overlapping = await tx.leaveRequest.findFirst({
            where: {
                employeeId,
                status: { not: "REJECTED" },
                fromDate: { lte: endStr },
                toDate: { gte: startStr },
            },
        });

        if (overlapping) {
            throw new Error("Leave request overlaps with existing leave.");
        }

        const holidays = await tx.holidayType.findMany({
            where: {
                holidayDate: {
                    gte: start,
                    lte: end,
                },
            },
        });

        const holidayDates = holidays.map((h) =>
            h.holidayDate.toISOString().split("T")[0]
        );

        const restDayRecords = await tx.restDay.findMany({
            where: {
                employeeId,
                restDate: {
                    gte: start,
                    lte: end,
                },
            },
        });

        const restDates = restDayRecords.map((r) =>
            r.restDate.toISOString().split("T")[0]
        );

        const totalDays = calculateWorkingDays(
            start,
            end,
            holidayDates,
            restDates,
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
            throw new Error("Leave balance not found.");
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
                usedDays: { increment: totalDays },
                remainingDays: { decrement: totalDays },
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

export async function approveLeaveRequestService(
    id: number,
    data: Partial<LeaveApproveType>
) {
    return prisma.$transaction(async (tx) => {
        const leave = await tx.leaveRequest.findUnique({
            where: { id },
        });

        if (!leave) {
            throw new Error("Leave request not found");
        }

        if (leave.status === "APPROVED") {
            throw new Error("Leave request already approved");
        }

        const lockedPeriod = await tx.payrollPeriod.findFirst({
            where: {
                status: PayrollStatus.APPROVED,
                startDate: { lte: new Date(leave.toDate) },
                endDate: { gte: new Date(leave.fromDate) },
            },
        });

        if (lockedPeriod) {
            throw new Error("Cannot approve leave. Payroll is already posted for this period.");
        }

        const approvedLeave = await tx.leaveRequest.update({
            where: { id },
            data: {
                ...data,
                status: "APPROVED",
                approvedAt: new Date(),
            },
        });

        const year = new Date().getFullYear();

        const balance = await tx.leaveBalance.findUnique({
            where: {
                employeeId_leaveTypeId_year: {
                    employeeId: approvedLeave.employeeId,
                    leaveTypeId: approvedLeave.leaveTypeId,
                    year,
                },
            },
        });

        if (!balance) {
            throw new Error("Leave balance not found.");
        }

        if (balance.remainingDays < approvedLeave.totalDays) {
            throw new Error("Insufficient leave balance.");
        }

        const usedDays = balance.usedDays + approvedLeave.totalDays;

        await tx.leaveBalance.update({
            where: { id: balance.id },
            data: {
                usedDays,
                remainingDays: balance.totalDays - usedDays,
            },
        });

        return approvedLeave;
    });
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

export async function createLeaveBalanceService(data: {
    employeeId: number;
    leaveTypeId: number;
    totalDays: number;
}) {
    const currentYear = new Date().getFullYear();

    const existing = await prisma.leaveBalance.findFirst({
        where: {
            employeeId: data.employeeId,
            leaveTypeId: data.leaveTypeId,
            year: currentYear,
            deletedAt: null
        }
    });

    if (existing) {
        throw new Error("Leave balance already exists for this employee and leave type this year.");
    }

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
    return prisma.leaveBalance.findMany({
        where: {
            deletedAt: null
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export async function getLeaveBalanceByIdService(id: number) {
    return prisma.leaveBalance.findFirst({
        where: {
            id,
            deletedAt: null
        }
    });
}

export async function getLeaveBalanceByEmpIdService(employeeId: number) {
    return prisma.leaveBalance.findMany({
        where: {
            employeeId,
            deletedAt: null
        }
    });
}

export async function updateLeaveBalanceService(
    id: number,
    data: {
        leaveTypeId?: number;
        totalDays?: number;
        remainingDays?: number;
    }
) {
    return prisma.leaveBalance.update({
        where: { id },
        data: {
            leaveTypeId: data.leaveTypeId,
            totalDays: data.totalDays,
            remainingDays: data.remainingDays
        }
    });
}

export async function deleteLeaveBalanceService(id: number) {
    return prisma.leaveBalance.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
}