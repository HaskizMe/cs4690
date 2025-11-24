import { useState, useEffect } from "react";
import { postLogin } from "../../api/auth/post-login";
import { toast } from "sonner";

export interface AuthUser {
    userId: string;
    username: string;
    role: string;
    tenant: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already logged in on mount
    useEffect(() => {
        const raw = localStorage.getItem("mega-practicum-auth-token");
        if (raw) {
            try {
                const session = JSON.parse(raw);
                if (session?.user) {
                    setUser(session.user);
                }
            } catch (err) {
                console.error("Failed to parse stored session:", err);
                localStorage.removeItem("mega-practicum-auth-token");
            }
        }
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
            toast.error("Login failed");
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

    return {
        user,
        isLoggedIn,
        isLoading,
        error,
        login,
        logout,
    };
};
