import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function SchoolSelector() {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <Button onClick={() => navigate("/uvu/login")}>
                Utah Valley University
            </Button>
            <Button onClick={() => navigate("/uofu/login")}>
                University of Utah
            </Button>
        </div>
    );
}
