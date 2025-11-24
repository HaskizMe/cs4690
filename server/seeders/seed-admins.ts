import mongoose from "mongoose";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

const mongoUri =
    process.env.MONGO_URI ||
    `mongodb+srv://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@cs4690.me7kbzf.mongodb.net/courses?appName=cs4690`;

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for seeding");

        // Clear existing users
        await User.deleteMany({});
        console.log("Cleared users collection");

        // Seed admin users
        const users = [
            {
                username: "root_uvu",
                password: "willy",
                role: "admin",
                tenant: "uvu",
            },
            {
                username: "root_uofu",
                password: "swoopy",
                role: "admin",
                tenant: "uofu",
            },
        ];

        await User.create(users);
        console.log("✓ Seeded admin users with hashed passwords");
        console.log("  - root_uvu (UVU tenant)");
        console.log("  - root_uofu (UofU tenant)");
    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
