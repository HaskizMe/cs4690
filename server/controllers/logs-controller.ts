import { Request, Response } from "express";
import { logsService } from "../services/logs-service";

export const logsController = {
    getLogs: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const userId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const courseId = req.params.courseId;
            if (!role || !tenant || !userId || !courseId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const logs = await logsService.getLogs(
                userId.toString(),
                role,
                tenant,
                courseId
            );
            res.json(logs);
        } catch (error: any) {
            console.error("Error in getLogs:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to fetch logs";
            res.status(statusCode).json({ error: message });
        }
    },
    addLog: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const userId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const courseId = req.params.courseId;

            if (!role || !tenant || !userId || !courseId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const logData = {
                ...req.body,
                course_id: courseId,
                uvu_id: userId,
                tenant,
            };

            const log = await logsService.createLog(
                logData,
                role,
                tenant,
                userId,
                courseId
            );
            res.status(201).json(log);
        } catch (error: any) {
            console.error("Error in addLog:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to add log";
            res.status(statusCode).json({ error: message });
        }
    },
    deleteLog: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const userId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const logId = req.params.logId;

            if (!role || !tenant || !userId || !logId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const log = await logsService.deleteLog(
                logId,
                role,
                tenant,
                userId
            );
            res.json(log);
        } catch (error: any) {
            console.error("Error in deleteLog:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to delete log";
            res.status(statusCode).json({ error: message });
        }
    },
};
