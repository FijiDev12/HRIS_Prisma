import { Request, Response } from "express";
import { 
    createHolidayService, 
    deleteHolidayService, 
    getHolidayByIdService, 
    getHolidaysService, 
    updateHolidayService 
} from "../services/holiday.services";

export const getHolidaysController = async (_:Request, res: Response) => {
    try {
        const result = await getHolidaysService();
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

export const getHolidayByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await getHolidayByIdService(Number(id));
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

export const createHolidayController = async (req: Request, res: Response) => {
    const { holidayName, holidayDate, createdBy, siteId, type } = await req.body;
    if(!holidayName || !holidayDate || !createdBy || !siteId || !type) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createHolidayService(req.body);
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

export const updateHolidayController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { holidayName, holidayDate, createdBy, siteId, type } = await req.body;
    if(!holidayName || !holidayDate || !createdBy || !siteId || !type) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await updateHolidayService(Number(id), req.body);
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

export const deleteHolidayController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteHolidayService(Number(id));
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