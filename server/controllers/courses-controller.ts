import { Request, Response } from "express";
import { coursesService } from "../services/courses-service";

export const coursesController = {
    getCourses: async (req: Request, res: Response) => {
        try {
            const courses = await coursesService.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error("Error in getCourses:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    },
    addCourse: async (req: Request, res: Response) => {
        try {
            const course = await coursesService.createCourse(req.body);
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
            const courseId = req.params.courseId;
            const course = await coursesService.deleteCourse(courseId);
            res.json(course);
        } catch (error) {
            console.error("Error in deleteCourse:", error);
            res.status(500).json({ error: "Failed to delete course" });
        }
    },
};
