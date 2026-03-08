import { Request, Response } from "express";
import {
    approveAttendanceCorrection,
    assignShiftToEmployee,
    bulkUploadEmployeeService,
    createAttendanceCorrection,
    createEmployeeService,
    createEmploymentStatusService,
    deleteEmployeeService,
    deleteEmploymentStatusService,
    getAttendanceCorrectionByEmployeeIdService,
    getAttendanceCorrectionByIdService,
    getAttendanceCorrectionService,
    getEmployeeByIdService,
    getEmployeeShiftByEmpId,
    getEmployeeShifts,
    getEmployeesService,
    getEmploymentStatusByIdService,
    getEmploymentStatusService,
    rejectAttendanceCorrection,
    updateEmployeeService,
    updateEmployeeSiteService,
    updateEmployeeTempPasswordService,
    updateEmploymentStatusService
} from "../services/employee.services";

export const createEmployeeController = async (req: Request, res: Response) => {
    const {
        firstName,
        lastName,
        birthDate,
        address,
        email,
        contactNo,
        positionId,
        departmentId,
        siteId,
        employmentId,
        dateHired,
        roleId,
        password
    } = req.body;

    const profilePhoto = req.file;

    const requiredFields = {
        firstName,
        lastName,
        birthDate,
        address,
        email,
        contactNo,
        positionId,
        departmentId,
        siteId,
        employmentId,
        dateHired,
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);

    if (missingFields.length > 0) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        console.log(req.body);
        console.log(profilePhoto?.buffer);
        const result = await createEmployeeService(req.body, profilePhoto?.buffer);
        res.status(201).json({
            code: 201,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}
export const updateEmployeeController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid Employee ID",
            });
        }

        const {
            firstName,
            lastName,
            birthDate,
            address,
            email,
            contactNo,
            positionId,
            departmentId,
            siteId,
            employmentId,
            dateHired,
        } = req.body;

        const profilePhoto = req.file;

        const requiredFields = {
            firstName,
            lastName,
            birthDate,
            address,
            email,
            contactNo,
            positionId,
            departmentId,
            siteId,
            employmentId,
            dateHired,
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => value === undefined || value === null || value === "")
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                code: 400,
                message: `Missing fields: ${missingFields.join(", ")}`,
            });
        }

        const result = await updateEmployeeService(
            id,
            profilePhoto?.buffer,
            req.body
        );

        return res.status(200).json({
            code: 200,
            message: "Employee updated successfully",
            data: result,
        });

    } catch (error: any) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};

export const getEmployeesController = async (_: Request, res: Response) => {
    try {
        const result = await getEmployeesService();
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getEmployeeByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await getEmployeeByIdService(Number(id));
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const deleteEmployeeController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteEmployeeService(Number(id));
        res.status(200).json({
            code: 200,
            message: 'Success'
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const assignShiftToEmployeeCont = async (req: Request, res: Response) => {
    const { employeeId, shiftId, startDate, endDate } = await req.body;
    if (!employeeId || !shiftId || !startDate || !endDate) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await assignShiftToEmployee(req.body);
        res.status(201).json({
            code: 201,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getEmployeeShiftsController = async (_: Request, res: Response) => {
    try {
        const result = await getEmployeeShifts();
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getEmployeeShiftByEmpIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    try {
        const result = await getEmployeeShiftByEmpId(Number(id));
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const createEmploymentStatusController = async (req: Request, res: Response) => {
    const { employmentType, createdBy } = await req.body;

    if (!employmentType || !createdBy) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createEmploymentStatusService(req.body);
        res.status(201).json({
            code: 201,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const updateEmploymentStatusController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { employmentType, createdBy } = await req.body;

    if (!employmentType || !createdBy) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await updateEmploymentStatusService(Number(id), req.body);
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getEmploymentStatusController = async (_: Request, res: Response) => {
    try {
        const result = await getEmploymentStatusService();
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getEmploymentStatusByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await getEmploymentStatusByIdService(Number(id));
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const deleteEmploymentStatusController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteEmploymentStatusService(Number(id));
        res.status(200).json({
            code: 200,
            message: 'Success'
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const createAttendanceCorrectionController = async (req: Request, res: Response) => {
    const { employeeNo, type, logDate, shiftId, correctedTime, reason, createdBy } = req.body;

    if (!employeeNo || !type || !logDate || !createdBy) {
        return res.status(400).json({ code: 400, message: "Missing required fields" });
    }

    try {
        const result = await createAttendanceCorrection(
            Number(employeeNo),
            type,
            logDate,
            shiftId ? Number(shiftId) : null,
            correctedTime ?? null,
            reason ?? "",
            Number(createdBy)
        );

        res.status(201).json({ code: 201, message: "Attendance correction created", data: result });
    } catch (error: any) {
        res.status(500).json({ code: 500, message: error.message || "Internal Server Error" });
    }
};

export const approveAttendanceCorrectionController = async (req: Request, res: Response) => {
    const { correctionId, approverId, remarks, siteId } = req.body;

    if (!correctionId || !approverId || !siteId) {
        return res.status(400).json({ code: 400, message: "Missing required fields" });
    }

    try {
        const result = await approveAttendanceCorrection(Number(correctionId), Number(approverId), remarks, Number(siteId));
        res.status(200).json({ code: 200, message: "Attendance correction approved", data: result });
    } catch (error: any) {
        res.status(500).json({ code: 500, message: error.message || "Internal Server Error" });
    }
};

export const rejectAttendanceCorrectionController = async (req: Request, res: Response) => {
    const { correctionId, approverId, remarks } = req.body;

    if (!correctionId || !approverId) {
        return res.status(400).json({ code: 400, message: "Missing required fields" });
    }

    try {
        const result = await rejectAttendanceCorrection(Number(correctionId), Number(approverId), remarks);
        res.status(200).json({ code: 200, message: "Attendance correction rejected", data: result });
    } catch (error: any) {
        res.status(500).json({ code: 500, message: error.message || "Internal Server Error" });
    }
};

export const getAttendanceCorrectionController = async (_: Request, res: Response) => {
    try {
        const result = await getAttendanceCorrectionService();
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getAttendanceCorrectionByEmployeeIdController = async (req: Request, res: Response) => {
    const employeeId = Number(req.params.employeeId);
    if (!employeeId || isNaN(employeeId)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await getAttendanceCorrectionByEmployeeIdService(Number(employeeId));
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const getAttendanceCorrectionByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await getAttendanceCorrectionByIdService(Number(id));
        res.status(200).json({
            code: 200,
            message: 'Success',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const updateEmployeeTempPasswordController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid Employee ID",
            });
        }

        const { tempPassword } = req.body;

        if (!tempPassword) {
            return res.status(400).json({
                code: 400,
                message: "Missing tempPassword",
            });
        }

        const result = await updateEmployeeTempPasswordService(
            id,
            req.body
        );

        return res.status(200).json({
            code: 200,
            message: "Employee temp password updated successfully",
            data: result,
        });

    } catch (error: any) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};

export const bulkUploadEmployees = async (req: Request, res: Response) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            });
        }

        const result = await bulkUploadEmployeeService(req.file.buffer);

        res.status(201).json({
            code: 201,
            message: "Bulk upload completed",
            data: result
        });

    } catch (error: any) {
        res.status(500).json({
            code: 500,
            message: error.message || "Internal Server Error"
        });

    }
};

export const updateEmployeeSiteController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid Employee ID",
            });
        }

        const { siteId } = req.body;

        if (!siteId) {
            return res.status(400).json({
                code: 400,
                message: "Missing siteId",
            });
        }

        const result = await updateEmployeeSiteService(
            id,
            siteId
        );

        return res.status(200).json({
            code: 200,
            message: "Employee site updated successfully",
            data: result,
        });

    } catch (error: any) {
        return res.status(500).json({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};