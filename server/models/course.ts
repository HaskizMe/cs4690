import mongoose, { Schema } from "mongoose";

export interface ICourse {
    course_name: string;
    enrolled_students: number[];
    professor_id: number;
    tenant: string;
}
const courseSchema = new Schema<ICourse>({
    course_name: { type: String, required: true, unique: true },
    enrolled_students: {
        type: [Number],
        default: [],
    },
    professor_id: {
        type: Number,
        required: true,
    },
    tenant: {
        type: String,
        required: true,
    },
});

export const Course = mongoose.model<ICourse>("courses", courseSchema);
