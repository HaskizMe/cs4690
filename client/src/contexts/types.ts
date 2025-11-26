export interface AuthUser {
    id: number;
    username: string;
    role: string;
    tenant: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export interface AuthContextType {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    login: (
        username: string,
        password: string,
        tenant: "uvu" | "uofu"
    ) => Promise<AuthResponse>;
    register: (
        username: string,
        password: string,
        tenant: "uvu" | "uofu",
        role: "student" | "teacher"
    ) => Promise<AuthResponse>;
    logout: () => void;
}
