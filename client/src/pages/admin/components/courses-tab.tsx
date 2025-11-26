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

interface CoursesTabProps {
    courses: any[];
}

export default function CoursesTab({ courses }: CoursesTabProps) {
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
                            <TableHead>Code</TableHead>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Instructor</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell className="font-medium">
                                    {course.code}
                                </TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.instructor}</TableCell>
                                <TableCell>{course.students}</TableCell>
                                <TableCell>{course.createdAt}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
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
        </Card>
    );
}
