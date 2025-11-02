import { Schema, model } from "mongoose";
import { ILog } from "../models/log";

const logSchema = new Schema<ILog>({
    courseId: { type: String, required: true },
    uvuId: { type: String, required: true },
    date: { type: String, required: true },
    text: { type: String, required: true },
    id: { type: String, required: true, unique: true },
});

export const Log = model<ILog>("logs", logSchema);

export const logsRepository = {
    getLogsByCourseAndUvu: async (courseId: string, uvuId: string) => {
        try {
            const logs = await Log.find({ courseId, uvuId });
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
};
