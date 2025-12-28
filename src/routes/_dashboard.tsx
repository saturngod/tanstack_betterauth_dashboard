import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { authMiddleware } from "@/lib/auth-middleware";

export const Route = createFileRoute("/_dashboard")({
    component: DashboardLayoutRoute,
    // @ts-ignore
    server: {
        middleware: [authMiddleware]
    }
});

function DashboardLayoutRoute() {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}
