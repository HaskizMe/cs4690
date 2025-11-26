import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BookOpen, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import type { Course } from "../types/course";
import type { Log } from "../types/log";
import { useState } from "react";

interface CoursesTabProps {
    courses: Course[];
    refetchLogs: (courseId: string) => void;
    logs: Log[];
    logsLoading?: boolean;
    removeCourse: (courseId: string) => void;
}

export default function CoursesTab({
    courses,
    refetchLogs,
    logs,
    logsLoading = false,
    removeCourse,
}: CoursesTabProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    );

    const onViewLogs = (courseId: string) => {
        setSelectedCourseId(courseId);
        refetchLogs(courseId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    All Courses
                </CardTitle>
                <CardDescription>
                    View and manage all courses in the system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Professor ID</TableHead>
                            <TableHead>Students Enrolled</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course._id}>
                                <TableCell className="font-medium">
                                    {course.course_name}
                                </TableCell>
                                <TableCell>{course.professor_id}</TableCell>
                                <TableCell>
                                    {course.enrolled_students.length}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onViewLogs(course._id)}
                                    >
                                        View Logs
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    removeCourse(course._id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Delete Course
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to
                                                    delete this course?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button>Delete</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Logs Modal Dialog */}
            <Dialog
                open={selectedCourseId !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedCourseId(null);
                }}
            >
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Course Logs</DialogTitle>
                        <DialogDescription>
                            View all activity logs for this course
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {logsLoading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Loading logs...
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No logs found for this course
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className="border rounded-lg p-3 space-y-1"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-sm">
                                                Student ID: {log.uvu_id}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {log.date}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {log.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
