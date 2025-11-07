import { logsRepository } from "../repositories/logs-repo";
import { ILog } from "../models/log";

export const logsService = {
    getLogs: async (courseId?: string, uvuId?: string) => {
        return await logsRepository.getLogs(courseId, uvuId);
    },
    createLog: async (log: ILog) => {
        return await logsRepository.createLog(log);
    },
    deleteLog: async (logId: string) => {
        return await logsRepository.deleteLog(logId);
    },
};
