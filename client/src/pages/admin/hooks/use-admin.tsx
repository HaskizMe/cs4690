import { useEffect, useState } from "react";
import { getLogs } from "../../../../api/user-logs/get-logs";
import type { Log } from "../../../types/log";
import { getCourses } from "../../../../api/courses/get-courses";
// import { getUsers } from "../../../../api/users/get-users";
import type { Course } from "../../../types/course";

export default function useAdmin() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    // const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const courses = await getCourses();
                setCourses(courses);
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
    }, []);

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
            const data = await deleteCourse(courseId);
            setCourses(data);
        } catch (err) {
            console.error("Failed to delete course:", err);
            setError(
                err instanceof Error ? err.message : "Failed to delete data"
            );
        } finally {
            setLoading(false);
        }
    };

    // const fetchUsers = async () => {
    //     try {
    //         setLoading(true);
    //         setError(null);
    //         const data = await getUsers();
    //         setUsers(data);
    //     } catch (err) {
    //         console.error("Failed to fetch users:", err);
    //         setError(
    //             err instanceof Error ? err.message : "Failed to fetch data"
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return {
        logs,
        courses,
        // users,
        loading,
        error,
        fetchLogs,
        fetchCourses,
        removeCourse,
        // fetchUsers,
    };
}
