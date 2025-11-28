import { logsRepository } from "../repositories/logs-repo";
import { ILog } from "../models/log";

export const logsService = {
    getLogs: async (
        userId: string,
        role: string,
        tenant: string,
        courseId: string
    ) => {
        if (!userId || !role || !tenant || !courseId) {
            throw new Error("Unauthorized");
        }
        return await logsRepository.getLogs(userId, role, tenant, courseId);
    },
    createLog: async (
        log: ILog,
        role: string,
        tenant: string,
        userId: number,
        courseId: string
    ) => {
        if (!role || !tenant || !userId || !courseId) {
            throw new Error("Unauthorized");
        }

        return await logsRepository.createLog(log, role, userId, courseId);
    },
    deleteLog: async (
        logId: string,
        role: string,
        tenant: string,
        userId: number
    ) => {
        if (!logId || !role || !tenant || !userId) {
            throw new Error("Unauthorized");
        }

        // Only students and teachers can delete logs
        if (role !== "student" && role !== "teacher") {
            throw new Error(
                "Unauthorized: Only students and teachers can delete logs"
            );
        }

        return await logsRepository.deleteLog(logId, role, userId);
    },
};
