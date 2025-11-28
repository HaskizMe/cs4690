import { Request, Response } from "express";
import { coursesService } from "../services/courses-service";

export const coursesController = {
    getCourses: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const studentId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const all = req.query.all === "true"; // Check for ?all=true query param

            if (!role || !tenant || !studentId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const courses = await coursesService.getAllCourses(
                role,
                tenant,
                studentId,
                all
            );
            res.json(courses);
        } catch (error) {
            console.error("Error in getCourses:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    },
    addCourse: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const course = await coursesService.createCourse(
                req.body,
                role,
                tenant
            );
            res.json(course);
        } catch (error: any) {
            console.error("Error in addCourse:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to add course";
            res.status(statusCode).json({ error: message });
        }
    },
    deleteCourse: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const courseId = req.params.courseId;
            const course = await coursesService.deleteCourse(
                courseId,
                role,
                tenant
            );
            res.json(course);
        } catch (error: any) {
            console.error("Error in deleteCourse:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to delete course";
            res.status(statusCode).json({ error: message });
        }
    },

    enrollStudent: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const currentUserId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const courseId = req.params.courseId;
            const targetUserId = req.params.userId
                ? parseInt(req.params.userId)
                : undefined;

            if (!currentUserId || !targetUserId) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            // Authorization: students can only enroll themselves
            if (role === "student" && currentUserId !== targetUserId) {
                return res.status(403).json({
                    error: "Unauthorized: Students can only enroll themselves",
                });
            }

            const course = await coursesService.enrollStudent(
                courseId,
                role,
                tenant,
                targetUserId
            );
            res.json(course);
        } catch (error: any) {
            console.error("Error in enrollStudent:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to enroll student";
            res.status(statusCode).json({ error: message });
        }
    },

    unenrollStudent: async (req: Request, res: Response) => {
        try {
            const role = req.user?.role;
            const tenant = req.user?.tenant;
            const currentUserId = req.user?.userId
                ? parseInt(req.user.userId)
                : undefined;
            const courseId = req.params.courseId;
            const targetUserId = req.params.userId
                ? parseInt(req.params.userId)
                : undefined;

            if (!currentUserId || !targetUserId) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            // Authorization: students can only unenroll themselves
            if (role === "student" && currentUserId !== targetUserId) {
                return res.status(403).json({
                    error: "Unauthorized: Students can only unenroll themselves",
                });
            }

            const course = await coursesService.unenrollStudent(
                courseId,
                role,
                tenant,
                targetUserId
            );
            res.json(course);
        } catch (error: any) {
            console.error("Error in unenrollStudent:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Failed to unenroll student";
            res.status(statusCode).json({ error: message });
        }
    },
};
