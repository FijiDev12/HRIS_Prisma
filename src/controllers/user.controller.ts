import { Request, Response } from "express";
import { 
    createUserService, 
    deleteUserService, 
    getUserByIdService, 
    getUsersService, 
    updateUserService 
} from "../services/user.services";

export const getUsersController = async (_:Request, res: Response) => {
    try {
        const result = await getUsersService();
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

export const getUserByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }
    
    try {
        const result = await getUserByIdService(Number(id));
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

export const createUserController = async (req: Request, res: Response) => {
    const { email, password, roleId } = await req.body;
    if(!email || !password || !roleId) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await createUserService(req.body);
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

export const updateUserController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    const { email, password, roleId } = await req.body;
    if(!email || !password || !roleId) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        const result = await updateUserService(Number(id), req.body);
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

export const deleteUserController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if(!id || isNaN(id)) {
        return res.status(400).json({
            code: 400,
            message: 'Bad Request'
        });
    }

    try {
        await deleteUserService(Number(id));
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