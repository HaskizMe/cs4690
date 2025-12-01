import { ICourse, Course } from "../models/course";

export const coursesRepository = {
    getAllCourses: async (
        role: string,
        tenant: string,
        studentId: number,
        all?: boolean
    ) => {
        try {
            if (all) {
                // Return all courses in tenant regardless of role
                return await Course.find({ tenant });
            }

            if (role === "admin") {
                // Admins see all courses in their tenant (same as all=true)
                return await Course.find({ tenant });
            }
            if (role === "teacher") {
                // Teachers see all courses they teach
                return await Course.find({
                    tenant,
                    professor_id: studentId,
                });
            }
            if (role === "student") {
                // Students only see courses they're enrolled in
                return await Course.find({
                    tenant,
                    enrolled_students: studentId,
                });
            }
            // Fallback
            return await Course.find({ tenant });
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
            return await Course.deleteOne({ _id: courseId });
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    },
    enrollStudent: async (courseId: string, studentId: number) => {
        try {
            return await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { enrolled_students: studentId } },
                { new: true }
            );
        } catch (error) {
            console.error("Error enrolling student:", error);
            throw error;
        }
    },
    unenrollStudent: async (courseId: string, studentId: number) => {
        try {
            return await Course.findByIdAndUpdate(
                courseId,
                { $pull: { enrolled_students: studentId } },
                { new: true }
            );
        } catch (error) {
            console.error("Error unenrolling student:", error);
            throw error;
        }
    },

    getCourseById: async (courseId: string) => {
        try {
            return await Course.findById(courseId);
        } catch (error) {
            console.error("Error fetching course:", error);
            throw error;
        }
    },
};
