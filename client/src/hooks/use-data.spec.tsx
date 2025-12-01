import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useData from "./use-data";
import { getLogs } from "../../api/user-logs/get-logs";
import { getCourses } from "../../api/courses/get-courses";
import { deleteCourse } from "../../api/courses/delete-course";
import { getUsers } from "../../api/users/get-users";
import { postRegister } from "../../api/auth/post-register";
import { deleteUser } from "../../api/auth/delete-user";
import { postCourse } from "../../api/courses/post-course";

// Mock all API modules
vi.mock("../../api/user-logs/get-logs");
vi.mock("../../api/courses/get-courses");
vi.mock("../../api/courses/delete-course");
vi.mock("../../api/users/get-users");
vi.mock("../../api/auth/post-register");
vi.mock("../../api/auth/delete-user");
vi.mock("../../api/courses/post-course");

describe("useData Hook", () => {
    const mockUsers = [
        {
            _id: "user1",
            uvu_id: 12000000,
            username: "student_uvu",
            role: "student",
            tenant: "uvu",
        },
        {
            _id: "user2",
            uvu_id: 11000000,
            username: "teacher_uvu",
            role: "teacher",
            tenant: "uvu",
        },
    ];

    const mockCourses = [
        {
            _id: "course1",
            course_name: "CS 4660",
            enrolled_students: [12000000],
            professor_id: 11000000,
            tenant: "uvu",
        },
        {
            _id: "course2",
            course_name: "CS 3380",
            enrolled_students: [12000000],
            professor_id: 11000000,
            tenant: "uvu",
        },
    ];

    const mockLogs = [
        {
            _id: "log1",
            course_id: "course1",
            uvu_id: "12000000",
            date: "1/23/2021 1:23:36 PM",
            text: "Test log",
            tenant: "uvu",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("Initial Data Fetching", () => {
        it("should fetch users when initTab is 'users'", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);

            const { result } = renderHook(() => useData("users"));

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(getUsers).toHaveBeenCalledTimes(1);
            expect(result.current.users).toEqual(mockUsers);
            expect(result.current.error).toBeNull();
        });

        it("should fetch courses when initTab is 'courses'", async () => {
            vi.mocked(getCourses).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useData("courses"));

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(getCourses).toHaveBeenCalledWith({});
            expect(result.current.courses).toEqual(mockCourses);
            expect(result.current.error).toBeNull();
        });

        it("should handle fetch error for users", async () => {
            const errorMessage = "Failed to fetch users";
            vi.mocked(getUsers).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBe(errorMessage);
            expect(result.current.users).toEqual([]);
        });

        it("should handle fetch error for courses", async () => {
            const errorMessage = "Failed to fetch courses";
            vi.mocked(getCourses).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useData("courses"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBe(errorMessage);
            expect(result.current.courses).toEqual([]);
        });
    });

    describe("fetchLogs", () => {
        it("should fetch logs for a specific course", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(getLogs).mockResolvedValue(mockLogs);

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.fetchLogs("course1");

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(getLogs).toHaveBeenCalledWith("course1");
            expect(result.current.logs).toEqual(mockLogs);
        });

        it("should handle fetchLogs error", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(getLogs).mockRejectedValue(
                new Error("Failed to fetch logs")
            );

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.fetchLogs("course1");

            await waitFor(() => {
                expect(result.current.error).toBe("Failed to fetch logs");
            });
        });
    });

    describe("fetchCourses", () => {
        it("should fetch all courses", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(getCourses).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.fetchCourses();

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(getCourses).toHaveBeenCalledWith({});
            expect(result.current.courses).toEqual(mockCourses);
        });
    });

    describe("removeCourse", () => {
        it("should delete a course and refresh courses list", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(deleteCourse).mockResolvedValue(undefined);
            vi.mocked(getCourses).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.removeCourse("course1");

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(deleteCourse).toHaveBeenCalledWith("course1");
            expect(getCourses).toHaveBeenCalledWith({});
            expect(result.current.error).toBeNull();
        });

        it("should handle removeCourse error", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(deleteCourse).mockRejectedValue(
                new Error("Failed to delete course")
            );

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.removeCourse("course1");

            await waitFor(() => {
                expect(result.current.error).toBe("Failed to delete course");
            });
        });
    });

    describe("fetchUsers", () => {
        it("should fetch all users", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);

            const { result } = renderHook(() => useData("courses"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.fetchUsers();

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(getUsers).toHaveBeenCalled();
            expect(result.current.users).toEqual(mockUsers);
        });
    });

    describe("createUser", () => {
        it("should create a new user and refresh users list", async () => {
            vi.mocked(getCourses).mockResolvedValue(mockCourses);
            vi.mocked(postRegister).mockResolvedValue(undefined);
            vi.mocked(getUsers).mockResolvedValue(mockUsers);

            const { result } = renderHook(() => useData("courses"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.createUser(
                "newstudent",
                "password123",
                "uvu",
                "student"
            );

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(postRegister).toHaveBeenCalledWith(
                "newstudent",
                "password123",
                "uvu",
                "student"
            );
            expect(getUsers).toHaveBeenCalled();
            expect(result.current.users).toEqual(mockUsers);
        });

        it("should handle createUser error", async () => {
            vi.mocked(getCourses).mockResolvedValue(mockCourses);
            vi.mocked(postRegister).mockRejectedValue(
                new Error("Failed to register user")
            );

            const { result } = renderHook(() => useData("courses"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.createUser(
                "newstudent",
                "password123",
                "uvu",
                "student"
            );

            await waitFor(() => {
                expect(result.current.error).toBe("Failed to register user");
            });
        });
    });

    describe("removeUser", () => {
        it("should delete a user and refresh users list", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(deleteUser).mockResolvedValue(undefined);

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.removeUser("user1");

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(deleteUser).toHaveBeenCalledWith("user1");
            expect(getUsers).toHaveBeenCalled();
            expect(result.current.error).toBeNull();
        });

        it("should handle removeUser error", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(deleteUser).mockRejectedValue(
                new Error("Failed to delete user")
            );

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.removeUser("user1");

            await waitFor(() => {
                expect(result.current.error).toBe("Failed to delete user");
            });
        });
    });

    describe("createCourse", () => {
        it("should create a new course and refresh courses list", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(postCourse).mockResolvedValue(undefined);
            vi.mocked(getCourses).mockResolvedValue(mockCourses);

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.createCourse("11000000", "CS 5000", "uvu", [
                12000000,
            ]);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(postCourse).toHaveBeenCalledWith(
                "11000000",
                "CS 5000",
                "uvu",
                [12000000]
            );
            expect(getCourses).toHaveBeenCalledWith({});
            expect(result.current.courses).toEqual(mockCourses);
        });

        it("should handle createCourse error", async () => {
            vi.mocked(getUsers).mockResolvedValue(mockUsers);
            vi.mocked(postCourse).mockRejectedValue(
                new Error("Failed to create course")
            );

            const { result } = renderHook(() => useData("users"));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            result.current.createCourse("11000000", "CS 5000", "uvu", [
                12000000,
            ]);

            await waitFor(() => {
                expect(result.current.error).toBe("Failed to create course");
            });
        });
    });

    describe("Loading States", () => {
        it("should set loading to true during fetch operations", async () => {
            vi.mocked(getUsers).mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(() => resolve(mockUsers), 100)
                    )
            );

            const { result } = renderHook(() => useData("users"));

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });
    });
});
