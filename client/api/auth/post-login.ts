import axios from "axios";

export const postLogin = async (
    username: string,
    password: string,
    tenant: "uvu" | "uofu"
) => {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
        tenant,
    });
    return response.data;
};
