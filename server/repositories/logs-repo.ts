import { ILog, Log } from "../models/log";
import { Course } from "../models/course";
import { User } from "../models/user";

export const logsRepository = {
    getLogs: async (
        userId: string,
        role: string,
        tenant: string,
        courseId: string
    ) => {
        try {
            let query: any = { course_id: courseId, tenant };

            if (role === "admin") {
                // Admins see all logs in their tenant for this course
                query = { course_id: courseId, tenant };
            } else if (role === "teacher") {
                // Teachers see all logs in their course (verify they own it)
                const course = await Course.findById(courseId);
                if (!course || course.professor_id !== parseInt(userId)) {
                    throw new Error("Unauthorized: You do not own this course");
                }
                query = { course_id: courseId, tenant };
            } else if (role === "student") {
                // Students only see their own logs (verify they're enrolled)
                const course = await Course.findById(courseId);
                const studentId = parseInt(userId);
                if (!course || !course.enrolled_students.includes(studentId)) {
                    throw new Error(
                        "Unauthorized: You are not enrolled in this course"
                    );
                }
                query = { course_id: courseId, tenant, uvu_id: userId };
            }

            console.log("Query:", query);

            // Debug: Check all logs in the database
            const allLogs = await Log.find({});
            console.log("All logs in DB:", JSON.stringify(allLogs, null, 2));

            const logs = await Log.find(query);
            console.log("Found logs:", logs);
            return logs;
        } catch (error) {
            console.error("Error fetching logs:", error);
            throw error;
        }
    },
    createLog: async (
        log: ILog,
        role: string,
        userId: number,
        courseId: string
    ) => {
        try {
            // Verify student is enrolled or teacher owns the course
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error("Course not found");
            }

            if (role === "student") {
                if (!course.enrolled_students.includes(userId)) {
                    throw new Error(
                        "Unauthorized: You are not enrolled in this course"
                    );
                }
            } else if (role === "teacher") {
                if (course.professor_id !== userId) {
                    throw new Error("Unauthorized: You do not own this course");
                }
            }

            // Create the log
            const createdLog = await Log.create(log);

            // Fetch user info and return with log
            const user = await User.findOne({ id: userId });
            return {
                log: createdLog,
                user: user
                    ? { id: user.id, username: user.username, role }
                    : null,
            };
        } catch (error) {
            console.error("Error creating log:", error);
            throw error;
        }
    },
    deleteLog: async (logId: string, role: string, userId: number) => {
        try {
            // Find the log to verify ownership
            const log = await Log.findById(logId);
            if (!log) {
                throw new Error("Log not found");
            }

            // Students can only delete their own logs
            if (role === "student") {
                if (parseInt(log.uvu_id) !== userId) {
                    throw new Error(
                        "Unauthorized: You can only delete your own logs"
                    );
                }
            }
            // Teachers can delete any log in their course
            else if (role === "teacher") {
                const course = await Course.findById(log.course_id);
                if (!course || course.professor_id !== userId) {
                    throw new Error("Unauthorized: You do not own this course");
                }
            }

            return await Log.deleteOne({ _id: logId });
        } catch (error) {
            console.error("Error deleting log:", error);
            throw error;
        }
    },
};
