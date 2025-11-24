import { authRepo } from "../repositories/auth-repo";
import { IUser } from "../models/user";
import { AuthResponse } from "../models/auth";
import { jwtUtils } from "../utils/jwt";

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

            if (password.length < 6) {
                return {
                    success: false,
                    message: "Password too short",
                    error: "Password must be at least 6 characters",
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

            // Create new user
            const user = await authRepo.create(
                username,
                password,
                role,
                tenant
            );

            const userId = (user._id as any).toString();

            // Generate JWT token
            const token = jwtUtils.generateToken({
                userId,
                username: user.username,
                role: user.role,
                tenant: user.tenant,
            });

            return {
                success: true,
                message: "User registered successfully",
                user: {
                    id: userId,
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

            const userId = (user._id as any).toString();

            // Generate JWT token
            const token = jwtUtils.generateToken({
                userId,
                username: user.username,
                role: user.role,
                tenant: user.tenant,
            });

            return {
                success: true,
                message: "Login successful",
                user: {
                    id: userId,
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
};
