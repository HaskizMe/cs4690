import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";
import { getCourses } from "../../../api/courses/get-courses";
import type { Course } from "@/types/course";
import type { Log } from "@/types/log";
import { getLogs } from "../../../api/user-logs/get-logs";
import { MessageCard } from "@/components/message-card";
import { EnrollStudentCard } from "@/components/enroll-student-card";
import { patchEnrollment } from "../../../api/enrollment/patch-enrollment";
import { patchUnenrollment } from "../../../api/enrollment/patch-unenrollment";

export default function StudentPage() {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    );

    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const courses = await getCourses({});
            setMyCourses(courses);
            const allCourses = await getCourses({ all: true });
            setAllCourses(allCourses);
        };
        fetchData();
    }, []);

    const refetchCourses = async () => {
        const courses = await getCourses({});
        setMyCourses(courses);
        const allCourses = await getCourses({ all: true });
        setAllCourses(allCourses);
    };

    const handleCourseClick = async (courseId: string) => {
        const logs = await getLogs(courseId);
        setLogs(logs);
        setSelectedCourseId(courseId);
    };

    const handleMessageSent = async () => {
        if (!selectedCourseId) {
            return;
        }
        const logs = await getLogs(selectedCourseId);
        setLogs(logs);
        // Refresh courses or logs if needed
        console.log("Message sent successfully");
    };

    const selectedCourse = myCourses.find((c) => c._id === selectedCourseId);
    return (
        <div className="w-5xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Student Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your courses and view activity logs
                </p>
            </div>

            <div className="space-y-6">
                {/* Message Card */}
                <MessageCard
                    courses={myCourses}
                    onMessageSent={handleMessageSent}
                />

                <EnrollStudentCard
                    courses={allCourses}
                    students={undefined}
                    onEnrollStudent={async (studentId, courseId) => {
                        await patchEnrollment(courseId, studentId);
                        await refetchCourses();
                        // Handle student enrollment
                        console.log(
                            `Enrolling student ${studentId} in course ${courseId}`
                        );
                        // TODO: Implement actual enrollment API call
                    }}
                    onUnenrollStudent={async (studentId, courseId) => {
                        await patchUnenrollment(courseId, studentId);
                        await refetchCourses();
                        // Handle student unenrollment
                        console.log(
                            `Unenrolling student ${studentId} from course ${courseId}`
                        );
                        // TODO: Implement actual unenrollment API call
                    }}
                />

                {/* Courses List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            My Courses ({myCourses.length})
                        </CardTitle>
                        <CardDescription>
                            Courses you are currently enrolled in
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {myCourses.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                    You are not enrolled in any courses yet.
                                    Join a course to get started!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myCourses.map((course) => (
                                    <div
                                        key={course._id}
                                        onClick={() => {
                                            handleCourseClick(course._id);
                                        }}
                                        className={`border rounded-lg p-4 transition-colors cursor-pointer group ${
                                            selectedCourseId === course._id
                                                ? "bg-primary/10 border-primary"
                                                : "hover:bg-muted/50"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                    {course.course_name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Course Activity Logs */}
                {selectedCourse && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Activity for {selectedCourse.course_name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {logs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">
                                        No activity yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {logs.map((log) => (
                                        <div
                                            key={log._id}
                                            className="border-l-2 border-primary pl-4 pb-4 last:pb-0"
                                        >
                                            <p className="text-xs text-muted-foreground">
                                                {log.date}
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                {log.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
