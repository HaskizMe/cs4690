import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/use-auth";
import { Link } from "react-router";
import { validateToken } from "../../../api/auth/validate-token";
import { toast } from "sonner";

export default function Login() {
    const { school } = useParams();
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.documentElement.className = `tenant-${school}`;
        const autoLogin = async () => {
            const raw = localStorage.getItem("mega-practicum-auth-token");
            if (raw) {
                try {
                    const session = JSON.parse(raw);
                    if (session?.token) {
                        // Validate token with server
                        try {
                            await validateToken();
                            navigate(
                                `/${session.user.tenant}/${session.user.role}`
                            );
                        } catch (err) {
                            // Token is invalid or expired
                            console.error("Token validation failed:", err);
                            localStorage.removeItem(
                                "mega-practicum-auth-token"
                            );
                        }
                    }
                } catch (err) {
                    console.error("Failed to parse stored session:", err);
                    localStorage.removeItem("mega-practicum-auth-token");
                }
            }
        };

        autoLogin();
    }, [school, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = await login(
                username,
                password,
                school as "uvu" | "uofu"
            );
            navigate(`/${school}/${authData.user.role}`);
        } catch {
            toast.error("Login failed");
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4 gap-4">
            {school === "uvu" && (
                <img
                    src="https://www.uvu.edu/marketing/images/guide/bg_2-1_primary_monogram.png"
                    width="180"
                    height="80"
                    alt="UVU logo"
                />
            )}
            {school === "uofu" && (
                <img
                    src="https://templates.utah.edu/_main-v3-1/images/template/uu-logo-vertical.svg"
                    alt="UofU logo"
                />
            )}
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="space-y-2">
                        <CardTitle className="flex flex-col gap-4">
                            <h1>Sign Up</h1>
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account
                        </CardDescription>
                        <CardAction>
                            <Button variant="link">
                                <Link to={`/${school}/signup`}>
                                    Register as Student
                                </Link>
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    value={username}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>
                        <Link to={"/"}>
                            <Button variant="outline">Select School</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
