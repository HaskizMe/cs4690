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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
    const { school } = useParams();
    const navigate = useNavigate();
    const { isLoading, register } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");

    useEffect(() => {
        document.documentElement.className = `tenant-${school}`;
    }, [school]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = await register(
                username,
                password,
                school as "uvu" | "uofu",
                role as "student" | "teacher"
            );
            navigate(`/${school}/${authData.user.role}`);
        } catch {
            toast.error("Registration failed");
        }
    };

    return (
        <>
            <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
                <div className="w-full max-w-md">
                    <Card>
                        <CardHeader className="space-y-2">
                            <CardTitle className="flex flex-col gap-4">
                                <Link to={`/${school}/login`}>
                                    <Button
                                        variant="outline"
                                        size="default"
                                        className="w-fit"
                                    >
                                        <ChevronLeft />
                                    </Button>
                                </Link>
                                <h1>Sign Up</h1>
                            </CardTitle>
                            <CardDescription>
                                Sign up for an account
                            </CardDescription>
                            <CardAction>
                                <Select
                                    defaultValue={role}
                                    onValueChange={setRole}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="teacher">
                                            Teacher
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="space-y-2">
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
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing Up..." : "Sign Up"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
