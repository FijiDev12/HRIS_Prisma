import { Request, Response } from "express";
import { getDTRDateRange } from "../services/dtr.services";

export const getDTRDateRangeController = async (req: Request, res: Response) => {
    const employeeId = Number(req.query.employeeId);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if(!employeeId || !startDate || !endDate) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await getDTRDateRange({ employeeId, startDate, endDate });
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