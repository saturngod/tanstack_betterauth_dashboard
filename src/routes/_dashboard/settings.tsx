import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/settings")({
    component: SettingsPage,
});

function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
    );
}
