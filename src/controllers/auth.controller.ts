import { Request, Response } from "express";
import { login, logout, refreshToken } from "../services/auth.services";
import { AuthRequest } from "../middleware/auth.middleware";

export const loginController = async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({
        code: 400,
        message: "Bad request"
    });

    const { email, password } = req.body;

    try {
        const data = await login(email, password);

        // await createAuditLogs({
        //     userId: data.user.id,
        //     action: 'login',
        //     tableName: 'User',
        //     recordId: data.user.id,
        //     before: await req.body,
        //     after: data,
        // })

        res.status(200).json({
            code: 200,
            message: 'Success',
            data
        })
    } catch (err: any) {
        res.status(500).json({
            code: 500,
            message: err.message || 'Internal Server Error'
        })
    }
};

export const refreshController = async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({
        code: 400,
        message: "Bad request"
    });

    try {
        const { token } = req.body
        const data = await refreshToken(token)
        res.status(200).json({
            code: 200,
            message: 'Logged in successfully',
            data
        })
    } catch (err: any) {
        res.status(500).json({
            code: 500,
            message: err.message || 'Internal Server Error'
        })
    }
}

export const logoutController = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(400).json({
            code: 400,
            message: "No user found"
        });
    }

  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            code: 401,
            message: "No token provided"
        });
    }

    const user = req.user
    if (!user) {
        return res.status(500).json({
            code: 500,
            message: "Invalid session"
        })
    }

    await logout(user.id, token);
    res.status(200).json({
        code: 200,
        message: "Logged out successfully"
    })
  } catch (err: any) {
    res.status(500).json({
        code: 500,
        message: err.message || 'Internal Server Error'
    })
  }
}