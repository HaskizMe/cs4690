import { api } from "../api";

export const getLogs = async (courseId: string) => {
    const response = await api.get(`/logs/${courseId}`);
    return response.data;
};
