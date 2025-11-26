export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        username: string;
        role: string;
        tenant: string;
    };
    error?: string;
}
