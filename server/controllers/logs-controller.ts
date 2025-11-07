import { Request, Response } from "express";
import { logsService } from "../services/logs-service";

export const logsController = {
    getLogs: async (req: Request, res: Response) => {
        try {
            const { courseId, uvuId } = req.query;
            const logs = await logsService.getLogs(
                courseId as string,
                uvuId as string
            );
            res.json(logs);
        } catch (error) {
            console.error("Error in getLogs:", error);
            res.status(500).json({ error: "Failed to fetch logs" });
        }
    },
    addLog: async (req: Request, res: Response) => {
        try {
            const log = await logsService.createLog(req.body);
            res.json(log);
        } catch (error) {
            console.error("Error in addLog:", error);
            res.status(500).json({ error: "Failed to add log" });
        }
    },
    deleteLog: async (req: Request, res: Response) => {
        try {
            const logId = req.params.logId;
            const log = await logsService.deleteLog(logId);
            res.json(log);
        } catch (error) {
            console.error("Error in deleteLog:", error);
            res.status(500).json({ error: "Failed to delete log" });
        }
    },
};
