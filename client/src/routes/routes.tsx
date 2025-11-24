import { createBrowserRouter } from "react-router";
import SchoolSelector from "../pages/school-selector";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import Dashboard from "../pages/dashboard";

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
                path: ":school/dashboard",
                element: <Dashboard />,
            },
        ],
    },
]);
