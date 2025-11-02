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
};
