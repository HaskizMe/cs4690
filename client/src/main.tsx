import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/routes.tsx";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Toaster position="top-center" className="bg-white" richColors />
        <RouterProvider router={router} />
    </StrictMode>
);
