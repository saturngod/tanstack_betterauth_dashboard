import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware } from "@/lib/auth-middleware";

export const Route = createFileRoute("/_dashboard/dashboard")({
    component: () => <Outlet />,
    // @ts-ignore
    server: {
        middleware: [authMiddleware],
    },
});
