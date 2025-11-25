import { api } from "../api";

export const validateToken = async () => {
    const response = await api.post("/auth/validate-token");
    return response.data;
};
