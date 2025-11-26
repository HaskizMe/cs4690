import mongoose from "mongoose";
import { User } from "../models/user";
import { Course } from "../models/course";
import { Log } from "../models/log";
import dotenv from "dotenv";
import { generateUniqueId } from "../utils/generate-unique-id";

dotenv.config();

const mongoUri =
    process.env.MONGO_URI ||
    `mongodb+srv://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@cs4690.me7kbzf.mongodb.net/courses?appName=cs4690`;

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for seeding");

        await seedUsers();
        await seedCourses();
        await seedLogs();
    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

async function seedUsers() {
    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared users collection");

    // Seed admin users
    const users = [
        {
            id: generateUniqueId(),
            username: "root_uvu",
            password: "willy",
            role: "admin",
            tenant: "uvu",
        },
        {
            id: generateUniqueId(),
            username: "root_uofu",
            password: "swoopy",
            role: "admin",
            tenant: "uofu",
        },
        {
            id: 11111111,
            username: "professor_uvu",
            password: "willy",
            role: "teacher",
            tenant: "uvu",
        },
        {
            id: 22222222,
            username: "professor_uofu",
            password: "swoopy",
            role: "teacher",
            tenant: "uofu",
        },
        {
            id: 33333333,
            username: "student_uvu",
            password: "willy",
            role: "student",
            tenant: "uvu",
        },
        {
            id: 66666666,
            username: "student_uvu2",
            password: "willy",
            role: "student",
            tenant: "uvu",
        },
        {
            id: 44444444,
            username: "student_uofu",
            password: "swoopy",
            role: "student",
            tenant: "uofu",
        },
        {
            id: 55555555,
            username: "student_uofu2",
            password: "swoopy",
            role: "student",
            tenant: "uofu",
        },
    ];

    await User.create(users);
    console.log("✓ Seeded admin users");
}

async function seedCourses() {
    await Course.deleteMany({});
    console.log("Cleared courses collection");
    const courses = [
        {
            id: 1,
            course_name: "CS 101",
            enrolled_students: [33333333, 66666666],
            professor_id: 11111111,
            tenant: "uvu",
        },
        {
            id: 2,
            course_name: "CS 102",
            enrolled_students: [44444444, 55555555],
            professor_id: 22222222,
            tenant: "uofu",
        },
    ];
    await Course.create(courses);
    console.log("✓ Seeded courses");
}

async function seedLogs() {
    await Log.deleteMany({});
    console.log("Cleared logs collection");
    const logs = [
        {
            course_id: 1,
            uvu_id: 33333333,
            date: "2025-11-26",
            text: "Hello World from student_uvu",
        },
        {
            course_id: 2,
            uvu_id: 44444444,
            date: "2025-11-26",
            text: "Hello World from student_uofu",
        },
    ];
    await Log.create(logs);
    console.log("✓ Seeded logs");
}

seed();
