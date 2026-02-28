import { Request, Response } from "express";
import {
    getAllGovContributionsService,
    createGovContributionService,
    updateGovContributionService,
    deleteGovContributionService,
    getGovContributionByIdService
} from "../services/gov.contribution.services";

export const getAllGovContributionsController = async (_: Request, res: Response) => {
    try {
        const result = await getAllGovContributionsService();
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

export const createGovContributionController = async (req: Request, res: Response) => {
    const { type, minSalary, maxSalary, employeeShare, employerShare } = await req.body;
    if (!type || !minSalary || !maxSalary || !employeeShare || !employerShare) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createGovContributionService(req.body);
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

export const updateGovContributionController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { type, minSalary, maxSalary, employeeShare, employerShare } = await req.body;
    if (!type || !minSalary || !maxSalary || !employeeShare || !employerShare) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await updateGovContributionService(Number(id), req.body);
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

export const deleteGovContributionController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteGovContributionService(Number(id));
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

export const getGovContributionByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await getGovContributionByIdService(Number(id));
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