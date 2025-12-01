import { User, IUser } from "../models/user";

export const usersRepo = {
    // Get all users (admin only)
    getAllUsers: async (tenant: string): Promise<IUser[]> => {
        return User.find({ tenant })
            .select("-password")
            .sort({ createdAt: -1 });
    },

    // Get only students (for teachers)
    getStudents: async (tenant: string): Promise<IUser[]> => {
        return User.find({ tenant, role: "student" })
            .select("-password")
            .sort({ createdAt: -1 });
    },

    // Get user by ID (without password)
    getUserById: async (id: number, tenant: string): Promise<IUser | null> => {
        return User.findOne({ id, tenant }).select("-password");
    },
};
