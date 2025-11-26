import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit2, Users, Activity, UserPlus } from "lucide-react";

export default function TeacherPage() {
    const [activeTab, setActiveTab] = useState("courses");
    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false);
    const [createTADialogOpen, setCreateTADialogOpen] = useState(false);
    const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    );

    // Form states
    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [taUsername, setTaUsername] = useState("");
    const [taPassword, setTaPassword] = useState("");
    const [studentUsername, setStudentUsername] = useState("");

    // Mock data - will be replaced with actual API calls
    const courses = [
        {
            id: 1,
            code: "CS101",
            name: "Introduction to Computer Science",
            description: "Fundamentals of computer science and programming",
            students: 45,
            tas: 2,
            createdAt: "2025-11-01",
        },
        {
            id: 2,
            code: "CS201",
            name: "Data Structures",
            description: "Advanced data structures and algorithms",
            students: 32,
            tas: 1,
            createdAt: "2025-11-05",
        },
    ];

    const tas = [
        {
            id: 1,
            username: "ta_alex",
            email: "alex@university.edu",
            course: "CS101",
            createdAt: "2025-11-10",
        },
        {
            id: 2,
            username: "ta_sam",
            email: "sam@university.edu",
            course: "CS101",
            createdAt: "2025-11-12",
        },
    ];

    const students = [
        {
            id: 1,
            username: "student_john",
            email: "john@university.edu",
            course: "CS101",
            enrolledAt: "2025-11-15",
        },
        {
            id: 2,
            username: "student_jane",
            email: "jane@university.edu",
            course: "CS101",
            enrolledAt: "2025-11-15",
        },
        {
            id: 3,
            username: "student_bob",
            email: "bob@university.edu",
            course: "CS201",
            enrolledAt: "2025-11-16",
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
            details: "Assignment 3 submitted",
        },
        {
            id: 3,
            student: "Bob Johnson",
            action: "Viewed course materials",
            timestamp: "2025-11-24 11:45 AM",
            details: "Accessed lecture notes",
        },
    ];

    return (
        <div className="w-full mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your courses, students, and view activity logs
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab("courses")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "courses"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    My Courses
                </button>
                <button
                    onClick={() => setActiveTab("students")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "students"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Students
                </button>
                <button
                    onClick={() => setActiveTab("tas")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "tas"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    TAs
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

            {/* Courses Tab */}
            {activeTab === "courses" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">My Courses</h2>
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
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Course</DialogTitle>
                                    <DialogDescription>
                                        Add a new course to your teaching
                                        portfolio
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="course-code">
                                            Course Code
                                        </Label>
                                        <Input
                                            id="course-code"
                                            placeholder="e.g., CS101"
                                            value={courseCode}
                                            onChange={(e) =>
                                                setCourseCode(e.target.value)
                                            }
                                        />
                                    </div>
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
                                        <Label htmlFor="course-description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="course-description"
                                            placeholder="Course description"
                                            value={courseDescription}
                                            onChange={(e) =>
                                                setCourseDescription(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            // TODO: Create course
                                            setCreateCourseDialogOpen(false);
                                        }}
                                    >
                                        Create Course
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <Card
                                key={course.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setSelectedCourseId(course.id)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{course.code}</span>
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {course.students} students
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        {course.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        {course.description}
                                    </p>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-muted-foreground">
                                            TAs: {course.tas}
                                        </span>
                                        <span className="text-muted-foreground">
                                            •
                                        </span>
                                        <span className="text-muted-foreground">
                                            Created: {course.createdAt}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Manage Students</h2>
                        <Dialog
                            open={addStudentDialogOpen}
                            onOpenChange={setAddStudentDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Add Student
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Add Student to Course
                                    </DialogTitle>
                                    <DialogDescription>
                                        Add an existing student to one of your
                                        courses
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="course-select">
                                            Select Course
                                        </Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem
                                                        key={course.id}
                                                        value={course.id.toString()}
                                                    >
                                                        {course.code} -{" "}
                                                        {course.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="student-username">
                                            Student Username
                                        </Label>
                                        <Input
                                            id="student-username"
                                            placeholder="Enter student username"
                                            value={studentUsername}
                                            onChange={(e) =>
                                                setStudentUsername(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            // TODO: Add student to course
                                            setAddStudentDialogOpen(false);
                                        }}
                                    >
                                        Add Student
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                All Students ({students.length})
                            </CardTitle>
                            <CardDescription>
                                Students enrolled in your courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Enrolled</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                {student.username}
                                            </TableCell>
                                            <TableCell>
                                                {student.email}
                                            </TableCell>
                                            <TableCell>
                                                {student.course}
                                            </TableCell>
                                            <TableCell>
                                                {student.enrolledAt}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* TAs Tab */}
            {activeTab === "tas" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Manage TAs</h2>
                        <Dialog
                            open={createTADialogOpen}
                            onOpenChange={setCreateTADialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create TA
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New TA</DialogTitle>
                                    <DialogDescription>
                                        Add a new teaching assistant to your
                                        courses
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ta-course">
                                            Assign to Course
                                        </Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem
                                                        key={course.id}
                                                        value={course.id.toString()}
                                                    >
                                                        {course.code} -{" "}
                                                        {course.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ta-username">
                                            Username
                                        </Label>
                                        <Input
                                            id="ta-username"
                                            placeholder="Enter TA username"
                                            value={taUsername}
                                            onChange={(e) =>
                                                setTaUsername(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ta-password">
                                            Password
                                        </Label>
                                        <Input
                                            id="ta-password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={taPassword}
                                            onChange={(e) =>
                                                setTaPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            // TODO: Create TA
                                            setCreateTADialogOpen(false);
                                        }}
                                    >
                                        Create TA
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Teaching Assistants ({tas.length})
                            </CardTitle>
                            <CardDescription>
                                TAs assigned to your courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tas.map((ta) => (
                                        <TableRow key={ta.id}>
                                            <TableCell className="font-medium">
                                                {ta.username}
                                            </TableCell>
                                            <TableCell>{ta.email}</TableCell>
                                            <TableCell>{ta.course}</TableCell>
                                            <TableCell>
                                                {ta.createdAt}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Logs Tab */}
            {activeTab === "logs" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Activity Logs
                        </CardTitle>
                        <CardDescription>
                            View all activity from your courses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {log.student}
                                        </TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.details}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
