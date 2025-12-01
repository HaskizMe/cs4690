import { api } from "../api";

export const deleteUser = async (userId: string) => {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
};
