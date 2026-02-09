import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../util/prisma.util";
import { redis } from "../util/redis.util";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.path === "/timelogs") return next();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            code: 401,
            message: "No token provided",
        });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            code: 401,
            message: "Invalid authorization header",
        });
    }

    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const blocked = await redis.get(`bl:${tokenHash}`);

        if (blocked) {
            return res.status(401).json({
                code: 401,
                message: "Session expired",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const user = await prisma.user.findFirst({
            where: { id: decoded.id, deletedAt: null },
            include: { role: true },
        });

        if (!user) {
            return res.status(401).json({
                code: 401,
                message: "Invalid token",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).json({
                code: 401,
                message: "Access token expired",
            });
        }

        return res.status(401).json({
            code: 401,
            message: "Unauthorized",
        });
    }
};