import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import CardTable from "./card-table";
import type { User } from "@/types/user";
import { useParams } from "react-router";
import { useAuth } from "../contexts/use-auth";

interface UserTabProps {
    users: User[];
    createUser: (
        username: string,
        password: string,
        tenant: "uvu" | "uofu",
        role: "student" | "teacher"
    ) => Promise<void>;
    removeUser: (userId: string) => Promise<void>;
}

export default function UserTab({
    users,
    createUser,
    removeUser,
}: UserTabProps) {
    const { school } = useParams();
    const { user } = useAuth();

    const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
    const [newUserRole, setNewUserRole] = useState("teacher");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async () => {
        if (!school || !newUsername || !newPassword) return;
        await createUser(
            newUsername,
            newPassword,
            school as "uvu" | "uofu",
            newUserRole as "student" | "teacher"
        );
        setCreateUserDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Users</h2>

                {user && user.role === "admin" && (
                    <Dialog
                        open={createUserDialogOpen}
                        onOpenChange={setCreateUserDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>
                                    Add a new teacher or student to the system
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={newUserRole}
                                        onValueChange={setNewUserRole}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="teacher">
                                                Teacher
                                            </SelectItem>
                                            <SelectItem value="student">
                                                Student
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Enter username"
                                        value={newUsername}
                                        onChange={(e) =>
                                            setNewUsername(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleSubmit}
                                >
                                    Create User
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <CardTable users={users} removeUser={removeUser} />
        </div>
    );
}
