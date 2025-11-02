import { coursesRepository } from "../repositories/courses-repo";
import { ICourse } from "../models/course";

export const coursesService = {
    getAllCourses: async () => {
        return await coursesRepository.getAllCourses();
    },
    createCourse: async (course: ICourse) => {
        return await coursesRepository.createCourse(course);
    },
};
