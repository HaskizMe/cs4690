import { api } from "../api";

export const postLog = async (courseId: string, date: string, text: string) => {
    const response = await api.post(`/logs/${courseId}`, { date, text });
    return response.data;
};
