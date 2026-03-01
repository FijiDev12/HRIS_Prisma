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

export const generatePayrollForSiteService = async (
    siteId: number,
    payrollPeriodId: number
) => {
    return prisma.$transaction(async (tx) => {
        const period = await tx.payrollPeriod.findUnique({
            where: { id: payrollPeriodId },
        });

        if (!period) throw new Error("Payroll period not found");
        if (period.isLocked)
            throw new Error("Payroll period is locked");

        const site = await tx.site.findUnique({
            where: { id: siteId },
        });

        if (!site) throw new Error("Site not found");

        const employees = await tx.employee.findMany({
            where: {
                siteId,
                deletedAt: null,
            },
        });

        if (!employees.length)
            throw new Error("No employees found for this site");

        let created = 0;
        let skipped = 0;

        for (const employee of employees) {
            const existing = await tx.payroll.findUnique({
                where: {
                    employeeId_payrollPeriodId: {
                        employeeId: employee.id,
                        payrollPeriodId,
                    },
                },
            });

            if (existing) {
                skipped++;
                continue;
            }

            const dtrs = await tx.dTR.findMany({
                where: {
                    employeeId: employee.id,
                    status: "APPROVED",
                    workDate: {
                        gte: period.startDate
                            .toISOString()
                            .split("T")[0],
                        lte: period.endDate
                            .toISOString()
                            .split("T")[0],
                    },
                },
            });

            const dailyRate = Number(employee.basicSalary) / 22;
            const hourlyRate = dailyRate / 8;
            const minuteRate = hourlyRate / 60;

            let grossBasic = 0;
            let totalLate = 0;
            let totalUndertime = 0;
            let totalOT = 0;

            for (const dtr of dtrs) {
                if (!dtr.timeIn || !dtr.timeOut) continue;

                grossBasic += dtr.isHalfDay
                    ? dailyRate / 2
                    : dailyRate;

                totalLate += dtr.lateMinutes * minuteRate;
                totalUndertime +=
                    dtr.undertimeMinutes * minuteRate;
                totalOT +=
                    dtr.overtimeMinutes *
                    minuteRate *
                    1.25;
            }

            const payroll = await tx.payroll.create({
                data: {
                    employeeId: employee.id,
                    payrollPeriodId,
                    basicSalary: employee.basicSalary,
                    status: "DRAFT",
                },
            });

            if (totalOT > 0) {
                await tx.payrollItem.create({
                    data: {
                        payrollId: payroll.id,
                        type: "ALLOWANCE",
                        name: "Overtime Pay",
                        amount: totalOT,
                    },
                });
            }

            if (totalLate > 0) {
                await tx.payrollItem.create({
                    data: {
                        payrollId: payroll.id,
                        type: "DEDUCTION",
                        name: "Late Deduction",
                        amount: totalLate,
                    },
                });
            }

            if (totalUndertime > 0) {
                await tx.payrollItem.create({
                    data: {
                        payrollId: payroll.id,
                        type: "DEDUCTION",
                        name: "Undertime Deduction",
                        amount: totalUndertime,
                    },
                });
            }

            let totalGov = 0;

            const contributions =
                await tx.govContribution.findMany({
                    where: {
                        minSalary: {
                            lte: employee.basicSalary,
                        },
                        maxSalary: {
                            gte: employee.basicSalary,
                        },
                        deletedAt: null,
                    },
                });

            for (const contrib of contributions) {
                totalGov += Number(contrib.employeeShare);

                await tx.payrollItem.create({
                    data: {
                        payrollId: payroll.id,
                        type: "DEDUCTION",
                        name: `${contrib.type} Contribution`,
                        amount: contrib.employeeShare,
                        govContributionId: contrib.id,
                    },
                });
            }

            const totalDeduction =
                totalLate + totalUndertime + totalGov;

            const netSalary =
                grossBasic + totalOT - totalDeduction;

            await tx.payroll.update({
                where: { id: payroll.id },
                data: {
                    totalAllowance: totalOT,
                    totalDeduction,
                    netPay: netSalary,
                },
            });

            created++;
        }

        return {
            message: `Payroll generated for site: ${site.siteName}`,
            siteId,
            totalEmployees: employees.length,
            created,
            skipped,
        };
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

export const getPayrollAllPeriodService = async () => {
    return prisma.payrollPeriod.findMany({
        where: { deletedAt: null },
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

export const getPayrollByEmployeeIdService = async (employeeId: number, periodId: number) => {
    return prisma.payroll.findMany({
        where: { employeeId, payrollPeriodId: periodId, deletedAt: null },
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