import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard")({
    component: DashboardPage,
});

function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
    );
}
