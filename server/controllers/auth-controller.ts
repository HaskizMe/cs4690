import { Request, Response } from "express";
import { authService } from "../services/auth-services";
import { jwtUtils } from "../utils/jwt";

export const authController = {
    // Register endpoint
    register: async (req: Request, res: Response) => {
        try {
            const { username, password, role, tenant } = req.body;

            const result = await authService.register(
                username,
                password,
                role,
                tenant
            );

            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error("Register controller error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    // Login endpoint
    login: async (req: Request, res: Response) => {
        try {
            const { username, password, tenant } = req.body;

            const result = await authService.login(username, password, tenant);

            if (result.success) {
                // Set token in response header and body
                if (result.token) {
                    res.setHeader("Authorization", `Bearer ${result.token}`);
                }
                res.status(200).json(result);
            } else {
                res.status(401).json(result);
            }
        } catch (error) {
            console.error("Login controller error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    // Logout endpoint
    logout: async (req: Request, res: Response) => {
        try {
            // In a real app, you'd clear the session/token here
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error) {
            console.error("Logout controller error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    validateToken: async (req: Request, res: Response) => {
        try {
            const token = jwtUtils.extractToken(req.headers.authorization!);
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No token provided",
                });
            }

            const decoded = jwtUtils.verifyToken(token);
            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    message: "Token is invalid or expired",
                });
            }

            res.status(200).json({
                success: true,
                message: "Token is valid",
            });
        } catch (error) {
            console.error("Validate token controller error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            const userIdToDelete = parseInt(req.params.userId);
            const requestingUserId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const requestingUserRole = req.user?.role;
            const requestingUserTenant = req.user?.tenant;

            if (
                !requestingUserId ||
                !requestingUserRole ||
                !requestingUserTenant
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Missing authentication",
                });
            }

            if (isNaN(userIdToDelete)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const result = await authService.deleteUser(
                userIdToDelete,
                requestingUserId,
                requestingUserRole,
                requestingUserTenant
            );

            if (result.success) {
                res.status(200).json(result);
            } else {
                // Determine appropriate status code based on error
                const statusCode = result.error?.includes("Unauthorized")
                    ? 403
                    : result.error?.includes("not found")
                    ? 404
                    : 400;
                res.status(statusCode).json(result);
            }
        } catch (error) {
            console.error("Delete user controller error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },
};
