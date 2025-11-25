import { Outlet } from "react-router";
import TopNav from "@/components/layouts/top-nav";

export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen">
            <TopNav />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
