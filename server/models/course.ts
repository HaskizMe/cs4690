import mongoose, { Schema } from "mongoose";

export interface ICourse {
    course_name: string;
    enrolled_students: number[];
    professor_id: number;
    tenant: string;
}
const courseSchema = new Schema<ICourse>({
    course_name: { type: String, required: true },
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

// Create compound unique index on course_name and tenant
courseSchema.index({ course_name: 1, tenant: 1 }, { unique: true });

export const Course = mongoose.model<ICourse>("courses", courseSchema);
