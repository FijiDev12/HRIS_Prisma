import { Request, Response } from "express";
import { createTimeLog, getTimelogsBySiteIdService } from "../services/timeLog.services";

export const createTimeLogController = async (req: Request, res: Response) => {
    const { employeeNo, latitude, longitude } = await req.body;
    const selfie = req.file;

    if (!employeeNo || !selfie || !latitude || !longitude) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createTimeLog(Number(employeeNo), selfie.buffer, Number(latitude), Number(longitude));
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

export const getTimelogsBySiteIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { dateFrom, dateTo } = req.query;

    console.log(req.query)
    if (!id || isNaN(id) || !dateFrom || !dateTo) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await getTimelogsBySiteIdService(Number(id), String(dateFrom), String(dateTo));
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