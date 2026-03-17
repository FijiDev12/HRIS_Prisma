import { prisma } from "../util/prisma.util";

interface GettDTRFilter {
    employeeId: number;
    startDate: string;
    endDate: string;
}

// export async function getDTRDateRange(filter: GettDTRFilter) {
//     const { employeeId, startDate, endDate } = filter;

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const employees = await prisma.employee.findMany({
//         where: {
//             deletedAt: null,
//             ...(employeeId && { id: employeeId }),
//         },
//     });

//     const employeeIds = employees.map((e) => e.id);

//     const [dtrs, timelogs, shifts, otRequests, obRequests, leaveRequests, restDays, holidays] =
//         await Promise.all([
//             prisma.dTR.findMany({
//                 where: {
//                     employeeId: { in: employeeIds },
//                     workDate: { gte: startDate, lte: endDate },
//                 },
//             }),

//             prisma.timeLog.findMany({
//                 where: {
//                     employeeId: { in: employeeIds },
//                     logDate: { gte: startDate, lte: endDate },
//                 },
//                 orderBy: { loggedAt: "asc" },
//             }),

//             prisma.employeeShift.findMany({
//                 where: { employeeId: { in: employeeIds } },
//                 include: { shift: true },
//             }),

//             prisma.overtimeRequest.findMany({
//                 where: {
//                     employeeId: { in: employeeIds },
//                     status: "APPROVED",
//                     workDate: { gte: startDate, lte: endDate },
//                 },
//             }),

//             prisma.officialBusiness.findMany({
//                 where: {
//                     employeeId: { in: employeeIds },
//                     status: "APPROVED",
//                     workDate: { gte: startDate, lte: endDate },
//                 },
//             }),

//             prisma.leaveRequest.findMany({
//                 where: {
//                     employeeId: { in: employeeIds },
//                     status: "APPROVED",
//                     fromDate: { lte: endDate },
//                     toDate: { gte: startDate },
//                 },
//             }),

//             prisma.restDay.findMany({
//                 where: {
//                     employeeId: { in: employeeIds },
//                     restDate: { gte: start, lte: end },
//                 },
//             }),

//             prisma.holidayType.findMany({
//                 where: {
//                     holidayDate: { gte: start, lte: end },
//                 },
//             }),
//         ]);

//     const result: any[] = [];

//     for (const emp of employees) {
//         const shift = shifts.find((s) => s.employeeId === emp.id)?.shift;

//         for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//             const workDate = d.toISOString().split("T")[0];

//             let dtr =
//                 dtrs.find((x) => x.employeeId === emp.id && x.workDate === workDate) ??
//                 null;

//             const employeeLogs = timelogs.filter(
//                 (t) => t.employeeId === emp.id && t.logDate === workDate
//             );

//             const leave = leaveRequests.find(
//                 (l) =>
//                     l.employeeId === emp.id &&
//                     new Date(l.fromDate) <= d &&
//                     new Date(l.toDate) >= d
//             );

//             const ob = obRequests.find(
//                 (o) => o.employeeId === emp.id && o.workDate === workDate
//             );

//             const ot = otRequests.find(
//                 (o) => o.employeeId === emp.id && o.workDate === workDate
//             );

//             const rest = restDays.find(
//                 (r) =>
//                     r.employeeId === emp.id &&
//                     r.restDate.toISOString().split("T")[0] === workDate
//             );

//             const holiday = holidays.find(
//                 (h) =>
//                     h.holidayDate.toISOString().split("T")[0] === workDate
//             );

//             let lateMinutes = 0;
//             let undertimeMinutes = 0;
//             let overtimeMinutes = 0;
//             let status = "ABSENT";

//             if (leave) status = "LEAVE";
//             else if (ob) status = "OB";
//             else if (rest) status = "RESTDAY";
//             else if (holiday) status = holiday.type;

//             if (shift && dtr?.timeIn && dtr?.timeOut) {
//                 const shiftStart = new Date(`${workDate}T${shift.startTime}:00`);
//                 let shiftEnd = new Date(`${workDate}T${shift.endTime}:00`);

//                 if (shiftEnd < shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);

//                 lateMinutes = Math.max(
//                     0,
//                     Math.floor((dtr.timeIn.getTime() - shiftStart.getTime()) / 60000) -
//                     shift.graceMinutes
//                 );

//                 undertimeMinutes = Math.max(
//                     0,
//                     Math.floor((shiftEnd.getTime() - dtr.timeOut.getTime()) / 60000)
//                 );

//                 overtimeMinutes = Math.max(
//                     0,
//                     Math.floor((dtr.timeOut.getTime() - shiftEnd.getTime()) / 60000)
//                 );

//                 status = "PRESENT";
//             }

//             result.push({
//                 employee: emp,
//                 workDate,
//                 shift,
//                 timelogs: employeeLogs,
//                 leave,
//                 ob,
//                 ot,
//                 holiday,
//                 isRestDay: !!rest,
//                 dtr: {
//                     ...dtr,
//                     lateMinutes,
//                     undertimeMinutes,
//                     overtimeMinutes,
//                     status,
//                 },
//             });
//         }
//     }

//     return result;
// }

export async function getDTRBySiteIdService(siteId: number, dateFrom: string, dateTo: string) {
    const result = await prisma.dTR.findMany({
        where: { siteId, workDate: { gte: dateFrom, lte: dateTo } },
    });

    return result;
}

function timeToDate(workDate: string, time?: string) {
    if (!time) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(workDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export async function getDTRDateRange(filter: GettDTRFilter) {
    const { employeeId, startDate, endDate } = filter;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const employees = await prisma.employee.findMany({
        where: { deletedAt: null, ...(employeeId && { id: employeeId }) },
    });
    const employeeIds = employees.map((e) => e.id);

    const [
        dtrs,
        timelogs,
        shifts,
        otRequests,
        obRequests,
        leaveRequests,
        restDays,
        holidays,
    ] = await Promise.all([
        prisma.dTR.findMany({
            where: { employeeId: { in: employeeIds }, workDate: { gte: String(start), lte: String(end) } },
        }),
        prisma.timeLog.findMany({
            where: { employeeId: { in: employeeIds }, logDate: { gte: String(start), lte: String(end) } },
            orderBy: { loggedAt: "asc" },
        }),
        prisma.employeeShift.findMany({
            where: { employeeId: { in: employeeIds } },
            include: { shift: { include: { breaks: true } } },
        }),
        prisma.overtimeRequest.findMany({
            where: { employeeId: { in: employeeIds }, status: "APPROVED", workDate: { gte: String(start), lte: String(end) } },
        }),
        prisma.officialBusiness.findMany({
            where: { employeeId: { in: employeeIds }, status: "APPROVED", workDate: { gte: String(start), lte: String(end) } },
        }),
        prisma.leaveRequest.findMany({
            where: {
                employeeId: { in: employeeIds },
                status: "APPROVED",
                fromDate: { lte: String(end) },
                toDate: { gte: String(start) },
            },
        }),
        prisma.restDay.findMany({
            where: { employeeId: { in: employeeIds }, restDate: { gte: start, lte: end } },
        }),
        prisma.holidayType.findMany({ where: { holidayDate: { gte: start, lte: end } } }),
    ]);

    const result: any[] = [];

    for (const emp of employees) {
        const empShift = shifts.find((s) => s.employeeId === emp.id)?.shift;

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const workDate = d.toISOString().split("T")[0];

            const dtr = dtrs.find(
                (x) => x.employeeId === emp.id && x.workDate === workDate
            ) ?? null;

            const employeeLogs = timelogs.filter(
                (t) => t.employeeId === emp.id && t.logDate === workDate
            );

            const leave = leaveRequests.find(
                (l) => l.employeeId === emp.id && new Date(l.fromDate) <= d && new Date(l.toDate) >= d
            );

            const ob = obRequests.find((o) => o.employeeId === emp.id && o.workDate === workDate);

            const ot = otRequests.find((o) => o.employeeId === emp.id && o.workDate === workDate);

            const rest = restDays.find((r) => r.employeeId === emp.id && r.restDate.toISOString().split("T")[0] === workDate);

            const holiday = holidays.find((h) => h.holidayDate.toISOString().split("T")[0] === workDate);

            let status = "ABSENT";
            if (leave) status = "LEAVE";
            else if (ob) status = "OB";
            else if (rest) status = "RESTDAY";
            else if (holiday) status = holiday.type;

            if (rest && ot) status = "PRESENT";

            let lateMinutes = 0;
            let undertimeMinutes = 0;
            let overtimeMinutes = 0;

            if (empShift && dtr?.timeIn && dtr?.timeOut) {
                const shiftStart = timeToDate(workDate, String(empShift.startTime));
                let shiftEnd = timeToDate(workDate, String(empShift.endTime));
                if (shiftStart && shiftEnd && shiftEnd < shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);

                let totalBreakMinutes = 0;
                if (empShift.breaks?.length) {
                    totalBreakMinutes = empShift.breaks.reduce((sum, b) => {
                        if (b.isFlexible) return sum + (b.duration || 0);
                        const bStart = timeToDate(workDate, String(b.startTime));
                        const bEnd = timeToDate(workDate, String(b.endTime));
                        if (bStart && bEnd) {
                            let diff = (bEnd.getTime() - bStart.getTime()) / 60000;
                            if (diff < 0) diff += 24 * 60;
                            return sum + diff;
                        }
                        return sum;
                    }, 0);
                }

                lateMinutes = Math.max(
                    0,
                    Math.floor((dtr.timeIn.getTime() - (shiftStart?.getTime() ?? 0)) / 60000) - (empShift.graceMinutes ?? 0)
                );

                undertimeMinutes = Math.max(
                    0,
                    Math.floor(((shiftEnd?.getTime() ?? 0) - dtr.timeOut.getTime()) / 60000) - totalBreakMinutes
                );

                overtimeMinutes = Math.max(
                    0,
                    Math.floor((dtr.timeOut.getTime() - (shiftEnd?.getTime() ?? 0)) / 60000)
                );

                status = "PRESENT";
            }

            result.push({
                employee: emp,
                workDate,
                shift: empShift,
                timelogs: employeeLogs,
                leave,
                ob,
                ot,
                holiday,
                isRestDay: !!rest,
                dtr: {
                    ...dtr,
                    lateMinutes,
                    undertimeMinutes,
                    overtimeMinutes,
                    status,
                },
            });
        }
    }

    return result;
}