import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import pg from "pg";
import "dotenv/config";
import { addDays } from 'date-fns';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    const password = await bcrypt.hash("admin123", 10);

    const adminRole = await prisma.role.upsert({
        where: { roleName: "ADMIN" },
        update: {},
        create: {
            roleName: "ADMIN"
        }
    });

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@hris.local" },
        update: {},
        create: {
            email: "admin@hris.local",
            password,
            roleId: adminRole.id
        }
    });

    const createdBy = adminUser.id;

    const site = await prisma.site.upsert({
        where: { siteName: "Main Office" },
        update: {},
        create: {
            siteName: "Main Office",
            latitude: 14.5995,
            longitude: 120.9842,
            radius: 100,
            createdBy
        }
    });

    const department = await prisma.department.upsert({
        where: { departmentName: "Human Resources" },
        update: {},
        create: {
            departmentName: "Human Resources",
            siteId: site.id,
            createdBy
        }
    });

    const position = await prisma.position.upsert({
        where: { positionName: "HR Manager" },
        update: {},
        create: {
            positionName: "HR Manager",
            departmentId: department.id,
            createdBy
        }
    });

    const employment = await prisma.employmentType.upsert({
        where: { employmentType: "Regular" },
        update: {},
        create: {
            employmentType: "Regular",
            createdBy
        }
    });

    const shift = await prisma.shift.upsert({
        where: { shiftName: "Day Shift" },
        update: {},
        create: {
            shiftName: "Day Shift",
            startTime: "08:00",
            endTime: "17:00"
        }
    });

    await prisma.leaveType.createMany({
        skipDuplicates: true,
        data: [
            { leaveName: "Vacation Leave", createdBy },
            { leaveName: "Sick Leave", createdBy },
            { leaveName: "Emergency Leave", createdBy }
        ]
    });

    const employee = await prisma.employee.create({
        data: {
            employeeNo: 1001,
            firstName: "System",
            lastName: "Admin",
            birthDate: new Date("1990-01-01"),
            email: "admin@hris.local",
            contactNo: "09123456789",
            positionId: position.id,
            departmentId: department.id,
            siteId: site.id,
            employmentId: employment.id,
            dateHired: new Date(),
            userId: adminUser.id,
            basicSalary: 20000
        }
    });

    const startDate = new Date('2026-02-01');
    const endDate = new Date('2026-02-05');
    const schedules = [];

    for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
        schedules.push({
            employeeId: employee.id,
            shiftId: shift.id,
            workDate: new Date(d)
        });
    }

    await prisma.employeeShift.createMany({
        data: schedules,
        skipDuplicates: true
    });

    await prisma.holidayType.createMany({
        data: [
            {
                holidayName: "New Year's Day",
                holidayDate: new Date("2026-01-01"),
                siteId: site.id,
                createdBy,
                type: "REGULAR"
            },
            {
                holidayName: "EDSA Revolution Anniversary",
                holidayDate: new Date("2026-02-25"),
                siteId: site.id,
                createdBy,
                type: "SPECIAL"
            }
        ],
        skipDuplicates: true
    });

    await prisma.restDay.upsert({
        where: {
            employeeId_dayOfWeek: {
                employeeId: employee.id,
                dayOfWeek: 0
            }
        },
        update: {},
        create: {
            employeeId: employee.id,
            dayOfWeek: 0
        }
    });

    const leaveTypes = await prisma.leaveType.findMany();

    for (const lt of leaveTypes) {
        await prisma.leaveBalance.upsert({
            where: {
                employeeId_leaveTypeId_year: {
                    employeeId: employee.id,
                    leaveTypeId: lt.id,
                    year: 2026
                }
            },
            update: {},
            create: {
                employeeId: employee.id,
                leaveTypeId: lt.id,
                totalDays: 10,
                usedDays: 0,
                remainingDays: 10,
                year: 2026
            }
        });
    }

    const vacationLeave = leaveTypes.find(
        (l) => l.leaveName === "Vacation Leave"
    );

    if (vacationLeave) {
        await prisma.leaveRequest.create({
            data: {
                employeeId: employee.id,
                leaveTypeId: vacationLeave.id,
                fromDate: "2026-02-03",
                toDate: "2026-02-03",
                totalDays: 1,
                reason: "Personal matters",
                status: "APPROVED",
                createdBy: employee.userId!,
                approverId: adminUser.id,
                approvedAt: new Date(),
                remarks: "Approved"
            }
        });

        await prisma.leaveBalance.update({
            where: {
                employeeId_leaveTypeId_year: {
                    employeeId: employee.id,
                    leaveTypeId: vacationLeave.id,
                    year: 2026
                }
            },
            data: {
                usedDays: 1,
                remainingDays: {
                    decrement: 1
                }
            }
        });
    }

    await prisma.overtimeRequest.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-02-04",
            startTime: "17:00",
            endTime: "19:00",
            totalMinutes: 120,
            reason: "Payroll preparation",
            status: "APPROVED",
            createdBy: employee.userId!,
            approverId: adminUser.id,
            approvedAt: new Date(),
            remarks: "Approved OT"
        }
    });

    await prisma.officialBusiness.create({
        data: {
            employeeId: employee.id,
            workDate: "2026-02-05",
            startTime: "10:00",
            endTime: "15:00",
            purpose: "Client meeting",
            status: "APPROVED",
            createdBy: employee.userId!,
            approverId: adminUser.id,
            approvedAt: new Date(),
            remarks: "Approved OB"
        }
    });

    await prisma.govContribution.createMany({
        data: [
            { type: "SSS", minSalary: 1000, maxSalary: 50000, employeeShare: 0.045, employerShare: 0.085 },
            { type: "PHILHEALTH", minSalary: 10000, maxSalary: 100000, employeeShare: 0.02, employerShare: 0.02 },
            { type: "PAGIBIG", minSalary: 1500, maxSalary: 50000, employeeShare: 0.02, employerShare: 0.02 }
        ]
    });

    console.log("✅ Seed completed successfully!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });