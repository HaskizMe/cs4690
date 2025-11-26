import { ILog, Log } from "../models/log";

export const logsRepository = {
    getLogs: async (courseId?: string, uvuId?: string) => {
        try {
            const query: { courseId?: string; uvuId?: string } = {};
            if (courseId) query.courseId = courseId;
            if (uvuId) query.uvuId = uvuId;
            const logs = await Log.find(query);
            return logs;
        } catch (error) {
            console.error("Error fetching logs:", error);
            throw error;
        }
    },
    createLog: async (log: ILog) => {
        try {
            return await Log.create(log);
        } catch (error) {
            console.error("Error creating log:", error);
            throw error;
        }
    },
    deleteLog: async (logId: string) => {
        try {
            return await Log.deleteOne({ id: logId });
        } catch (error) {
            console.error("Error deleting log:", error);
            throw error;
        }
    },
};
