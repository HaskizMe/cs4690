import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { postLogin } from "../../api/auth/post-login";
import { validateToken } from "../../api/auth/validate-token";
import type { AuthResponse, AuthUser } from "./types";
import { AuthContext } from "./auth-context-definition";
import { postRegister } from "../../api/auth/post-register";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already logged in on mount
    useEffect(() => {
        const autoLogin = async () => {
            const raw = localStorage.getItem("mega-practicum-auth-token");
            if (raw) {
                try {
                    const session = JSON.parse(raw);
                    if (session?.token) {
                        // Validate token with server
                        try {
                            await validateToken();
                            setUser(session.user);
                        } catch (err) {
                            // Token is invalid or expired
                            console.error("Token validation failed:", err);
                            localStorage.removeItem(
                                "mega-practicum-auth-token"
                            );
                            setUser(null);
                        }
                    }
                } catch (err) {
                    console.error("Failed to parse stored session:", err);
                    localStorage.removeItem("mega-practicum-auth-token");
                }
            }
        };

        autoLogin();
    }, []);

    const login = async (
        username: string,
        password: string,
        tenant: "uvu" | "uofu"
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await postLogin(username, password, tenant);
            const authData: AuthResponse = result;

            // Store token and user data
            localStorage.setItem(
                "mega-practicum-auth-token",
                JSON.stringify(authData)
            );
            setUser(authData.user);

            return authData;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Login failed";
            setError(errorMessage);
            console.error("Login error:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (
        username: string,
        password: string,
        tenant: "uvu" | "uofu",
        role: "student" | "teacher"
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await postRegister(username, password, tenant, role);
            const authData: AuthResponse = result;

            // Store token and user data
            localStorage.setItem(
                "mega-practicum-auth-token",
                JSON.stringify(authData)
            );
            setUser(authData.user);

            return authData;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Login failed";
            setError(errorMessage);
            console.error("Login error:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("mega-practicum-auth-token");
        setUser(null);
        setError(null);
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn,
                isLoading,
                error,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
