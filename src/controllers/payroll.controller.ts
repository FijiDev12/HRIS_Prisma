import { Request, Response } from "express";
import {
    generatePayrollService,
    getPayrollByPeriodService,
    softDeletePayrollService,
    reversePayrollService,
    createPayrollPeriodService,
    postPayrollPeriodService,
    softDeletePayrollPeriodService,
} from "../services/payroll.services";

export const generatePayroll = async (req: Request, res: Response) => {
    try {
        const { employeeId, payrollPeriodId } = req.body;
        if (!employeeId || !payrollPeriodId)
            return res.status(400).json({
                code: 400,
                message: "employeeId and payrollPeriodId required"
            });

        const payroll = await generatePayrollService(employeeId, payrollPeriodId);
        return res.status(201).json({
            code: 201,
            message: "Payroll generated successfully",
            data: payroll
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};

export const getPayrollByPeriod = async (req: Request, res: Response) => {
    try {
        const { periodId } = req.params;
        const payrolls = await getPayrollByPeriodService(Number(periodId));
        return res.status(200).json({
            code: 200,
            message: "Payroll by period fetched successfully",
            data: payrolls
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};

export const softDeletePayroll = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payroll = await softDeletePayrollService(Number(id));
        return res.status(200).json({
            code: 200,
            message: "Payroll deleted successfully",
            data: payroll
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};

export const reversePayroll = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const performedBy = Number(req.body.performedBy);
        const result = await reversePayrollService(Number(id), performedBy);
        return res.status(200).json({
            code: 200,
            message: result
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};

export const createPayrollPeriod = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const period = await createPayrollPeriodService(data);
        return res.status(201).json({
            code: 201,
            message: "Payroll period created successfully",
            data: period
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};

export const postPayrollPeriod = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const performedBy = Number(req.body.performedBy);
        const result = await postPayrollPeriodService(Number(id), performedBy);
        return res.status(200).json({
            code: 200,
            message: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};

export const softDeletePayrollPeriod = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await softDeletePayrollPeriodService(Number(id));
        return res.status(200).json({
            code: 200,
            message: "Payroll period deleted successfully",
            data: result
        });
    } catch (error: any) {
        return res.status(400).json({
            code: 400,
            message: error.message
        });
    }
};