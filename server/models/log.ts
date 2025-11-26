import mongoose, { Schema } from "mongoose";

export interface ILog {
    course_id: string;
    uvu_id: string;
    date: string;
    text: string;
}

const logSchema = new Schema<ILog>({
    course_id: { type: String, required: true },
    uvu_id: { type: String, required: true },
    date: { type: String, required: true },
    text: { type: String, required: true },
});

export const Log = mongoose.model<ILog>("logs", logSchema);
