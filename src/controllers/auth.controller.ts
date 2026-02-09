import { Request, Response } from "express";
import { login, logout, refreshToken } from "../services/auth.services";
import { AuthRequest } from "../middleware/auth.middleware";

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ 
            code: 400, 
            message: "Bad Request" 
        });
    }

    try {
        const data = await login(email, password);

        return res.status(200).json({ 
            code: 200, 
            message: "Success", 
            data 
        });
    } catch (err: any) {
        return res.status(401).json({ 
            code: 401, 
            message: err.message 
        });
    }
};

export const refreshController = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refresh_token;
        if (!token) {
            return res.status(401).json({ 
                code: 401, 
                message: "Refresh token missing" 
            });
        }

        const data = await refreshToken(token);

        return res.status(200).json({ 
            code: 200, 
            message: "Token refreshed", 
            data 
        });
    } catch (err: any) {
        return res.status(401).json({ 
            code: 401, 
            message: err.message || "Invalid refresh token" 
        });
    }
};

export const logoutController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                code: 401, 
                message: "No user found" 
            });
        }

        const accessToken = req.headers.authorization?.split(" ")[1];
        const refreshToken = req.cookies?.refresh_token;

        if (!accessToken) {
            return res.status(401).json({ 
                code: 401, 
                message: "No token provided" 
            });
        }

        await logout(req.user.id, accessToken, refreshToken);

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/auth/refresh",
        });

        return res.status(200).json({ 
            code: 200, 
            message: "Logged out successfully" 
        });
    } catch (err: any) {
        return res.status(500).json({ 
            code: 500, 
            message: err.message || "Internal Server Error" 
        });
    }
};