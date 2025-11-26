import { Schema, model } from "mongoose";
import { ICourse } from "../models/course";

const courseSchema = new Schema<ICourse>({
    // id: { type: String, required: true, unique: true },
    course_name: { type: String, required: true, unique: true },
});

export const Course = model<ICourse>("courses", courseSchema);

export const coursesRepository = {
    getAllCourses: async () => {
        try {
            const courses = await Course.find();
            return courses;
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw error;
        }
    },
    createCourse: async (course: ICourse) => {
        try {
            return await Course.create(course);
        } catch (error: any) {
            console.error("Error creating course:", error);
            if (error.code === 11000) {
                const err = new Error("Course with this name already exists");
                (err as any).statusCode = 409;
                throw err;
            }
            throw error;
        }
    },
    deleteCourse: async (courseId: string) => {
        try {
            return await Course.deleteOne({ id: courseId });
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    },
};
