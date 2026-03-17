import { prisma } from "../src/util/prisma.util";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 FULL SYSTEM SEED STARTED");

    const password = await bcrypt.hash("admin123", 10);

    const adminRole = await prisma.role.upsert({
        where: { roleName: "ADMIN" },
        update: {},
        create: { roleName: "ADMIN" },
    });

    const employeeRole = await prisma.role.upsert({
        where: { roleName: "EMPLOYEE" },
        update: {},
        create: { roleName: "EMPLOYEE" },
    });

    const site = await prisma.site.upsert({
        where: { siteName: "Main Branch" },
        update: {},
        create: {
            siteName: "Main Branch",
            createdBy: 1,
            latitude: 14.5995,
            longitude: 120.9842,
            radius: 200,
        },
    });

    const department = await prisma.department.upsert({
        where: { departmentName: "IT Department" },
        update: {},
        create: {
            departmentName: "IT Department",
            siteId: site.id,
            createdBy: 1,
        },
    });

    const position = await prisma.position.upsert({
        where: { positionName: "Software Developer" },
        update: {},
        create: {
            positionName: "Software Developer",
            departmentId: department.id,
            createdBy: 1,
        },
    });

    const employment = await prisma.employmentType.upsert({
        where: { employmentType: "Regular" },
        update: {},
        create: {
            employmentType: "Regular",
            createdBy: 1,
        },
    });

    const user = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            password,
            roleId: adminRole.id
        },
    });

    const employee = await prisma.employee.upsert({
        where: { employeeNo: 1001 },
        update: {},
        create: {
            employeeNo: 1001,
            firstName: "System",
            lastName: "Admin",
            birthDate: new Date("1990-01-01"),
            email: "system@hris.local",
            contactNo: "09123456789",
            positionId: position.id,
            departmentId: department.id,
            siteId: site.id,
            employmentId: employment.id,
            dateHired: new Date(),
            basicSalary: 30000,
            userId: user.id,
        },
    });

    await prisma.governmentDetail.create({
        data: {
            employeeId: employee.id,
            sssNumber: "12-3456789-0",
            philHealthNo: "123456789012",
            pagIbigNo: "1234-5678-9012",
            tinNumber: "123-456-789",
        },
    });

    const shift = await prisma.shift.create({
        data: {
            shiftName: "Regular 8-5",
            startTime: "08:00",
            endTime: "17:00",
            graceMinutes: 10,
        },
    });

    await prisma.breakTime.create({
        data: {
            shiftId: shift.id,
            startTime: "12:00",
            endTime: "13:00",
            isFlexible: false
        },
    });

    // await prisma.employeeShift.create({
    //     data: {
    //         employeeId: employee.id,
    //         shiftId: shift.id,
    //         workDate: new Date("2026-03-01"),
    //     },
    // });

    await prisma.employeeShift.upsert({
        where: {
            employeeId_workDate: {
                employeeId: employee.id,
                workDate: new Date("2026-03-01"),
            },
        },
        update: {},
        create: {
            employeeId: employee.id,
            shiftId: shift.id,
            workDate: new Date("2026-03-01"),
        },
    });

    await prisma.timeLog.create({
        data: {
            employeeId: employee.id,
            type: "IN",
            loggedAt: new Date(),
            logDate: "2026-03-01",
            siteId: site.id,
        },
    });

    const dtr = await prisma.dTR.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-03-01",
            timeIn: new Date("2026-03-01T08:05:00Z"),
            timeOut: new Date("2026-03-01T17:10:00Z"),
            lateMinutes: 5,
            overtimeMinutes: 10,
            status: "APPROVED",
            siteId: site.id,
        },
    });

    const leaveType = await prisma.leaveType.upsert({
        where: { leaveName: "Vacation Leave" },
        update: {},
        create: {
            leaveName: "Vacation Leave",
            isPaid: true,
            createdBy: 1,
        },
    });

    await prisma.leaveBalance.create({
        data: {
            employeeId: employee.id,
            leaveTypeId: leaveType.id,
            totalDays: 10,
            usedDays: 0,
            remainingDays: 10,
            year: 2026,
        },
    });

    await prisma.leaveRequest.create({
        data: {
            employeeId: employee.id,
            leaveTypeId: leaveType.id,
            fromDate: "2026-04-01",
            toDate: "2026-04-02",
            totalDays: 2,
            reason: "Vacation",
            createdBy: user.id,
        },
    });

    await prisma.overtimeRequest.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-03-05",
            startTime: "17:00",
            endTime: "19:00",
            totalMinutes: 120,
            createdBy: user.id,
        },
    });

    await prisma.officialBusiness.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-03-06",
            purpose: "Client Meeting",
            createdBy: user.id,
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
        },
    });

    const sss = await prisma.govContribution.upsert({
        where: { type: "SSS" },
        update: {},
        create: {
            type: "SSS",
            minSalary: 1000,
            maxSalary: 50000,
            employeeShare: 500,
            employerShare: 1000,
        },
    });

    await prisma.payrollItem.create({
        data: {
            payrollId: payroll.id,
            type: "DEDUCTION",
            name: "SSS Contribution",
            amount: 500,
            govContributionId: sss.id,
        },
    });

    await prisma.thirteenthMonthLedger.create({
        data: {
            employeeId: employee.id,
            payrollId: payroll.id,
            year: 2026,
            amount: 2500,
        },
    });

    await prisma.auditLog.create({
        data: {
            userId: user.id,
            action: "CREATE",
            tableName: "Employee",
            recordId: employee.id,
        },
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