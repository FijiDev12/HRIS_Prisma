import { prisma } from "../src/util/prisma.util";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 FULL SYSTEM SEED STARTED");
    const password = await bcrypt.hash("admin123", 10);

    const adminRole = await prisma.role.upsert({
        where: { roleName: "Admin" },
        update: {},
        create: { roleName: "Admin" },
    });

    const employeeRole = await prisma.role.upsert({
        where: { roleName: "Employee" },
        update: {},
        create: { roleName: "Employee" },
    });

    const site = await prisma.site.upsert({
        where: { siteName: "Head Office" },
        update: {},
        create: {
            siteName: "Head Office",
            createdBy: 1,
        },
    });

    const dept = await prisma.department.upsert({
        where: { departmentName: "IT" },
        update: {},
        create: { departmentName: "IT", siteId: site.id, createdBy: 1 },
    });

    const devPosition = await prisma.position.upsert({
        where: { positionName: "Developer" },
        update: {},
        create: { positionName: "Developer", departmentId: dept.id, createdBy: 1 },
    });

    const regular = await prisma.employmentType.upsert({
        where: { employmentType: "Regular" },
        update: {},
        create: { employmentType: "Regular", createdBy: 1 },
    });

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            password: password,
            roleId: adminRole.id,
        },
    });

    const employee = await prisma.employee.create({
        data: {
            employeeNo: 1001,
            firstName: "System",
            lastName: "Admin",
            birthDate: new Date("1990-01-01"),
            email: "admin@hris.local",
            contactNo: "09123456789",
            positionId: devPosition.id,
            departmentId: dept.id,
            siteId: site.id,
            employmentId: regular.id,
            dateHired: new Date(),
            userId: adminUser.id,
            basicSalary: 20000
        },
    });

    const payrollPeriod = await prisma.payrollPeriod.create({
        data: {
            startDate: new Date("2026-03-01"),
            endDate: new Date("2026-03-15"),
            siteId: site.id,
        },
    });

    const payroll = await prisma.payroll.create({
        data: {
            employeeId: employee.id,
            payrollPeriodId: payrollPeriod.id,
            basicSalary: employee.basicSalary,
            grossPay: 0,
            netPay: 0,
            totalAllowance: 0,
            totalDeduction: 0,
        },
    });

    const dtr1 = await prisma.dTR.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-03-01",
            timeIn: new Date("2026-03-01T08:00:00.000Z"),
            timeOut: new Date("2026-03-01T17:00:00.000Z"),
            lateMinutes: 5,
            overtimeMinutes: 30,
            undertimeMinutes: 0,
            status: "APPROVED",
            payrollId: payroll.id,
            siteId: employee.siteId,
        },
    });

    const dtr2 = await prisma.dTR.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-03-02",
            timeIn: new Date("2026-03-02T08:10:00.000Z"),
            timeOut: new Date("2026-03-02T17:00:00.000Z"),
            lateMinutes: 10,
            overtimeMinutes: 0,
            undertimeMinutes: 0,
            status: "APPROVED",
            payrollId: payroll.id,
            siteId: employee.siteId,
        },
    });

    const sss = await prisma.govContribution.create({
        data: {
            type: "SSS",
            minSalary: 1000,
            maxSalary: 20000,
            employeeShare: 500,
            employerShare: 1000,
        },
    });

    const philHealth = await prisma.govContribution.create({
        data: {
            type: "PHILHEALTH",
            minSalary: 1000,
            maxSalary: 20000,
            employeeShare: 300,
            employerShare: 600,
        },
    });

    await prisma.payrollItem.createMany({
        data: [
            {
                payrollId: payroll.id,
                type: "DEDUCTION",
                name: "SSS Contribution",
                amount: sss.employeeShare,
                govContributionId: sss.id,
            },
            {
                payrollId: payroll.id,
                type: "DEDUCTION",
                name: "PhilHealth Contribution",
                amount: philHealth.employeeShare,
                govContributionId: philHealth.id,
            },
        ],
    });

    console.log("✅ FULL SYSTEM SEED COMPLETED");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });