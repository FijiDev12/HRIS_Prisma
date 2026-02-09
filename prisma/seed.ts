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
            userId: adminUser.id
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