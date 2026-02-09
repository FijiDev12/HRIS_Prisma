import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../util/prisma.util";
import { redis } from "../util/redis.util";

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
    user?: any
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({
            code: 401,
            message: "No token provided"
        })

        const parts = authHeader.split(" ")
        if (parts.length !== 2) return res.status(401).json({
            code: 401,
            message: "Invalid auth header"
        })
        const token = parts[1]

        const blocked = await redis.get(`bl:${token}`)
        if (blocked) return res.status(401).json({
            code: 401,
            message: "Session expired"
        })

        const decoded: any = jwt.verify(token, JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true },
        })

        if (!user) return res.status(401).json({
            code: 401,
            message: "Invalid token"
        })

        req.user = user
        next();
    } catch (err) {
        return res.status(401).json({
            code: 401,
            message: "Unauthorized"
        })
    }
}
