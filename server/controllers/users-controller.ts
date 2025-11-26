import { Request, Response } from "express";
import { usersService } from "../services/users-service";

export const usersController = {
    // Get all users (based on role permissions)
    getUsers: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;

            if (!role || !tenant) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized: Missing authentication",
                });
            }

            const users = await usersService.getUsers(role, tenant);

            res.status(200).json({
                success: true,
                users,
            });
        } catch (error: any) {
            console.error("Error in getUsers:", error);

            // Handle authorization errors
            if (error.message.includes("Unauthorized")) {
                return res.status(403).json({
                    success: false,
                    error: error.message,
                });
            }

            res.status(500).json({
                success: false,
                error: "Failed to fetch users",
            });
        }
    },

    // Get user by ID
    getUserById: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const requestingUserId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const userId = parseInt(req.params.userId);

            if (!role || !tenant || !requestingUserId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized: Missing authentication",
                });
            }

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid user ID",
                });
            }

            const user = await usersService.getUserById(
                userId,
                role,
                tenant,
                requestingUserId
            );

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error: any) {
            console.error("Error in getUserById:", error);

            // Handle authorization errors
            if (error.message.includes("Unauthorized")) {
                return res.status(403).json({
                    success: false,
                    error: error.message,
                });
            }

            // Handle not found errors
            if (error.message.includes("not found")) {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }

            res.status(500).json({
                success: false,
                error: "Failed to fetch user",
            });
        }
    },
};
