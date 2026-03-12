import { prisma } from "../util/prisma.util";

export async function createTimeLog(
    employeeNo: number,
    selfieBuffer: Buffer,
    latitude: number,
    longitude: number
) {

    const getDistanceInMeters = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371e3;
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const now = new Date();
    const logDate = now.toISOString().split("T")[0];

    const employee = await prisma.employee.findFirst({
        where: { employeeNo, deletedAt: null }
    });

    if (!employee) throw new Error("Employee not found");

    const employeeShift = await prisma.employeeShift.findFirst({
        where: { employeeId: employee.id },
        include: { shift: true }
    });

    if (!employeeShift) throw new Error("Shift not assigned");

    const shift = employeeShift.shift;

    const site: any = await prisma.site.findUnique({
        where: { id: employee.siteId }
    });

    if (site.latitude == null || site.longitude == null || site.radius == null) {
        throw new Error("Site coordinates or radius are not configured.");
    }

    const distanceFromSite = getDistanceInMeters(
        latitude,
        longitude,
        site.latitude,
        site.longitude
    );

    if (distanceFromSite > site.radius) {
        throw new Error(
            `Outside allowed radius (${Math.round(distanceFromSite)}m)`
        );
    }

    let dtr = await prisma.dTR.findUnique({
        where: {
            employeeId_workDate: {
                employeeId: employee.id,
                workDate: logDate
            }
        }
    });

    let logType: "IN" | "OUT" = "IN";

    if (dtr?.timeIn && !dtr.timeOut) logType = "OUT";
    else if (dtr?.timeIn && dtr?.timeOut)
        throw new Error("Already clocked IN and OUT today");

    const base64Image = selfieBuffer.toString("base64");

    const timeLog = await prisma.timeLog.create({
        data: {
            employeeId: employee.id,
            type: logType,
            loggedAt: now,
            logDate,
            selfie: base64Image,
            latitude,
            longitude,
            siteId: employee.siteId
        }
    });

    dtr = await prisma.dTR.upsert({
        where: {
            employeeId_workDate: {
                employeeId: employee.id,
                workDate: logDate
            }
        },
        update: {
            timeIn: logType === "IN" ? now : dtr?.timeIn,
            timeOut: logType === "OUT" ? now : dtr?.timeOut
        },
        create: {
            employeeId: employee.id,
            workDate: logDate,
            timeIn: logType === "IN" ? now : undefined,
            timeOut: logType === "OUT" ? now : undefined,
            status: "PENDING",
            siteId: employee.siteId
        }
    });

    const [leave, ob, restDay, holiday] = await Promise.all([
        prisma.leaveRequest.findFirst({
            where: {
                employeeId: employee.id,
                status: "APPROVED",
                fromDate: { lte: logDate },
                toDate: { gte: logDate }
            }
        }),
        prisma.officialBusiness.findFirst({
            where: {
                employeeId: employee.id,
                status: "APPROVED",
                workDate: logDate
            }
        }),
        prisma.restDay.findFirst({
            where: {
                employeeId: employee.id,
                restDate: new Date(logDate)
            }
        }),
        prisma.holidayType.findFirst({
            where: {
                holidayDate: new Date(logDate),
                deletedAt: null
            }
        })
    ]);

    let status = "PRESENT";

    if (leave) status = "LEAVE";
    else if (ob) status = "OB";
    else if (restDay) status = "RESTDAY";
    else if (holiday) status = "HOLIDAY";

    if (logType === "OUT" && shift.startTime && shift.endTime) {

        const shiftStart = new Date(`${logDate}T${shift.startTime}:00`);
        let shiftEnd = new Date(`${logDate}T${shift.endTime}:00`);

        if (shiftEnd < shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);

        const timeIn = dtr.timeIn ?? shiftStart;
        const timeOut = dtr.timeOut ?? shiftEnd;

        const lateMinutes = Math.max(
            0,
            Math.floor((timeIn.getTime() - shiftStart.getTime()) / 60000) -
            shift.graceMinutes
        );

        const undertimeMinutes = Math.max(
            0,
            Math.floor((shiftEnd.getTime() - timeOut.getTime()) / 60000)
        );

        const overtimeMinutes = Math.max(
            0,
            Math.floor((timeOut.getTime() - shiftEnd.getTime()) / 60000)
        );

        await prisma.dTR.update({
            where: {
                employeeId_workDate: {
                    employeeId: employee.id,
                    workDate: logDate
                }
            },
            data: {
                lateMinutes,
                undertimeMinutes,
                overtimeMinutes,
                status
            }
        });
    }

    return {
        ...timeLog,
        selfie: `data:image/jpeg;base64,${base64Image}`
    };
}

export async function getTimelogsBySiteIdService(siteId: number, dateFrom: string, dateTo: string) {
    const result = await prisma.timeLog.findMany({
        where: { siteId, logDate: { gte: dateFrom, lte: dateTo } },
    });

    return result;
}