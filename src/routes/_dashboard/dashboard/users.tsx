import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/users")({
    component: UsersPage,
});

function UsersPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
    );
}
