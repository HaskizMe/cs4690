import { useNavigate, Outlet, useParams } from "react-router";
import { useAuth } from "../contexts/use-auth";
import { useEffect } from "react";

interface ProtectedRouteProps {
    requiredRoles?: string[];
}

export default function ProtectedRoute({ requiredRoles }: ProtectedRouteProps) {
    const { user, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const { school } = useParams();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        // Not logged in - redirect to login
        if (!user) {
            navigate(`/${school}/login`);
            return;
        }

        // Tenant mismatch - user is logged into a different tenant
        if (user.tenant !== school) {
            console.log(
                `Tenant mismatch: User logged in as ${user.tenant}, but trying to access ${school}`
            );
            logout();
            navigate(`/${school}/login`);
            return;
        }

        // Role check - user doesn't have required role
        if (requiredRoles && !requiredRoles.includes(user.role)) {
            console.log(
                `Access denied: User role '${
                    user.role
                }' not in required roles [${requiredRoles.join(", ")}]`
            );
            logout();
            navigate(`/${school}/login`);
            return;
        }
    }, [user, isLoading, navigate, school, requiredRoles, logout]);

    // Still loading
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Not authenticated or role check failed
    if (!user || user.tenant !== school) {
        return null;
    }

    // Role check failed
    if (requiredRoles && !requiredRoles.includes(user.role)) {
        return null;
    }

    return <Outlet />;
}
