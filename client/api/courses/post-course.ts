import { api } from "../api";

export const postCourse = async (
    professorId: string,
    courseName: string,
    tenant: string,
    enrolledStudents: number[]
) => {
    const response = await api.post("/courses", {
        professor_id: professorId,
        course_name: courseName,
        tenant,
        enrolled_students: enrolledStudents,
    });
    return response.data;
};
