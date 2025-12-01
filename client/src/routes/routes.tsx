import { createBrowserRouter } from "react-router";
import SchoolSelector from "../pages/school-selector";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import AdminPage from "../pages/admin/admin-page";
import TeacherPage from "../pages/teacher/teacher-page";
import StudentPage from "../pages/student/student-page";
import ProtectedRoute from "./protected-route";
import AppLayout from "../components/layouts/app-layout";

export const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                path: "",
                element: <SchoolSelector />,
            },
            {
                path: ":school/login",
                element: <Login />,
            },
            {
                path: ":school/signup",
                element: <Signup />,
            },
            {
                path: ":school",
                element: <AppLayout />,
                children: [
                    {
                        element: <ProtectedRoute />,
                        children: [
                            {
                                path: "admin",
                                element: (
                                    <ProtectedRoute requiredRoles={["admin"]} />
                                ),
                                children: [
                                    {
                                        path: "",
                                        element: <AdminPage />,
                                    },
                                ],
                            },
                            {
                                path: "teacher",
                                element: (
                                    <ProtectedRoute
                                        requiredRoles={["teacher"]}
                                    />
                                ),
                                children: [
                                    {
                                        path: "",
                                        element: <TeacherPage />,
                                    },
                                ],
                            },
                            {
                                path: "student",
                                element: (
                                    <ProtectedRoute
                                        requiredRoles={["student"]}
                                    />
                                ),
                                children: [
                                    {
                                        path: "",
                                        element: <StudentPage />,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
