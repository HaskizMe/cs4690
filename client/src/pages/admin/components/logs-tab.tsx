import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface LogsTabProps {
    logs: any[];
}

export default function LogsTab({ logs }: LogsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Activity Logs
                </CardTitle>
                <CardDescription>
                    View all student activity across the system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium">
                                    {log.student}
                                </TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {log.timestamp}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {log.details}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
