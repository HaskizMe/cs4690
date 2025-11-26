import { useState } from "react";
import UserTab from "../../components/users-tab";
import CoursesTab from "../../components/courses-tab";
import useData from "../../hooks/use-data";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("users");

    const {
        logs,
        courses,
        users,
        loading,
        fetchLogs,
        createUser,
        removeUser,
        removeCourse,
    } = useData(activeTab);

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
            </div>

            {activeTab === "users" && (
                <UserTab
                    users={users}
                    createUser={createUser}
                    removeUser={removeUser}
                />
            )}

            {activeTab === "courses" && (
                <CoursesTab
                    courses={courses}
                    refetchLogs={fetchLogs}
                    logs={logs}
                    logsLoading={loading}
                    removeCourse={removeCourse}
                    students={users}
                />
            )}
        </div>
    );
}
