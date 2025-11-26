import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { coursesController } from "./controllers/courses-controller";
import { logsController } from "./controllers/logs-controller";
import { authController } from "./controllers/auth-controller";
import { authMiddleware, requireRole } from "./middleware/auth-middleware";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// MongoDB Connection
const mongoUri =
    process.env.MONGO_URI ||
    `mongodb+srv://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@cs4690.me7kbzf.mongodb.net/courses?appName=cs4690`;

mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Auth Routes (no middleware required)
app.post("/api/auth/login", authController.login);
app.post("/api/auth/register", authController.register);
app.post("/api/auth/logout", authController.logout);
app.post("/api/auth/validate-token", authController.validateToken);

// Protected Routes (require authentication)
app.get("/api/courses", authMiddleware, coursesController.getCourses);
app.post("/api/courses", authMiddleware, coursesController.addCourse);
app.delete(
    "/api/courses/:courseId",
    authMiddleware,
    coursesController.deleteCourse
);
app.patch(
    "/api/courses/:courseId/enroll",
    authMiddleware,
    coursesController.enrollStudent
);
app.patch(
    "/api/courses/:courseId/unenroll",
    authMiddleware,
    coursesController.unenrollStudent
);
app.get("/api/logs", authMiddleware, logsController.getLogs);
app.post("/api/logs", authMiddleware, logsController.addLog);
app.delete("/api/logs/:logId", authMiddleware, logsController.deleteLog);

// Serve frontend
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
