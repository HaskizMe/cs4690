import { useState } from "react";
import UserTab from "../../components/users-tab";
import CoursesTab from "../../components/courses-tab";
import useData from "../../hooks/use-data";
import { MessageCard } from "../../components/message-card";
import { EnrollStudentCard } from "../../components/enroll-student-card";
import { patchEnrollment } from "../../../api/enrollment/patch-enrollment";
import { patchUnenrollment } from "../../../api/enrollment/patch-unenrollment";

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
        fetchCourses,
        removeCourse,
        createCourse,
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
                <div className="space-y-6">
                    <MessageCard
                        courses={courses}
                        onMessageSent={() => {
                            console.log("Message sent");
                        }}
                    />
                    <EnrollStudentCard
                        courses={courses}
                        students={users.filter(
                            (user) => user.role === "student"
                        )}
                        onEnrollStudent={async (studentId, courseId) => {
                            await patchEnrollment(courseId, studentId);
                            await fetchCourses();
                            console.log(
                                `Admin enrolling student ${studentId} in course ${courseId}`
                            );
                            // TODO: Implement actual enrollment API call
                        }}
                        onUnenrollStudent={async (studentId, courseId) => {
                            await patchUnenrollment(courseId, studentId);
                            await fetchCourses();
                            console.log(
                                `Admin unenrolling student ${studentId} from course ${courseId}`
                            );
                            // TODO: Implement actual unenrollment API call
                        }}
                    />
                    <CoursesTab
                        courses={courses}
                        refetchLogs={fetchLogs}
                        logs={logs}
                        logsLoading={loading}
                        removeCourse={removeCourse}
                        students={users.filter(
                            (user) => user.role === "student"
                        )}
                        teachers={users.filter(
                            (user) => user.role === "teacher"
                        )}
                        createCourse={createCourse}
                    />
                </div>
            )}
        </div>
    );
}
