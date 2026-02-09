import { prisma } from "../util/prisma.util";

interface GettDTRFilter {
    employeeId: number;
    startDate: string;
    endDate: string;
}

export async function getDTRDateRange(filter: GettDTRFilter) {
    const { employeeId, startDate, endDate } = filter;

    const employees = employeeId
        ? await prisma.employee.findMany({ where: { id: employeeId, deletedAt: null } })
        : await prisma.employee.findMany();

    const result: any[] = [];

    for (const emp of employees) {
        const dtrs = await prisma.dTR.findMany({
            where: {
                employeeId: emp.id,
                workDate: { gte: startDate, lte: endDate },
            },
            orderBy: { workDate: "asc" },
        });

        const timelogs = await prisma.timeLog.findMany({
            where: {
                employeeId: emp.id,
                logDate: { gte: startDate, lte: endDate },
            },
            orderBy: { loggedAt: "asc" },
        });

        const shiftAssignment = await prisma.employeeShift.findFirst({
            where: { employeeId: emp.id },
            include: { shift: true },
        });
        const shift = shiftAssignment?.shift;

        const otRequests = await prisma.overtimeRequest.findMany({
            where: {
                employeeId: emp.id,
                status: "APPROVED",
                workDate: { gte: startDate, lte: endDate },
            },
        });

        const obRequests = await prisma.officialBusiness.findMany({
            where: {
                employeeId: emp.id,
                status: "APPROVED",
                workDate: { gte: startDate, lte: endDate },
            },
        });

        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                employeeId: emp.id,
                status: "APPROVED",
                fromDate: { lte: endDate },
                toDate: { gte: startDate },
            },
        });

        const restDays = await prisma.restDay.findMany({
            where: { employeeId: emp.id },
        });

        const holidays = await prisma.holidayType.findMany({
            where: {
                holidayDate: { gte: new Date(startDate), lte: new Date(endDate) },
            },
        });

        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const workDate = d.toISOString().split("T")[0];

            let dtr = dtrs.find((dtr) => dtr.workDate === workDate);

            if (!dtr) {
                dtr = await prisma.dTR.create({
                    data: {
                        employeeId: emp.id,
                        workDate,
                        status: "PENDING",
                    },
                });
            }

            const dayOfWeek = d.getDay();

            const isRestDay = restDays.some((r) => r.dayOfWeek === dayOfWeek);
            const holiday = holidays.find(
                (h) => h.holidayDate.toISOString().split("T")[0] === workDate
            );
            const leave = leaveRequests.find(
                (l) => l.fromDate <= workDate && l.toDate >= workDate
            );
            const ob = obRequests.find((o) => o.workDate === workDate);
            const ot = otRequests.find((o) => o.workDate === workDate);

            let lateMinutes = dtr.lateMinutes;
            let undertimeMinutes = dtr.undertimeMinutes;
            let overtimeMinutes = dtr.overtimeMinutes;
            let status = "PENDING";

            if (leave) status = "LEAVE";
            else if (ob) status = "OB";
            else if (isRestDay) status = "RESTDAY";
            else if (holiday) status = holiday.type;

            if (shift && dtr.timeIn && dtr.timeOut) {
                const shiftStart = new Date(`${workDate}T${shift.startTime}:00`);
                let shiftEnd = new Date(`${workDate}T${shift.endTime}:00`);
                if (shiftEnd < shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);

                lateMinutes = Math.max(0, Math.floor((dtr.timeIn.getTime() - shiftStart.getTime()) / 60000) - shift.graceMinutes);
                undertimeMinutes = Math.max(0, Math.floor((shiftEnd.getTime() - dtr.timeOut.getTime()) / 60000));
                overtimeMinutes = Math.max(0, Math.floor((dtr.timeOut.getTime() - shiftEnd.getTime()) / 60000));
                status = "PRESENT"
            }

            result.push({
                employee: emp,
                workDate,
                dtr: {
                    ...dtr,
                    lateMinutes,
                    undertimeMinutes,
                    overtimeMinutes,
                    status,
                },
                shift,
                timelogs: timelogs.filter((t) => t.logDate === workDate),
                leave,
                ob,
                ot,
                isRestDay,
                holiday,
            });
        }
    }

    return result;
}