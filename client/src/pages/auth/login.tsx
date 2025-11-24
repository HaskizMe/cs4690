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
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";

export default function Login() {
    const { school } = useParams();
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.documentElement.className = `tenant-${school}`;
    }, [school]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password, school as "uvu" | "uofu");
            // Redirect to dashboard or home page after successful login
            navigate("/dashboard");
        } catch {
            // Error is handled by the hook and displayed below
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
                                <Link to={`/${school}/signup`}>Sign Up</Link>
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
