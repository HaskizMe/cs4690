import { User, IUser } from "../models/user";
import mongoose from "mongoose";

export const authRepo = {
    // Find user by username
    findByUsernameAndTenant: async (
        username: string,
        tenant: string
    ): Promise<IUser | null> => {
        return User.findOne({ username: username.toLowerCase(), tenant });
    },

    // Find user by MongoDB _id or custom id field
    findById: async (id: string | number): Promise<IUser | null> => {
        let user: IUser | null = null;

        // Check if id is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await User.findById(id);
        }

        // If not found by MongoDB _id, try to find by custom id field
        if (!user) {
            user = await User.findOne({ id: Number(id) });
        }

        return user;
    },

    // Create a new user
    create: async (
        username: string,
        password: string,
        role: "admin" | "teacher" | "student",
        tenant: "uvu" | "uofu",
        id: number
    ): Promise<IUser> => {
        const user = new User({ id, username, password, role, tenant });
        return user.save();
    },

    // Update user
    update: async (
        id: string,
        updates: Partial<IUser>
    ): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, updates, { new: true });
    },

    // Delete user by MongoDB _id or custom id field
    delete: async (id: string | number): Promise<IUser | null> => {
        let user: IUser | null = null;

        // Check if id is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await User.findByIdAndDelete(id);
        }

        // If not found by MongoDB _id, try to delete by custom id field
        if (!user) {
            user = await User.findOneAndDelete({ id: Number(id) });
        }

        return user;
    },

    // Find all users (for admin purposes)
    findAll: async (): Promise<IUser[]> => {
        return User.find();
    },

    // Find users by tenant
    findByTenant: async (tenant: "uvu" | "uofu"): Promise<IUser[]> => {
        return User.find({ tenant });
    },

    // Find users by role
    findByRole: async (role: string): Promise<IUser[]> => {
        return User.find({ role });
    },
};
