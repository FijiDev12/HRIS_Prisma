import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function rbacMiddleware(roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(404).json({
            code: 404,
            message: 'User not found'
        })
        if (!roles.includes(req.user.role.name)) return res.status(403).json({
            code: 403,
            message: 'Forbidden'
        })
        next();
    }
}
