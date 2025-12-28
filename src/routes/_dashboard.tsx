import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { authMiddleware } from "@/lib/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

const getSession = createServerFn({ method: 'GET' }).handler(async () => {
    const headers = getRequestHeaders();
    return await auth.api.getSession({ headers });
});

export const Route = createFileRoute("/_dashboard")({
    beforeLoad: async () => {
        const session = await getSession();
        return {
            session: session || null,
        }
    },
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
