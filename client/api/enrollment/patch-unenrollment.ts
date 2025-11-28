import { api } from "../api";

export const patchUnenrollment = async (
    courseId: string,
    studentId: number
) => {
    const response = await api.patch(
        `/courses/${courseId}/unenroll/${studentId}`
    );
    return response.data;
};
