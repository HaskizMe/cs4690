import { usersRepo } from "../repositories/users-repo";
import { UserResponse } from "../models/users";

export const usersService = {
    getUsers: async (role: string, tenant: string): Promise<UserResponse[]> => {
        // Students cannot view any users
        if (role === "student") {
            throw new Error("Unauthorized: Students cannot view other users");
        }

        let users;

        // Admins can see all users
        if (role === "admin") {
            users = await usersRepo.getAllUsers(tenant);
        }
        // Teachers can only see students
        else if (role === "teacher") {
            users = await usersRepo.getStudents(tenant);
        } else {
            throw new Error("Unauthorized: Invalid role");
        }

        // Map to response format
        return users.map((user) => ({
            id: user.id,
            username: user.username,
            role: user.role,
            tenant: user.tenant,
            createdAt: user.createdAt,
        }));
    },

    getUserById: async (
        userId: number,
        role: string,
        tenant: string,
        requestingUserId: number
    ): Promise<UserResponse> => {
        // Students can only view their own profile
        if (role === "student" && userId !== requestingUserId) {
            throw new Error(
                "Unauthorized: Students can only view their own profile"
            );
        }

        const user = await usersRepo.getUserById(userId, tenant);

        if (!user) {
            throw new Error("User not found");
        }

        // Teachers can only view students (or their own profile)
        if (
            role === "teacher" &&
            user.role !== "student" &&
            userId !== requestingUserId
        ) {
            throw new Error("Unauthorized: Teachers can only view students");
        }

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            tenant: user.tenant,
            createdAt: user.createdAt,
        };
    },
};
