import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { authMiddleware } from "@/lib/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

const getSession = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const headers = getRequestHeaders();
        return await auth.api.getSession({ headers });
    });

export const Route = createFileRoute("/_dashboard")({
    beforeLoad: async () => {
        const session = await getSession();
        if (!session) {
            throw redirect({
                to: "/login",
            });
        }
        return {
            session: session,
        };
    },
    component: DashboardLayoutRoute,
    // @ts-ignore
    server: {
        middleware: [authMiddleware],
    },
});

function DashboardLayoutRoute() {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}
