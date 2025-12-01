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
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/use-auth";
import type { Course } from "../types/course";
import type { User } from "../types/user";

interface EnrollStudentCardProps {
    courses: Course[];
    students?: User[];
    onEnrollStudent?: (studentId: number, courseId: string) => void;
    onUnenrollStudent?: (studentId: number, courseId: string) => void;
}

export function EnrollStudentCard({
    courses,
    students,
    onEnrollStudent,
    onUnenrollStudent,
}: EnrollStudentCardProps) {
    const { user } = useAuth();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<{
        course?: string;
        student?: string;
    }>({});

    const isStudentPage = students === undefined; // If no students prop, this is student page

    // Get the effective student ID (current user or selected student)
    const getEffectiveStudentId = () => {
        return isStudentPage ? user?.id : parseInt(selectedStudentId);
    };

    // Check if the student is already enrolled in the selected course
    const isStudentEnrolled = () => {
        if (!selectedCourseId) return false;

        const selectedCourse = courses.find(
            (course) => course._id === selectedCourseId
        );
        const studentId = getEffectiveStudentId();

        return (
            selectedCourse?.enrolled_students.includes(studentId as number) ||
            false
        );
    };

    const validateForm = () => {
        const errors: { course?: string; student?: string } = {};

        if (!selectedCourseId) {
            errors.course = "Please select a course";
        }

        // If not student page (students provided), require student selection
        if (!isStudentPage && !selectedStudentId) {
            errors.student = "Please select a student";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEnrollStudent = async () => {
        if (!validateForm()) {
            return;
        }

        const isEnrolled = isStudentEnrolled();
        const handler = isEnrolled ? onUnenrollStudent : onEnrollStudent;

        if (!handler) {
            console.error(
                `No ${
                    isEnrolled ? "unenrollment" : "enrollment"
                } handler provided`
            );
            return;
        }

        setIsSubmitting(true);
        try {
            // If student page, use current user's ID; otherwise use selected student ID
            const studentId = isStudentPage
                ? user?.id.toString() || ""
                : selectedStudentId;

            await handler(Number(studentId), selectedCourseId);

            // Clear form after successful enrollment/unenrollment
            setSelectedCourseId("");
            setSelectedStudentId("");
            setFormErrors({});
        } catch (error) {
            console.error(
                `Failed to ${isEnrolled ? "unenroll" : "enroll"} student:`,
                error
            );
            setFormErrors({
                course: `Failed to ${
                    isEnrolled ? "unenroll" : "enroll"
                } student. Please try again.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    {isStudentPage ? "Enroll in Course" : "Enroll Student"}
                </CardTitle>
                <CardDescription>
                    {isStudentPage
                        ? "Select a course to enroll yourself in"
                        : "Select a student and course for enrollment"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Student Selection - Only when students provided */}
                    {!isStudentPage && students && students.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="student-select">
                                Select Student
                            </Label>
                            <Select
                                value={selectedStudentId}
                                onValueChange={(value) => {
                                    setSelectedStudentId(value);
                                    // Clear student error when user selects a student
                                    if (formErrors.student) {
                                        setFormErrors((prev) => ({
                                            ...prev,
                                            student: undefined,
                                        }));
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="student-select"
                                    className={
                                        formErrors.student
                                            ? "border-red-500"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem
                                            key={student.id}
                                            value={student.id.toString()}
                                        >
                                            {student.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.student && (
                                <p className="text-sm text-red-500 mt-1">
                                    {formErrors.student}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Course Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="course-select">Select Course</Label>
                        <Select
                            value={selectedCourseId}
                            onValueChange={(value) => {
                                setSelectedCourseId(value);
                                // Clear course error when user selects a course
                                if (formErrors.course) {
                                    setFormErrors((prev) => ({
                                        ...prev,
                                        course: undefined,
                                    }));
                                }
                            }}
                        >
                            <SelectTrigger
                                id="course-select"
                                className={
                                    formErrors.course ? "border-red-500" : ""
                                }
                            >
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course._id}
                                        value={course._id.toString()}
                                    >
                                        {course.course_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.course && (
                            <p className="text-sm text-red-500 mt-1">
                                {formErrors.course}
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={handleEnrollStudent}
                        disabled={
                            isSubmitting ||
                            !selectedCourseId ||
                            (!isStudentPage && !selectedStudentId)
                        }
                        className="w-full"
                    >
                        {isSubmitting
                            ? isStudentEnrolled()
                                ? "Unenrolling..."
                                : "Enrolling..."
                            : isStudentEnrolled()
                            ? isStudentPage
                                ? "Unenroll Myself"
                                : "Unenroll Student"
                            : isStudentPage
                            ? "Enroll Myself"
                            : "Enroll Student"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
