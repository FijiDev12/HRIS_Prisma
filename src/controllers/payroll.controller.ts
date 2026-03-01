import { Request, Response } from "express";
import {
    getPayrollByPeriodService,
    softDeletePayrollService,
    reversePayrollService,
    createPayrollPeriodService,
    postPayrollPeriodService,
    softDeletePayrollPeriodService,
    approvePayrollPeriodService,
    unlockPayrollService,
    generatePayrollForSiteService,
    getPayrollByEmployeeIdService,
    getPayrollAllPeriodService,
} from "../services/payroll.services";

export const generatePayroll = async (req: Request, res: Response) => {
    try {
        const { siteId, payrollPeriodId } = req.body;
        if (!siteId || !payrollPeriodId)
            return res.status(400).json({
                code: 400,
                message: "siteId and payrollPeriodId required"
            });

        const payroll = await generatePayrollForSiteService(Number(siteId), Number(payrollPeriodId));
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

export const getPayrollAllPeriod = async (req: Request, res: Response) => {
    try {
        const payrolls = await getPayrollAllPeriodService();
        return res.status(200).json({
            code: 200,
            message: "Payroll all period fetched successfully",
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

export const approvePayrollPeriod = async (req: Request, res: Response) => {
    try {
        const periodId = Number(req.params.id);
        const performedBy = Number(req.body.performedBy);

        const result = await approvePayrollPeriodService(periodId, performedBy);

        return res.status(200).json({
            code: 200,
            message: result,
        });
    } catch (err: any) {
        return res.status(400).json({
            code: 400,
            message: err.message
        });
    }
};

export const unlockPayroll = async (req: Request, res: Response) => {
    try {
        const payrollId = Number(req.params.id);

        const result = await unlockPayrollService(payrollId);

        return res.status(200).json({
            code: 200,
            message: result,
        });
    } catch (err: any) {
        return res.status(400).json({
            code: 400,
            message: err.message
        });
    }
};

export const getPayrollByEmployeeId = async (req: Request, res: Response) => {
    try {
        const { periodId, employeeId } = req.params;
        const payrolls = await getPayrollByEmployeeIdService(Number(employeeId), Number(periodId));
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