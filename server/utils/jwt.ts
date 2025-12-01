import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "24h";

export interface TokenPayload {
    userId: string;
    username: string;
    role: string;
    tenant: string;
}

export const jwtUtils = {
    // Generate JWT token
    generateToken: (payload: TokenPayload): string => {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    },

    // Verify JWT token
    verifyToken: (token: string): TokenPayload | null => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
            return decoded;
        } catch (error) {
            console.error("Token verification error:", error);
            return null;
        }
    },

    // Extract token from Authorization header
    extractToken: (authHeader: string | undefined): string | null => {
        if (!authHeader) return null;
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") return null;
        return parts[1];
    },
};
