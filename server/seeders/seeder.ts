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
        const courses = await seedCourses();
        await seedLogs(courses);
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
            id: 10000000,
            username: "root_uvu",
            password: "willy",
            role: "admin",
            tenant: "uvu",
        },
        {
            id: 20000000,
            username: "root_uofu",
            password: "swoopy",
            role: "admin",
            tenant: "uofu",
        },
        {
            id: 11000000,
            username: "professor_uvu",
            password: "willy",
            role: "teacher",
            tenant: "uvu",
        },
        {
            id: 21000000,
            username: "professor_uofu",
            password: "swoopy",
            role: "teacher",
            tenant: "uofu",
        },
        {
            id: 12000000,
            username: "student_uvu",
            password: "willy",
            role: "student",
            tenant: "uvu",
        },
        {
            id: 22000000,
            username: "student_uofu",
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
            course_name: "CS 3380",
            enrolled_students: [12000000],
            professor_id: 11000000,
            tenant: "uvu",
        },
        {
            course_name: "CS 4660",
            enrolled_students: [12000000],
            professor_id: 11000000,
            tenant: "uvu",
        },
        {
            course_name: "CS 4690",
            enrolled_students: [12000000],
            professor_id: 11000000,
            tenant: "uvu",
        },
        {
            course_name: "CS 3380",
            enrolled_students: [22000000],
            professor_id: 21000000,
            tenant: "uofu",
        },
        {
            course_name: "CS 4660",
            enrolled_students: [22000000],
            professor_id: 21000000,
            tenant: "uofu",
        },
        {
            course_name: "CS 4690",
            enrolled_students: [22000000],
            professor_id: 21000000,
            tenant: "uofu",
        },
    ];
    const createdCourses = await Course.create(courses);
    console.log("✓ Seeded courses");
    return createdCourses;
}

async function seedLogs(courses: any[]) {
    await Log.deleteMany({});
    console.log("Cleared logs collection");

    // Map course names to indices
    // UVU courses: CS 3380 (0), CS 4660 (1), CS 4690 (2)
    // UofU courses: CS 3380 (3), CS 4660 (4), CS 4690 (5)
    const getCourseIndex = (courseName: string, tenant: string) => {
        const courseMap = {
            cs3380: tenant === "uvu" ? 0 : 3,
            cs4660: tenant === "uvu" ? 1 : 4,
            cs4690: tenant === "uvu" ? 2 : 5,
        };
        return courseMap[courseName as keyof typeof courseMap];
    };

    const logs = [
        // UVU logs
        {
            course_id: courses[getCourseIndex("cs4660", "uvu")]._id.toString(),
            uvu_id: "12000000",
            date: "1/23/2021 1:23:36 PM",
            tenant: "uvu",
            text: "Initial comment. Hello World",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uvu")]._id.toString(),
            uvu_id: "12000000",
            date: "1/24/2021 2:43:12 PM",
            tenant: "uvu",
            text: "MongoDB is looking really good, still need to get atlas up and running.",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uvu")]._id.toString(),
            uvu_id: "12000000",
            date: "1/27/2021 5:58:10 PM",
            tenant: "uvu",
            text: "Atlas is up and running",
        },
        {
            course_id: courses[getCourseIndex("cs3380", "uvu")]._id.toString(),
            uvu_id: "12000000",
            date: "1/28/2021 3:53:52 PM",
            tenant: "uvu",
            text: "Learned about clusters\n\nStill trying to wrap my mind around the concept",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uvu")]._id.toString(),
            uvu_id: "12000000",
            date: "1/8/2022, 7:41:28 PM",
            tenant: "uvu",
            text: "Hopefully we get better at testing when we start working on Cypress",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uvu")]._id.toString(),
            uvu_id: "12000000",
            date: "1/10/2022, 7:27:40 PM",
            tenant: "uvu",
            text: "Initial jquery practicum works.",
        },

        // UofU logs (same content but for UofU tenant)
        {
            course_id: courses[getCourseIndex("cs4660", "uofu")]._id.toString(),
            uvu_id: "22000000",
            date: "1/23/2021 1:23:36 PM",
            tenant: "uofu",
            text: "Initial comment. Hello World",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uofu")]._id.toString(),
            uvu_id: "22000000",
            date: "1/24/2021 2:43:12 PM",
            tenant: "uofu",
            text: "MongoDB is looking really good, still need to get atlas up and running.",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uofu")]._id.toString(),
            uvu_id: "22000000",
            date: "1/27/2021 5:58:10 PM",
            tenant: "uofu",
            text: "Atlas is up and running",
        },
        {
            course_id: courses[getCourseIndex("cs3380", "uofu")]._id.toString(),
            uvu_id: "22000000",
            date: "1/28/2021 3:53:52 PM",
            tenant: "uofu",
            text: "Learned about clusters\n\nStill trying to wrap my mind around the concept",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uofu")]._id.toString(),
            uvu_id: "22000000",
            date: "1/8/2022, 7:41:28 PM",
            tenant: "uofu",
            text: "Hopefully we get better at testing when we start working on Cypress",
        },
        {
            course_id: courses[getCourseIndex("cs4660", "uofu")]._id.toString(),
            uvu_id: "22000000",
            date: "1/10/2022, 7:27:40 PM",
            tenant: "uofu",
            text: "Initial jquery practicum works.",
        },
    ];

    await Log.create(logs);
    console.log("✓ Seeded logs");
}

seed();
