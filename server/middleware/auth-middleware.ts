import { Request, Response, NextFunction } from "express";
import { jwtUtils, TokenPayload } from "../utils/jwt";

// Extend Express Request to include user data
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = jwtUtils.extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "No token provided",
            });
        }

        const payload = jwtUtils.verifyToken(token);
        if (!payload) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "Invalid or expired token",
            });
        }

        // Attach user to request
        req.user = payload;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Middleware to check specific role
export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "User not authenticated",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                error: `This action requires one of these roles: ${roles.join(
                    ", "
                )}`,
            });
        }

        next();
    };
};

// Middleware to check tenant
export const requireTenant = (tenant: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "User not authenticated",
            });
        }

        if (req.user.tenant !== tenant) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                error: "You do not have access to this tenant",
            });
        }

        next();
    };
};
