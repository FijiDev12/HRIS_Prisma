import { prisma } from "../util/prisma.util";

export async function createTimeLog(employeeNo: number, selfieBuffer: Buffer, latitude: number, longitude: number) {
    function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // meters
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);

        const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    const date = new Date();
    const now = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    const employee: any = await prisma.employee.findUnique({
        where: { employeeNo, deletedAt: null }
    });
    console.log(employee)

    if (!employee) throw new Error("Employee not found");
    const { id } = employee;

    const employeeShift = await prisma.employeeShift.findFirst({
        where: { employeeId: id },
        include: { shift: true }
    });
    console.log(employeeShift)

    if (!employeeShift) throw new Error("Shift not assigned for this employee");
    const { shift } = employeeShift;

    let logDate = now.toISOString().split("T")[0];

    if (shift.endTime && shift.startTime && shift.endTime < shift.startTime) {
        const [endHour, endMin] = shift.endTime.split(":").map(Number);
        if (now.getHours() < endHour || (now.getHours() === endHour && now.getMinutes() <= endMin)) {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            logDate = yesterday.toISOString().split("T")[0];
        }
    }

    let dtr = await prisma.dTR.findUnique({
        where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
    });

    let logType: "IN" | "OUT" = "IN";
    if (dtr) {
        if (!dtr.timeIn) {
            logType = "IN";
        }
        else if (!dtr.timeOut) {
            logType = "OUT";
        }
        else {
            return "Already clocked IN and OUT for today";
            // throw new Error("Already clocked IN and OUT for today");
        }
    }

    const site: any = await prisma.site.findUnique({
        where: { id: employee.siteId }
    });

    console.log(site)

    if (!site) throw new Error("Site not found");

    const distanceFromSite = getDistanceInMeters(
        latitude,
        longitude,
        site.latitude,
        site.longitude
    );

    if (distanceFromSite > site.radius) {
        return {
            message: `Cannot clock ${logType} outside ${site.siteName} radius`,
            distance: Math.round(distanceFromSite) + " meters",
            allowedRadius: site.radius
        };
    }

    const base64Image = selfieBuffer.toString("base64");

    const timeLog = await prisma.timeLog.create({
        data: { employeeId: id, type: logType, loggedAt: now, logDate, selfie: base64Image, latitude, longitude, siteId: employee.siteId },
    });

    dtr = await prisma.dTR.upsert({
        where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
        update: {
            timeIn: logType === "IN" ? now : dtr?.timeIn,
            timeOut: logType === "OUT" ? now : dtr?.timeOut,
        },
        create: {
            employeeId: id,
            workDate: logDate,
            timeIn: logType === "IN" ? now : undefined,
            timeOut: logType === "OUT" ? now : undefined,
            status: "PENDING",
            siteId: employee.siteId,
        },
    });

    const [leave, ob, restDay, holiday] = await Promise.all([
        prisma.leaveRequest.findFirst({
            where: {
                employeeId: id,
                status: "APPROVED",
                fromDate: { lte: logDate },
                toDate: { gte: logDate },
            },
        }),
        prisma.officialBusiness.findFirst({
            where: {
                employeeId: id,
                status: "APPROVED",
                workDate: logDate,
            },
        }),
        prisma.restDay.findFirst({
            where: { employeeId: id, dayOfWeek: new Date(logDate).getDay() },
        }),
        prisma.holidayType.findFirst({
            where: { holidayDate: new Date(logDate), deletedAt: null },
        }),
    ]);

    if (leave) {
        await prisma.dTR.update({
            where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
            data: { status: "LEAVE", timeIn: null, timeOut: null, lateMinutes: 0, undertimeMinutes: 0, overtimeMinutes: 0 },
        });
        return {
            ...timeLog,
            selfie: timeLog.selfie
                ? `data:image/jpeg;base64,${timeLog.selfie}`
                : null,
        };
    }

    if (ob) {
        await prisma.dTR.update({
            where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
            data: { status: "OB", lateMinutes: 0, undertimeMinutes: 0 },
        });
        return {
            ...timeLog,
            selfie: timeLog.selfie
                ? `data:image/jpeg;base64,${timeLog.selfie}`
                : null,
        };
    }

    if (restDay) {
        await prisma.dTR.update({
            where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
            data: { status: "RESTDAY", lateMinutes: 0, undertimeMinutes: 0 },
        });
        return {
            ...timeLog,
            selfie: timeLog.selfie
                ? `data:image/jpeg;base64,${timeLog.selfie}`
                : null,
        };
    }

    if (holiday) {
        await prisma.dTR.update({
            where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
            data: { status: "HOLIDAY", lateMinutes: 0, undertimeMinutes: 0 },
        });
        return {
            ...timeLog,
            selfie: timeLog.selfie
                ? `data:image/jpeg;base64,${timeLog.selfie}`
                : null,
        };
    }

    if (shift.startTime && shift.endTime && logType === "OUT") {
        const shiftStart = new Date(`${logDate}T${shift.startTime}:00`);
        let shiftEnd = new Date(`${logDate}T${shift.endTime}:00`);
        if (shiftEnd < shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);

        const timeIn = dtr.timeIn || shiftStart;
        const timeOut = dtr.timeOut || shiftEnd;

        const lateMinutes = Math.max(0, Math.floor((timeIn.getTime() - shiftStart.getTime()) / 60000) - shift.graceMinutes);
        const undertimeMinutes = Math.max(0, Math.floor((shiftEnd.getTime() - timeOut.getTime()) / 60000));
        const overtimeMinutes = Math.max(0, Math.floor((timeOut.getTime() - shiftEnd.getTime()) / 60000));

        await prisma.dTR.update({
            where: { employeeId_workDate: { employeeId: id, workDate: logDate } },
            data: { lateMinutes, undertimeMinutes, overtimeMinutes, status: "PRESENT" },
        });
    }

    return {
        ...timeLog,
        selfie: timeLog.selfie
            ? `data:image/jpeg;base64,${timeLog.selfie}`
            : null,
    };
}

export async function getTimelogsBySiteIdService(siteId: number, dateFrom: string, dateTo: string) {
    const result = await prisma.timeLog.findMany({
        where: { siteId, logDate: { gte: dateFrom, lte: dateTo } },
    });

    return result;
}