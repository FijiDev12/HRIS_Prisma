import { Request, Response } from "express";
import { createTimeLog } from "../services/timeLog.services";

export const createTimeLogController = async (req: Request, res: Response) => {
    const { employeeNo } = await req.body;
    if(!employeeNo) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await createTimeLog(req.body);
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