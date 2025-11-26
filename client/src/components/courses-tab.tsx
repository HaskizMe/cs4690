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
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import type { Course } from "../types/course";
import type { Log } from "../types/log";
import type { User } from "../types/user";
import { useState } from "react";
import { useAuth } from "../contexts/use-auth";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";

interface CoursesTabProps {
    courses: Course[];
    refetchLogs: (courseId: string) => void;
    logs: Log[];
    logsLoading?: boolean;
    removeCourse: (courseId: string) => void;
    students: User[];
    createCourse?: (
        professorId: string,
        courseName: string,
        tenant: string,
        enrolledStudents: number[]
    ) => Promise<void>;
}

export default function CoursesTab({
    courses,
    refetchLogs,
    logs,
    logsLoading = false,
    removeCourse,
    students,
    createCourse,
}: CoursesTabProps) {
    const { school } = useParams();
    const { user } = useAuth();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    );
    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

    const onViewLogs = (courseId: string) => {
        setSelectedCourseId(courseId);
        refetchLogs(courseId);
    };

    const handleCreateCourse = async () => {
        if (!createCourse || !user?.id || !school) {
            console.error("Missing required data:", {
                hasCreateCourse: !!createCourse,
                userId: user?.id,
                school,
            });
            return;
        }
        try {
            await createCourse(
                user.id.toString(),
                courseName,
                school,
                selectedStudents
            );
            setCourseName("");
            setSelectedStudents([]);
            setCreateCourseDialogOpen(false);
        } catch (error) {
            console.error("Failed to create course:", error);
        }
    };

    const toggleStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            All Courses
                        </CardTitle>
                        <CardDescription>
                            View and manage all courses in the system
                        </CardDescription>
                    </div>
                    {user && user.role === "teacher" && (
                        <Dialog
                            open={createCourseDialogOpen}
                            onOpenChange={setCreateCourseDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Course
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create New Course</DialogTitle>
                                    <DialogDescription>
                                        Add a new course and select students to
                                        enroll
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="course-name">
                                            Course Name
                                        </Label>
                                        <Input
                                            id="course-name"
                                            placeholder="e.g., Introduction to CS"
                                            value={courseName}
                                            onChange={(e) =>
                                                setCourseName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Select Students</Label>
                                        <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                                            {students.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    No students available
                                                </p>
                                            ) : (
                                                students.map((student) => (
                                                    <div
                                                        key={student.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`student-${student.id}`}
                                                            checked={selectedStudents.includes(
                                                                Number(
                                                                    student.id
                                                                )
                                                            )}
                                                            onChange={() =>
                                                                toggleStudent(
                                                                    Number(
                                                                        student.id
                                                                    )
                                                                )
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                        <Label
                                                            htmlFor={`student-${student.id}`}
                                                            className="cursor-pointer text-sm font-normal"
                                                        >
                                                            {student.username}
                                                        </Label>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setCreateCourseDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreateCourse}
                                            disabled={
                                                !courseName.trim() ||
                                                selectedStudents.length === 0
                                            }
                                        >
                                            Create Course
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
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
                                    <Dialog
                                        open={
                                            deleteDialogOpen &&
                                            courseToDelete === course._id
                                        }
                                        onOpenChange={(open) => {
                                            if (!open) {
                                                setDeleteDialogOpen(false);
                                                setCourseToDelete(null);
                                            }
                                        }}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => {
                                                    setCourseToDelete(
                                                        course._id
                                                    );
                                                    setDeleteDialogOpen(true);
                                                }}
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
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setDeleteDialogOpen(
                                                            false
                                                        );
                                                        setCourseToDelete(null);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        if (courseToDelete) {
                                                            await removeCourse(
                                                                courseToDelete
                                                            );
                                                            setDeleteDialogOpen(
                                                                false
                                                            );
                                                            setCourseToDelete(
                                                                null
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
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
