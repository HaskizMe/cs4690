import { useEffect, useState } from "react";
import { getLogs } from "../../api/user-logs/get-logs";
import type { Log } from "../types/log";
import { getCourses } from "../../api/courses/get-courses";
import { deleteCourse } from "../../api/courses/delete-course";
import { getUsers } from "../../api/users/get-users";
import type { Course } from "../types/course";
import type { User } from "../types/user";
import { postRegister } from "../../api/auth/post-register";
import { deleteUser } from "../../api/auth/delete-user";
import { postCourse } from "../../api/courses/post-course";

export default function useData(
    initTab: string | "users" | "courses" = "users"
) {
    const [logs, setLogs] = useState<Log[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                if (initTab === "users") {
                    const users = await getUsers();
                    setUsers(users);
                } else if (initTab === "courses") {
                    const courses = await getCourses();
                    setCourses(courses);
                }
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
                setError(
                    err instanceof Error ? err.message : "Failed to fetch data"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [initTab]);

    const fetchLogs = async (courseId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getLogs(courseId);
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCourses();
            setCourses(data);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
        } finally {
            setLoading(false);
        }
    };

    const removeCourse = async (courseId: string) => {
        try {
            setLoading(true);
            setError(null);
            await deleteCourse(courseId);
            await fetchCourses();
        } catch (err) {
            console.error("Failed to delete course:", err);
            setError(
                err instanceof Error ? err.message : "Failed to delete data"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (
        username: string,
        password: string,
        tenant: "uvu" | "uofu",
        role: "student" | "teacher"
    ) => {
        try {
            setLoading(true);
            setError(null);
            await postRegister(username, password, tenant, role);
            const users = await getUsers();
            setUsers(users);
        } catch (err) {
            console.error("Failed to register user:", err);
            setError(
                err instanceof Error ? err.message : "Failed to register data"
            );
        } finally {
            setLoading(false);
        }
    };

    const removeUser = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            await deleteUser(userId);
            await fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError(
                err instanceof Error ? err.message : "Failed to delete data"
            );
        } finally {
            setLoading(false);
        }
    };

    const createCourse = async (
        professorId: string,
        courseName: string,
        tenant: string,
        enrolledStudents: number[]
    ) => {
        try {
            setLoading(true);
            setError(null);
            await postCourse(professorId, courseName, tenant, enrolledStudents);
            await fetchCourses();
        } catch (err) {
            console.error("Failed to create course:", err);
            setError(
                err instanceof Error ? err.message : "Failed to create data"
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        logs,
        courses,
        users,
        loading,
        error,
        fetchLogs,
        fetchCourses,
        removeCourse,
        fetchUsers,
        createUser,
        removeUser,
        createCourse,
    };
}
