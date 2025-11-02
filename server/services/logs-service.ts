import { logsRepository } from "../repositories/logs-repo";
import { ILog } from "../models/log";

export const logsService = {
    getLogsByCourseAndUvu: async (courseId: string, uvuId: string) => {
        return await logsRepository.getLogsByCourseAndUvu(courseId, uvuId);
    },
    createLog: async (log: ILog) => {
        return await logsRepository.createLog(log);
    },
};
