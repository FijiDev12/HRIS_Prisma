import { prisma } from "../util/prisma.util";

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
    profilePhoto?: string,
    positionId: number,
    departmentId: number,
    siteId: number,
    employmentId: number,
    dateHired: string | Date,
    userId?: number;
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

export async function createEmployeeService(data: EmployeeType) {
    const lastEmployee = await prisma.employee.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
    });

    const employeeNo = generateEmployeeNo(lastEmployee?.id);

    const result = await prisma.employee.create({
        data: {
            employeeNo,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            suffix: data.suffix,
            gender: data.gender,
            birthDate: new Date(data.birthDate),
            civilStatus: data.civilStatus ?? 'Single',
            nationality: data.nationality ?? 'Filipino',
            address: data.address,
            email: data.email,
            contactNo: data.contactNo,
            profilePhoto: data.profilePhoto,
            positionId: data.positionId,
            departmentId: data.departmentId,
            siteId: data.siteId,
            employmentId: data.employmentId,
            dateHired: new Date(data.dateHired),
            userId: data.userId,
        },
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

export async function updateEmployeeService(id: number, data: Partial<EmployeeType>) {
    const updateEmployeeData: any = {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.middleName !== undefined && { middleName: data.middleName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.suffix !== undefined && { suffix: data.suffix }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.birthDate !== undefined && { birthDate: new Date(data.birthDate) }),
        ...(data.civilStatus !== undefined && { civilStatus: data.civilStatus }),
        ...(data.nationality !== undefined && { nationality: data.nationality }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.contactNo !== undefined && { contactNo: data.contactNo }),
        ...(data.profilePhoto !== undefined && { profilePhoto: data.profilePhoto }),
        ...(data.positionId !== undefined && { positionId: data.positionId }),
        ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
        ...(data.siteId !== undefined && { siteId: data.siteId }),
        ...(data.employmentId !== undefined && { employmentId: data.employmentId }),
        ...(data.userId !== undefined && { userId: data.userId }),
    };

    const result = await prisma.employee.update({
        where: { id },
        data: updateEmployeeData
    });
    
    return result;
}

export async function deleteEmployeeService(id: number) {
    const result = await prisma.employee.update({
        where: { id },
        data: { deletedAt: new Date() }
    });

    return result;
}

export async function assignShiftToEmployee(data: any) {
    const result = await prisma.employeeShift.create({
        data: {
            employeeId: data.employeeId,
            shiftId: data.shiftId
        }
    });

    return result;
}

export async function getEmployeeShifts() {
    const result = await prisma.employeeShift.findMany({
        include: { employee: true, shift: true }
    });

    return result;
}