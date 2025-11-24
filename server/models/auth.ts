export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        username: string;
        role: string;
        tenant: string;
    };
    error?: string;
}
