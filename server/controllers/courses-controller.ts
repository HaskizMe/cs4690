import { Request, Response } from "express";

export const coursesController = {
    getHealthCheck: (req: Request, res: Response) => {
        res.json({ status: "Server is running" });
    },
};
