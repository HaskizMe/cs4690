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
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { postLog } from "../../api/user-logs/post-log";
import type { Course } from "../types/course";

interface MessageCardProps {
    courses: Course[];
    onMessageSent?: () => void;
}

export function MessageCard({ courses, onMessageSent }: MessageCardProps) {
    const [message, setMessage] = useState<string>("");
    const [formErrors, setFormErrors] = useState<{
        course?: string;
        message?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null
    );

    const validateForm = () => {
        const errors: { course?: string; message?: string } = {};

        if (!selectedCourseId) {
            errors.course = "Please select a course";
        }

        if (!message.trim()) {
            errors.message = "Please enter a message";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSendMessage = async () => {
        if (!validateForm() || !selectedCourseId) {
            return;
        }

        setIsSubmitting(true);
        try {
            const date = new Date().toISOString().split("T")[0];
            await postLog(selectedCourseId, date, message.trim());

            // Clear form after successful submission
            setMessage("");
            setSelectedCourseId(null);
            setFormErrors({});

            // Call callback to notify parent component
            if (onMessageSent) {
                onMessageSent();
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setFormErrors({
                message: "Failed to send message. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Pencil className="h-5 w-5" />
                    Write a message
                </CardTitle>
                <CardDescription>
                    Select a course to write a message
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="course-select">Select a course</Label>
                        <Select
                            value={selectedCourseId?.toString() || ""}
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
                                <SelectValue placeholder="Select a course to write to" />
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

                    <div className="space-y-2">
                        <Label htmlFor="message-textarea">Message</Label>
                        <Textarea
                            id="message-textarea"
                            placeholder="Write your message here..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                // Clear message error when user starts typing
                                if (formErrors.message) {
                                    setFormErrors((prev) => ({
                                        ...prev,
                                        message: undefined,
                                    }));
                                }
                            }}
                            className={
                                formErrors.message ? "border-red-500" : ""
                            }
                            rows={4}
                        />
                        {formErrors.message && (
                            <p className="text-sm text-red-500 mt-1">
                                {formErrors.message}
                            </p>
                        )}
                    </div>

                    <Button
                        variant="default"
                        onClick={handleSendMessage}
                        disabled={
                            isSubmitting || !selectedCourseId || !message.trim()
                        }
                        className="w-full"
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
