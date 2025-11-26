import { authRepo } from "../repositories/auth-repo";
import { IUser } from "../models/user";
import { AuthResponse } from "../models/auth";
import { jwtUtils } from "../utils/jwt";
import { generateUniqueId } from "../utils/generate-unique-id";

export interface AuthResponseWithToken extends AuthResponse {
    token?: string;
}

export const authService = {
    // Register a new user
    register: async (
        username: string,
        password: string,
        role: "admin" | "teacher" | "student",
        tenant: "uvu" | "uofu"
    ): Promise<AuthResponseWithToken> => {
        try {
            // Validate input
            if (!username || !password || !role || !tenant) {
                return {
                    success: false,
                    message: "Missing required fields",
                    error: "username, password, role, and tenant are required",
                };
            }

            // Check if user already exists
            const existingUser = await authRepo.findByUsername(username);
            if (existingUser) {
                return {
                    success: false,
                    message: "User already exists",
                    error: "Username is already taken",
                };
            }

            // Create new user with generated ID
            const studentId = generateUniqueId();
            const user = await authRepo.create(
                username,
                password,
                role,
                tenant,
                studentId
            );

            // Generate JWT token
            const token = jwtUtils.generateToken({
                userId: user.id.toString(),
                username: user.username,
                role: user.role,
                tenant: user.tenant,
            });

            return {
                success: true,
                message: "User registered successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    tenant: user.tenant,
                },
                token,
            };
        } catch (error) {
            console.error("Registration error:", error);
            return {
                success: false,
                message: "Registration failed",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    // Login user
    login: async (
        username: string,
        password: string,
        tenant: "uvu" | "uofu"
    ): Promise<AuthResponseWithToken> => {
        try {
            // Validate input
            if (!username || !password || !tenant) {
                return {
                    success: false,
                    message: "Missing required fields",
                    error: "username, password, and tenant are required",
                };
            }

            // Find user by username
            const user = await authRepo.findByUsername(username);
            if (!user) {
                return {
                    success: false,
                    message: "Invalid credentials",
                    error: "User not found",
                };
            }

            // Check if user belongs to the correct tenant
            if (user.tenant !== tenant) {
                return {
                    success: false,
                    message: "Invalid tenant",
                    error: "User does not belong to this tenant",
                };
            }

            // Compare passwords
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid credentials",
                    error: "Incorrect password",
                };
            }

            // Generate JWT token
            const token = jwtUtils.generateToken({
                userId: user.id.toString(),
                username: user.username,
                role: user.role,
                tenant: user.tenant,
            });

            return {
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    tenant: user.tenant,
                },
                token,
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: "Login failed",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    // Verify user exists and is valid
    verifyUser: async (userId: string): Promise<IUser | null> => {
        try {
            return await authRepo.findById(userId);
        } catch (error) {
            console.error("User verification error:", error);
            return null;
        }
    },

    // Delete user (admin can delete any user, users can only delete themselves)
    deleteUser: async (
        userIdToDelete: number,
        requestingUserId: number,
        requestingUserRole: string,
        requestingUserTenant: string
    ): Promise<AuthResponseWithToken> => {
        try {
            // Validate input
            if (
                !userIdToDelete ||
                !requestingUserId ||
                !requestingUserRole ||
                !requestingUserTenant
            ) {
                return {
                    success: false,
                    message: "Missing required fields",
                    error: "userIdToDelete, requestingUserId, requestingUserRole, and requestingUserTenant are required",
                };
            }

            // Check authorization: only admin can delete others, users can only delete themselves
            if (
                requestingUserRole !== "admin" &&
                userIdToDelete !== requestingUserId
            ) {
                return {
                    success: false,
                    message: "Unauthorized",
                    error: "You can only delete your own account",
                };
            }

            // Find the user to delete
            const userToDelete = await authRepo.findById(
                userIdToDelete.toString()
            );
            if (!userToDelete) {
                return {
                    success: false,
                    message: "User not found",
                    error: "The user you are trying to delete does not exist",
                };
            }

            // Check tenant match (admin can only delete users from their own tenant)
            if (userToDelete.tenant !== requestingUserTenant) {
                return {
                    success: false,
                    message: "Unauthorized",
                    error: "You cannot delete users from other tenants",
                };
            }

            // Delete the user
            await authRepo.delete(userIdToDelete.toString());

            return {
                success: true,
                message: "User deleted successfully",
            };
        } catch (error) {
            console.error("Delete user error:", error);
            return {
                success: false,
                message: "Failed to delete user",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },
};
