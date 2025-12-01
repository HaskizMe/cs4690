import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/contexts/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function TopNav() {
    const { school } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const tenantClass = `tenant-${school}`;

    return (
        <nav
            className={`${tenantClass} bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md`}
        >
            <div className="px-6 py-4 flex items-center justify-between">
                {/* Logo and School Name */}
                <div className="flex items-center gap-4">
                    {school === "uvu" && (
                        <img
                            src="https://www.uvu.edu/marketing/images/guide/bg_2-1_primary_monogram.png"
                            width="40"
                            height="40"
                            alt="UVU logo"
                            className="h-10 w-auto"
                        />
                    )}
                    {school === "uofu" && (
                        <img
                            src="https://i.etsystatic.com/23898732/r/il/6476da/2451425237/il_570xN.2451425237_iqjk.jpg"
                            width="100"
                            height="100"
                            alt="UofU logo"
                            className="h-10 w-auto"
                        />
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium">{user?.username}</p>
                        <p className="text-xs opacity-75 capitalize">
                            {user?.role}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]/10"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
