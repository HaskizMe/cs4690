/**
 * Role hierarchy and access control utilities
 */

export type UserRole = "student" | "teacher" | "admin";
export type Tenant = "uvu" | "uofu";

/**
 * Checks if a user has a required role
 */
export const hasRole = (
    userRole: UserRole,
    requiredRoles: UserRole[]
): boolean => {
    return requiredRoles.includes(userRole);
};

/**
 * Gets roles that can access a resource
 */
export const getAdminRoles = (): UserRole[] => ["admin"];

export const getTeacherRoles = (): UserRole[] => ["teacher", "admin"];

export const getStudentRoles = (): UserRole[] => [
    "student",
    "teacher",
    "admin",
];

/**
 * Checks if user can create/manage teachers (admin only)
 */
export const canManageTeachers = (role: UserRole): boolean => {
    return hasRole(role, getAdminRoles());
};

/**
 * Checks if user can view/manage students
 */
export const canManageStudents = (role: UserRole): boolean => {
    return hasRole(role, getTeacherRoles());
};

/**
 * Checks if user can view/manage classes
 */
export const canManageClasses = (role: UserRole): boolean => {
    return hasRole(role, getTeacherRoles());
};

/**
 * Checks if user can view logs
 */
export const canViewLogs = (role: UserRole): boolean => {
    return hasRole(role, getStudentRoles());
};
