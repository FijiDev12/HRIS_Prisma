import { PayrollItemType, PayrollStatus } from "../../generated/prisma/client";
import { prisma } from "../util/prisma.util";

export const createPayrollPeriodService = async (data: any) =>
    prisma.payrollPeriod.create({
        data: {
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            siteId: data.siteId,
        }
    });

export const postPayrollPeriodService = async (
    id: number,
    performedBy: number
) => {
    return prisma.$transaction(async (tx) => {
        const payrolls = await tx.payroll.findMany({
            where: { payrollPeriodId: id, deletedAt: null },
        });

        if (!payrolls.length) throw new Error("No payrolls found");

        for (const p of payrolls)
            if (p.status !== PayrollStatus.DRAFT)
                throw new Error("All payrolls must be DRAFT");

        await tx.payroll.updateMany({
            where: { payrollPeriodId: id },
            data: { status: PayrollStatus.APPROVED },
        });

        await tx.payrollPeriod.update({
            where: { id },
            data: { status: PayrollStatus.APPROVED },
        });

        return { message: "Payroll period posted successfully" };
    });
};

export const softDeletePayrollPeriodService = async (id: number) =>
    prisma.payrollPeriod.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

export const generatePayrollService = async (
    employeeId: number,
    payrollPeriodId: number
) => {
    return prisma.$transaction(async (tx) => {
        const employee = await tx.employee.findUnique({
            where: { id: employeeId },
        });
        if (!employee) throw new Error("Employee not found");

        const period = await tx.payrollPeriod.findUnique({
            where: { id: payrollPeriodId },
        });
        if (!period) throw new Error("Payroll period not found");

        const existing = await tx.payroll.findUnique({
            where: {
                employeeId_payrollPeriodId: { employeeId, payrollPeriodId },
            },
        });
        if (existing) throw new Error("Payroll already exists");

        const dtrs = await tx.dTR.findMany({
            where: {
                employeeId,
                status: "APPROVED",
                workDate: {
                    gte: period.startDate.toISOString().split("T")[0],
                    lte: period.endDate.toISOString().split("T")[0],
                },
            },
        });

        const dailyRate = Number(employee.basicSalary) / 22;
        const hourlyRate = dailyRate / 8;
        const minuteRate = hourlyRate / 60;

        let grossBasic = 0;
        let totalLateDeduction = 0;
        let totalUndertimeDeduction = 0;
        let totalOvertimePay = 0;

        for (const dtr of dtrs) {
            if (!dtr.timeIn || !dtr.timeOut) continue;

            if (dtr.isHalfDay) {
                grossBasic += dailyRate / 2;
            } else {
                grossBasic += dailyRate;
            }

            if (dtr.lateMinutes > 0) {
                totalLateDeduction += dtr.lateMinutes * minuteRate;
            }
            if (dtr.undertimeMinutes > 0) {
                totalUndertimeDeduction += dtr.undertimeMinutes * minuteRate;
            }

            if (dtr.overtimeMinutes > 0) {
                totalOvertimePay +=
                    dtr.overtimeMinutes * minuteRate * 1.25;
            }
        }

        const payroll = await tx.payroll.create({
            data: {
                employeeId,
                payrollPeriodId,
                basicSalary: employee.basicSalary,
                totalAllowance: totalOvertimePay,
                totalDeduction: 0,
                netPay: 0,
                status: PayrollStatus.DRAFT,
            },
        });

        if (totalOvertimePay > 0) {
            await tx.payrollItem.create({
                data: {
                    payrollId: payroll.id,
                    type: PayrollItemType.ALLOWANCE,
                    name: "Overtime Pay",
                    amount: totalOvertimePay,
                },
            });
        }

        if (totalLateDeduction > 0) {
            await tx.payrollItem.create({
                data: {
                    payrollId: payroll.id,
                    type: PayrollItemType.DEDUCTION,
                    name: "Late Deduction",
                    amount: totalLateDeduction,
                },
            });
        }

        if (totalUndertimeDeduction > 0) {
            await tx.payrollItem.create({
                data: {
                    payrollId: payroll.id,
                    type: PayrollItemType.DEDUCTION,
                    name: "Undertime Deduction",
                    amount: totalUndertimeDeduction,
                },
            });
        }

        let totalGovDeduction = 0;

        const contributions = await tx.govContribution.findMany({
            where: {
                minSalary: { lte: employee.basicSalary },
                maxSalary: { gte: employee.basicSalary },
                deletedAt: null,
            },
        });

        for (const contrib of contributions) {
            totalGovDeduction += Number(contrib.employeeShare);

            await tx.payrollItem.create({
                data: {
                    payrollId: payroll.id,
                    type: PayrollItemType.DEDUCTION,
                    name: `${contrib.type} Contribution`,
                    amount: contrib.employeeShare,
                    govContributionId: contrib.id,
                },
            });
        }

        const totalDeduction =
            totalLateDeduction +
            totalUndertimeDeduction +
            totalGovDeduction;

        const netSalary =
            grossBasic +
            totalOvertimePay -
            totalDeduction;

        return tx.payroll.update({
            where: { id: payroll.id },
            data: {
                totalAllowance: totalOvertimePay,
                totalDeduction,
                netPay: netSalary,
            },
            include: {
                items: true,
                employee: true,
            },
        });
    });
};

export const getPayrollByPeriodService = async (periodId: number) => {
    return prisma.payroll.findMany({
        where: { payrollPeriodId: periodId, deletedAt: null },
        include: {
            employee: true,
            items: true,
            dtrs: {
                select: {
                    id: true,
                    workDate: true,
                    timeIn: true,
                    timeOut: true,
                    lateMinutes: true,
                    undertimeMinutes: true,
                    overtimeMinutes: true,
                    isHalfDay: true,
                    status: true,
                },
            },
        },
    });
};

export const softDeletePayrollService = async (id: number) => {
    const payroll = await prisma.payroll.findUnique({ where: { id } });
    if (!payroll) throw new Error("Payroll not found");
    if (payroll.isLocked)
        throw new Error("Cannot delete locked payroll");

    if (payroll.status !== PayrollStatus.DRAFT)
        throw new Error("Cannot delete locked payroll");
    return prisma.payroll.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const reversePayrollService = async (id: number, performedBy: number) => {
    return prisma.$transaction(async (tx) => {
        const payroll = await tx.payroll.findUnique({ where: { id } });
        if (!payroll) throw new Error("Payroll not found");
        if (payroll.status !== PayrollStatus.APPROVED)
            throw new Error("Only APPROVED payroll can be reversed");

        await tx.payroll.update({ where: { id }, data: { status: PayrollStatus.REVERSED } });
        await tx.payrollAudit.create({
            data: {
                payrollPeriodId: payroll.payrollPeriodId,
                action: "REVERSED",
                performedBy,
            },
        });

        return { message: "Payroll reversed successfully" };
    });
};

export const approvePayrollPeriodService = async (
    periodId: number,
    performedBy: number
) => {
    return prisma.$transaction(async (tx) => {
        const payrolls = await tx.payroll.findMany({
            where: { payrollPeriodId: periodId, deletedAt: null },
        });

        if (!payrolls.length) throw new Error("No payrolls found");

        for (const p of payrolls) {
            if (p.status !== PayrollStatus.DRAFT)
                throw new Error("All payrolls must be DRAFT");
        }

        const now = new Date();

        await tx.payroll.updateMany({
            where: { payrollPeriodId: periodId },
            data: {
                status: PayrollStatus.APPROVED,
                approvedBy: performedBy,
                approvedAt: now,
                isLocked: true,
                lockedAt: now,
            },
        });

        await tx.payrollPeriod.update({
            where: { id: periodId },
            data: {
                status: PayrollStatus.APPROVED,
                isLocked: true,
                lockedAt: now,
            },
        });

        return { message: "Payroll period approved & locked successfully" };
    });
};

export const unlockPayrollService = async (
    payrollId: number,
) => {
    return prisma.$transaction(async (tx) => {
        const payroll = await tx.payroll.findUnique({
            where: { id: payrollId },
        });

        if (!payroll) throw new Error("Payroll not found");
        if (!payroll.isLocked)
            throw new Error("Payroll is not locked");

        await tx.payroll.update({
            where: { id: payrollId },
            data: {
                isLocked: false,
                lockedAt: null,
                status: PayrollStatus.DRAFT,
                approvedBy: null,
                approvedAt: null,
            },
        });

        return { message: "Payroll unlocked successfully" };
    });
};