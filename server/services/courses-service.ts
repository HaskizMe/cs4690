import { coursesRepository } from "../repositories/courses-repo";
import { ICourse } from "../models/course";

export const coursesService = {
    getAllCourses: async (role: string, tenant: string, studentId: number) => {
        return await coursesRepository.getAllCourses(role, tenant, studentId);
    },
    createCourse: async (course: ICourse, role?: string, tenant?: string) => {
        if (role !== "admin" && role !== "teacher") {
            throw new Error("Unauthorized: Role must be admin or teacher");
        }

        if (tenant !== course.tenant) {
            throw new Error("Unauthorized: Tenant does not match");
        }
        return await coursesRepository.createCourse(course);
    },
    deleteCourse: async (courseId: string, role?: string, tenant?: string) => {
        if (role !== "admin" && role !== "teacher") {
            throw new Error("Unauthorized");
        }

        const course = await coursesRepository.getCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        if (tenant !== course.tenant) {
            throw new Error("Unauthorized: Tenant does not match");
        }
        return await coursesRepository.deleteCourse(courseId);
    },

    enrollStudent: async (
        courseId: string,
        role?: string,
        tenant?: string,
        studentId?: number
    ) => {
        if (!role || !tenant || !studentId) {
            throw new Error("Unauthorized");
        }
        if (role !== "student" && role !== "teacher") {
            throw new Error("Unauthorized: Role must be student or teacher");
        }

        const course = await coursesRepository.getCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        if (tenant !== course.tenant) {
            throw new Error("Unauthorized: Tenant does not match");
        }

        if (course.enrolled_students.includes(studentId)) {
            throw new Error("Student is already enrolled in this course");
        }
        return await coursesRepository.enrollStudent(courseId, studentId);
    },

    unenrollStudent: async (
        courseId: string,
        role?: string,
        tenant?: string,
        studentId?: number
    ) => {
        if (!role || !tenant || !studentId) {
            throw new Error("Unauthorized");
        }
        if (role !== "student" && role !== "teacher") {
            throw new Error("Unauthorized: Role must be student or teacher");
        }

        const course = await coursesRepository.getCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        if (tenant !== course.tenant) {
            throw new Error("Unauthorized: Tenant does not match");
        }

        if (!course.enrolled_students.includes(studentId)) {
            throw new Error("Student is not enrolled in this course");
        }
        return await coursesRepository.unenrollStudent(courseId, studentId);
    },
};
