import { useEffect, useState } from "react";
import UserTab from "./components/users-tab";
import CoursesTab from "./components/courses-tab";
import LogsTab from "./components/logs-tab";
// import { getUsers } from "../../api/users/get-users";
import { getLogs } from "../../../api/user-logs/get-logs";
import { getCourses } from "../../../api/courses/get-courses";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("users");
    // const [logs, setLogs] = useState([]);
    // const [courses, setCourses] = useState([]);
    // // const [users, setUsers] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [logs, courses] = await Promise.all([
    //                 getLogs(),
    //                 getCourses(),
    //                 // getUsers(),
    //             ]);
    //             setLogs(logs);
    //             setCourses(courses);
    //             // console.log(users);
    //         } catch (error) {
    //             console.error("Failed to fetch admin data:", error);
    //             // TODO: Show error toast/notification to user
    //         }
    //     };
    //     fetchData();
    // }, []);

    const users = [
        {
            id: 1,
            username: "prof_smith",
            role: "teacher",
        },
        {
            id: 2,
            username: "student_john",
            role: "student",
        },
        {
            id: 3,
            username: "prof_johnson",
            role: "teacher",
        },
        {
            id: 4,
            username: "student_jane",
            role: "student",
        },
    ];

    const courses = [
        {
            id: 1,
            code: "CS101",
            name: "Introduction to Computer Science",
            instructor: "Prof. Smith",
            students: 45,
            createdAt: "2025-11-01",
        },
        {
            id: 2,
            code: "CS201",
            name: "Data Structures",
            instructor: "Prof. Johnson",
            students: 32,
            createdAt: "2025-11-05",
        },
    ];

    const logs = [
        {
            id: 1,
            student: "John Doe",
            action: "Enrolled in CS101",
            timestamp: "2025-11-25 10:30 AM",
            details: "Successfully enrolled",
        },
        {
            id: 2,
            student: "Jane Smith",
            action: "Submitted assignment",
            timestamp: "2025-11-25 2:15 PM",
            details: "Assignment 3 submitted for CS201",
        },
        {
            id: 3,
            student: "John Doe",
            action: "Viewed course materials",
            timestamp: "2025-11-24 11:45 AM",
            details: "Accessed lecture notes for CS101",
        },
    ];

    return (
        <div className="w-full mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage users, courses, and view system activity
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "users"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab("courses")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "courses"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Courses
                </button>
                <button
                    onClick={() => setActiveTab("logs")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "logs"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Logs
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === "users" && <UserTab users={users} />}

            {/* Courses Tab */}
            {activeTab === "courses" && <CoursesTab courses={courses} />}

            {/* Logs Tab */}
            {activeTab === "logs" && <LogsTab logs={logs} />}
        </div>
    );
}
