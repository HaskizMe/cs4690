import { User, IUser } from "../models/user";

export const authRepo = {
    // Find user by username
    findByUsername: async (username: string): Promise<IUser | null> => {
        return User.findOne({ username: username.toLowerCase() });
    },

    // Find user by ID
    findById: async (id: string): Promise<IUser | null> => {
        return User.findById(id);
    },

    // Create a new user
    create: async (
        username: string,
        password: string,
        role: "admin" | "teacher" | "student",
        tenant: "uvu" | "uofu"
    ): Promise<IUser> => {
        const user = new User({ username, password, role, tenant });
        return user.save();
    },

    // Update user
    update: async (
        id: string,
        updates: Partial<IUser>
    ): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, updates, { new: true });
    },

    // Delete user
    delete: async (id: string): Promise<IUser | null> => {
        return User.findByIdAndDelete(id);
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
