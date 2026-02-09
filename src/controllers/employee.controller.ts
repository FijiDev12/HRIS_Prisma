import { Request, Response } from "express";
import { 
    assignShiftToEmployee, 
    createEmployeeService, 
    createEmploymentStatusService, 
    deleteEmployeeService, 
    deleteEmploymentStatusService, 
    getEmployeeByIdService, 
    getEmployeeShiftByEmpId, 
    getEmployeeShifts, 
    getEmployeesService, 
    getEmploymentStatusByIdService, 
    getEmploymentStatusService, 
    updateEmployeeService, 
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
        dateHired 
    } = await req.body;

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
        dateHired
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
        const result = await createEmployeeService(req.body);
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
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
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
        dateHired 
    } = await req.body;

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
        dateHired
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
        const result = await updateEmployeeService(Number(id), req.body);
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

export const getEmployeesController = async (_:Request, res: Response) => {
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
    if(!id || isNaN(id)) {
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
    if(!id || isNaN(id)) {
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
    if(!employeeId || !shiftId || !startDate || !endDate) {
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

export const getEmployeeShiftsController = async (_:Request, res: Response) => {
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
    if(!id || isNaN(id)) {
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
    if(!id || isNaN(id)) {
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

export const getEmploymentStatusController = async (_:Request, res: Response) => {
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
    if(!id || isNaN(id)) {
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
    if(!id || isNaN(id)) {
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