import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { getCourses } from "../../../api/courses/get-courses";
import { useEffect } from "react";

export default function StudentPage() {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const fetchData = async () => {
            const courses = await getCourses();
            console.log(courses);
        };
        fetchData();
    }, []);

    // Mock data - will be replaced with actual API calls
    const myCourses = [
        {
            id: 1,
            name: "Introduction to Computer Science",
            code: "CS101",
            instructor: "Dr. Smith",
            status: "Active",
            logs: [
                {
                    id: 1,
                    timestamp: "2025-11-25 10:30 AM",
                    action: "Joined course",
                    details: "Successfully enrolled in CS101",
                },
                {
                    id: 2,
                    timestamp: "2025-11-24 3:00 PM",
                    action: "Submitted assignment",
                    details: "Assignment 1 submitted",
                },
                {
                    id: 3,
                    timestamp: "2025-11-23 11:15 AM",
                    action: "Viewed course materials",
                    details: "Accessed lecture notes",
                },
            ],
        },
        {
            id: 2,
            name: "Data Structures",
            code: "CS201",
            instructor: "Dr. Johnson",
            status: "Active",
            logs: [
                {
                    id: 4,
                    timestamp: "2025-11-25 2:15 PM",
                    action: "Submitted assignment",
                    details: "Assignment 3 submitted",
                },
                {
                    id: 5,
                    timestamp: "2025-11-23 9:45 AM",
                    action: "Viewed course materials",
                    details: "Accessed lecture notes",
                },
            ],
        },
    ];

    const selectedCourse = myCourses.find((c) => c.id === selectedCourseId);
    const courseLogs = selectedCourse?.logs || [];

    return (
        <div className="w-3xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Student Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your courses and view activity logs
                </p>
            </div>

            <div className="space-y-6">
                {/* Join Course Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Join a Course
                        </CardTitle>
                        <CardDescription>
                            Select a course to join
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="course-select">
                                Available Courses
                            </Label>
                            <Select
                                value={selectedCourseId?.toString() || ""}
                                onValueChange={(value) =>
                                    setSelectedCourseId(parseInt(value))
                                }
                            >
                                <SelectTrigger id="course-select">
                                    <SelectValue placeholder="Select a course to join" />
                                </SelectTrigger>
                                <SelectContent>
                                    {myCourses.map((course) => (
                                        <SelectItem
                                            key={course.id}
                                            value={course.id.toString()}
                                        >
                                            {course.code} - {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

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
                                        key={course.id}
                                        onClick={() =>
                                            setSelectedCourseId(course.id)
                                        }
                                        className={`border rounded-lg p-4 transition-colors cursor-pointer group ${
                                            selectedCourseId === course.id
                                                ? "bg-primary/10 border-primary"
                                                : "hover:bg-muted/50"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                    {course.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {course.code} •{" "}
                                                    {course.instructor}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                                    {course.status}
                                                </span>
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
                                Activity for {selectedCourse.code}
                            </CardTitle>
                            <CardDescription>
                                {selectedCourse.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {courseLogs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">
                                        No activity yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {courseLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="border-l-2 border-primary pl-4 pb-4 last:pb-0"
                                        >
                                            <p className="text-xs text-muted-foreground">
                                                {log.timestamp}
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                {log.action}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {log.details}
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
