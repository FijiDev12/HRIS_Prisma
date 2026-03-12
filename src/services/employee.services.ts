import { hashPassword } from "../util/hash.util.";
import { prisma } from "../util/prisma.util";
import { addDays } from 'date-fns';
import * as XLSX from "xlsx";

interface EmploymentType {
    employmentType: string;
    createdBy: number;
}

interface EmployeeType {
    firstName: string,
    middleName?: string,
    lastName: string,
    suffix?: string,
    gender?: string,
    birthDate: string | Date,
    civilStatus?: string,
    nationality?: string,
    address: string,
    email: string,
    contactNo: string,
    positionId: number,
    departmentId: number,
    siteId: number,
    employmentId: number,
    dateHired: string | Date,
    userId?: number;
    basicSalary?: number;
}

export async function createEmploymentStatusService(data: EmploymentType) {
    const result = await prisma.employmentType.create({ data });

    return result;
}

export async function getEmploymentStatusService() {
    const result = await prisma.employmentType.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getEmploymentStatusByIdService(id: number) {
    const result = await prisma.employmentType.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateEmploymentStatusService(id: number, data: Partial<EmploymentType>) {
    const result = await prisma.employmentType.update({
        where: { id },
        data
    });

    return result;
}

export async function deleteEmploymentStatusService(id: number) {
    const result = await prisma.employmentType.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}

function generateEmployeeNo(lastEmployeeId?: number) {
    const year = new Date().getFullYear().toString().slice(-2);
    const lastSeq = lastEmployeeId ?? 0;
    const nextSeq = (lastSeq + 1).toString().padStart(5, '0');
    return Number(`${year}${nextSeq}`);
}

export async function createEmployeeService(
    data: EmployeeType,
    profilePhoto?: Buffer
) {
    const existingEmail = await prisma.employee.findUnique({
        where: { email: data.email },
    });

    if (existingEmail) {
        throw new Error("Email already exists");
    }

    const lastEmployee = await prisma.employee.findFirst({
        orderBy: { id: "desc" },
        select: { id: true },
    });

    const employeeNo = generateEmployeeNo(lastEmployee?.id);

    const base64Image = profilePhoto
        ? profilePhoto.toString("base64")
        : null;

    const result = await prisma.$transaction(async (tx) => {

        const employee = await tx.employee.create({
            data: {
                employeeNo,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                suffix: data.suffix,
                gender: data.gender,
                birthDate: new Date(data.birthDate),
                civilStatus: data.civilStatus ?? "Single",
                nationality: data.nationality ?? "Filipino",
                address: data.address,
                email: data.email,
                contactNo: String(data.contactNo),
                positionId: Number(data.positionId),
                departmentId: Number(data.departmentId),
                siteId: Number(data.siteId),
                employmentId: Number(data.employmentId),
                dateHired: new Date(data.dateHired),
                basicSalary: data.basicSalary ?? 0,
                ...(base64Image && { profilePhoto: base64Image }),
            },
        });

        const cleanLastName = data.lastName.replace(/\s+/g, '').toLowerCase();
        const last4Contact = data.contactNo.slice(-4);

        const user = await tx.user.create({
            data: {
                email: data.email,
                password: await hashPassword(`${cleanLastName}${last4Contact}`),
                role: {
                    connect: { id: 2 },
                },
                employeeId: employee.id,
            },
        });

        return { employee, user };
    });

    return result;
}

export async function getEmployeesService() {
    const result = await prisma.employee.findMany({
        where: { deletedAt: null }
    });

    return result;
}

export async function getEmployeeByIdService(id: number) {
    const result = await prisma.employee.findUnique({
        where: { id, deletedAt: null }
    });

    return result;
}

export async function updateEmployeeService(
    id: number,
    profilePhoto?: Buffer,
    data?: Partial<EmployeeType>
) {
    if (!data) throw new Error("No data provided");

    const check = await prisma.employee.findUnique({
        where: { id: Number(id) },
    });

    console.log("Found employee:", check);

    if (!check) {
        throw new Error("Employee not found");
    }

    const updateEmployeeData: any = {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.middleName !== undefined && { middleName: data.middleName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.suffix !== undefined && { suffix: data.suffix }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.birthDate !== undefined && { birthDate: new Date(data.birthDate) }),
        ...(data.civilStatus !== undefined && { civilStatus: data.civilStatus }),
        ...(data.nationality !== undefined && { nationality: data.nationality }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.contactNo !== undefined && { contactNo: String(data.contactNo) }),
        ...(data.positionId !== undefined && { positionId: Number(data.positionId) }),
        ...(data.departmentId !== undefined && { departmentId: Number(data.departmentId) }),
        ...(data.siteId !== undefined && { siteId: Number(data.siteId) }),
        ...(data.employmentId !== undefined && { employmentId: Number(data.employmentId) }),
        ...(data.userId !== undefined && { userId: Number(data.userId) }),
        ...(data.basicSalary !== undefined && { basicSalary: Number(data.basicSalary) }),
        ...(data.dateHired !== undefined && { dateHired: new Date(data.dateHired) }),
    };

    if (profilePhoto) {
        updateEmployeeData.profilePhoto = profilePhoto.toString("base64");
    }

    const result = await prisma.employee.update({
        where: { id: Number(id) },
        data: updateEmployeeData,
    });

    return {
        ...result,
        profilePhoto: result.profilePhoto
            ? `data:image/jpeg;base64,${result.profilePhoto}`
            : null,
    };
}

export async function deleteEmployeeService(id: number) {
    const result = await prisma.employee.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}

export async function assignShiftToEmployee(data: any) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start > end) {
        throw new Error('Start date must be before or equal to end date');
    }

    const schedules = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
        schedules.push({
            employeeId: data.employeeId,
            shiftId: data.shiftId,
            workDate: new Date(d)
        });
    }
    const result = await prisma.employeeShift.createMany({
        data: schedules,
        skipDuplicates: true
    });

    return result;
}

export async function getEmployeeShifts() {
    const result = await prisma.employeeShift.findMany({
        include: { shift: true }
        // include: { employee: true, shift: true }
    });

    return result;
}

export async function getEmployeeShiftByEmpId(id: number) {
    const result = await prisma.employeeShift.findMany({
        where: { employeeId: id },
        include: { shift: true }
    });

    return result;
}

export async function createAttendanceCorrection(
    employeeNo: number,
    type: "IN" | "OUT",
    logDate: string,
    shiftId: number | null,
    correctedTime: string | null,
    reason: string,
    createdBy: number
) {
    const employee = await prisma.employee.findUnique({
        where: { employeeNo },
    });

    if (!employee) throw new Error("Employee not found");

    const existing = await prisma.attendanceCorrection.findFirst({
        where: { employeeId: employee.id, type, logDate },
    });

    if (existing) {
        throw new Error(`${type} correction already exists for ${logDate}`);
    }

    const result = await prisma.attendanceCorrection.create({
        data: {
            employeeId: employee.id,
            type,
            logDate,
            shiftId: shiftId ?? undefined,
            correctedTime: correctedTime ?? undefined,
            reason,
            createdBy,
            status: "PENDING",
        },
    });

    return result;
}

export async function approveAttendanceCorrection(
    correctionId: number,
    approverId: number,
    remarks?: string,
    siteId?: number,
) {
    const correction = await prisma.attendanceCorrection.findUnique({
        where: { id: correctionId },
    });

    if (!correction) throw new Error("Attendance correction not found");
    if (correction.status !== "PENDING")
        throw new Error("Only pending corrections can be approved");

    const updatedCorrection = await prisma.attendanceCorrection.update({
        where: { id: correctionId },
        data: {
            status: "APPROVED",
            approverId,
            approvedAt: new Date(),
            remarks,
        },
    }); ``

    const type = correction.type === "IN" ? "IN" : "OUT";
    const correctedDateTime = correction.correctedTime
        ? new Date(`${correction.logDate}T${correction.correctedTime}:00`)
        : undefined;

    const existingTimeLog = await prisma.timeLog.findFirst({
        where: { employeeId: correction.employeeId, logDate: correction.logDate, type },
    });

    if (existingTimeLog) {
        await prisma.timeLog.update({
            where: { id: existingTimeLog.id },
            data: {
                loggedAt: correctedDateTime ?? existingTimeLog.loggedAt,
            },
        });
    } else {
        await prisma.timeLog.create({
            data: {
                employeeId: correction.employeeId,
                logDate: correction.logDate,
                type,
                loggedAt: correctedDateTime ?? new Date(),
                siteId: siteId ?? 0,
            },
        });
    }

    return updatedCorrection;
}

export async function rejectAttendanceCorrection(
    correctionId: number,
    approverId: number,
    remarks?: string
) {
    const correction = await prisma.attendanceCorrection.findUnique({
        where: { id: correctionId },
    });

    if (!correction) throw new Error("Attendance correction not found");
    if (correction.status !== "PENDING")
        throw new Error("Only pending corrections can be rejected");

    const result = await prisma.attendanceCorrection.update({
        where: { id: correctionId },
        data: {
            status: "REJECTED",
            approverId,
            approvedAt: new Date(),
            remarks,
        },
    });

    return result;
}

export async function getAttendanceCorrectionService() {
    const result = await prisma.attendanceCorrection.findMany({
        include: {
            employee: true,
            shift: true,
        }
    });

    return result;
}

export async function getAttendanceCorrectionByEmployeeIdService(employeeId: number) {
    const result = await prisma.attendanceCorrection.findMany({
        where: { employeeId },
        include: {
            employee: true,
            shift: true,
        }
    });

    return result;
}

export async function getAttendanceCorrectionByIdService(id: number) {
    const result = await prisma.attendanceCorrection.findUnique({
        where: { id },
        include: {
            employee: true,
            shift: true,
        }
    });

    return result;
}

export async function updateEmployeeTempPasswordService(id: number, data: any) {
    const result = await prisma.employee.update({
        where: { id },
        data: {
            tempPassword: data.tempPassword,
        }
    });

    return result;
}

export async function bulkUploadEmployeeService(fileBuffer: Buffer) {

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const createdEmployees: any[] = [];
    const errors: any[] = [];

    for (const row of rows) {
        try {

            const existingEmail = await prisma.employee.findUnique({
                where: { email: row.email },
            });

            if (existingEmail) {
                errors.push({
                    email: row.email,
                    message: "Email already exists",
                });
                continue;
            }

            const lastEmployee = await prisma.employee.findFirst({
                orderBy: { id: "desc" },
                select: { id: true },
            });

            const employeeNo = generateEmployeeNo(lastEmployee?.id);

            const result = await prisma.$transaction(async (tx) => {

                const employee = await tx.employee.create({
                    data: {
                        employeeNo,
                        firstName: row.firstName,
                        middleName: row.middleName,
                        lastName: row.lastName,
                        suffix: row.suffix,
                        gender: row.gender,
                        birthDate: new Date(row.birthDate),
                        civilStatus: row.civilStatus ?? "Single",
                        nationality: row.nationality ?? "Filipino",
                        address: row.address,
                        email: row.email,
                        contactNo: String(row.contactNo),
                        positionId: Number(row.positionId),
                        departmentId: Number(row.departmentId),
                        siteId: Number(row.siteId),
                        employmentId: Number(row.employmentId),
                        dateHired: new Date(row.dateHired),
                        basicSalary: Number(row.basicSalary ?? 0),
                    },
                });

                const cleanLastName = row.lastName
                    .replace(/\s+/g, "")
                    .toLowerCase();

                const last4Contact = row.contactNo.slice(-4);

                const user = await tx.user.create({
                    data: {
                        email: row.email,
                        password: await hashPassword(
                            `${cleanLastName}${last4Contact}`
                        ),
                        role: {
                            connect: { id: 2 },
                        },
                        employeeId: employee.id,
                    },
                });

                return { employee, user };
            });

            createdEmployees.push(result);

        } catch (error: any) {

            errors.push({
                email: row.email,
                message: error.message,
            });

        }
    }

    return {
        successCount: createdEmployees.length,
        errorCount: errors.length,
        createdEmployees,
        errors,
    };
}

export async function updateEmployeeSiteService(id: number, siteId: number) {
    const result = await prisma.employee.update({
        where: { id },
        data: {
            siteId
        }
    });

    return result;
}