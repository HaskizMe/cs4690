import { api } from "../api";

export const patchEnrollment = async (courseId: string, studentId: number) => {
    const response = await api.patch(
        `/courses/${courseId}/enroll/${studentId}`
    );
    return response.data;
};
