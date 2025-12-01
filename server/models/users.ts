export interface UserResponse {
    id: number;
    username: string;
    role: "admin" | "teacher" | "student";
    tenant: "uvu" | "uofu";
    createdAt: Date;
}

export interface UsersListResponse {
    success: boolean;
    users: UserResponse[];
    message?: string;
}
