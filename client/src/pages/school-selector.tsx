import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SchoolSelector() {
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.className = "";
    }, []);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Welcome
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Select your school to get started
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle>Utah Valley University</CardTitle>
                            <CardDescription>
                                Sign in to your UVU account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Access your UVU dashboard and manage your
                                courses.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full tenant-uvu"
                                size="lg"
                                onClick={() => navigate("/uvu/login")}
                            >
                                Continue to UVU
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle>University of Utah</CardTitle>
                            <CardDescription>
                                Sign in to your UofU account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Access your University of Utah dashboard and
                                manage your courses.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full tenant-uofu"
                                size="lg"
                                onClick={() => navigate("/uofu/login")}
                            >
                                Continue to UofU
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
