import { Request, Response } from "express";
import { 
    approveLeaveRequestService,
    createLeaveBalanceService,
    createLeaveReqService,
    createLeaveService, 
    deleteLeaveBalanceService, 
    deleteLeaveService, 
    getLeaveBalanceByIdService, 
    getLeaveBalanceService, 
    getLeaveByIdService, 
    getLeaveRequestByEmpIdService, 
    getLeaveRequestService, 
    getLeavesService, 
    rejectLeaveRequestService, 
    updateLeaveBalanceService, 
    updateLeaveService 
} from "../services/leave.services";

export const getLeavesController = async (_:Request, res: Response) => {
    try {
        const result = await getLeavesService();
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

export const getLeaveByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await getLeaveByIdService(Number(id));
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

export const createLeaveController = async (req: Request, res: Response) => {
    const { leaveName, createdBy } = await req.body;
    if(!leaveName || !createdBy) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createLeaveService(req.body);
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

export const updateLeaveController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { leaveName, createdBy } = await req.body;
    if(!leaveName || !createdBy) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await updateLeaveService(Number(id), req.body);
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

export const deleteLeaveController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteLeaveService(Number(id));
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

export const getLeaveRequestController = async (_:Request, res: Response) => {
    try {
        const result = await getLeaveRequestService();
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

export const getLeaveRequestByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await getLeaveRequestByEmpIdService(Number(id));
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

export const createLeaveRequestController = async (req: Request, res: Response) => {
    const { employeeId, leaveTypeId, fromDate, toDate, totalDays, reason, createdBy } = await req.body;
    if(!employeeId || !leaveTypeId || !fromDate || !toDate || !totalDays || !reason || !createdBy) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createLeaveReqService(req.body);
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

export const approveLeaveRequestController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { approverId, remarks } = await req.body;
    if(!approverId || !remarks) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await approveLeaveRequestService(Number(id), req.body);
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

export const rejectLeaveRequestController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { approverId, remarks } = await req.body;
    if(!approverId || !remarks) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await rejectLeaveRequestService(Number(id), req.body);
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

export const getLeaveBalanceController = async (_:Request, res: Response) => {
    try {
        const result = await getLeaveBalanceService();
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

export const getLeaveBalanceByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await getLeaveBalanceByIdService(Number(id));
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

export const createLeaveBalanceController = async (req: Request, res: Response) => {
    const { employeeId, leaveTypeId, totalDays, remainingDays } = await req.body;
    if(!employeeId || !leaveTypeId || !totalDays || !remainingDays) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createLeaveBalanceService(req.body);
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

export const updateLeaveBalanceController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { leaveTypeId, totalDays, remainingDays } = await req.body;
    if(!leaveTypeId || !totalDays || !remainingDays) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await updateLeaveBalanceService(Number(id), req.body);
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

export const deleteLeaveBalanceController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteLeaveBalanceService(Number(id));
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