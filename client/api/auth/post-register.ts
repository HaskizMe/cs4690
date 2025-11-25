import axios from "axios";

export const postRegister = async (
    username: string,
    password: string,
    tenant: "uvu" | "uofu",
    role: "student" | "teacher"
) => {
    const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
            username,
            password,
            tenant,
            role,
        }
    );
    return response.data;
};
