import { api } from "../api";

export const deleteCourse = async (courseId: string) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
};
