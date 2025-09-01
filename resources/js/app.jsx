import "../css/app.css";
import "./bootstrap";
import "./ziggy";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Handle nested component paths
        let componentPath = name;

        // Special handling for main routes that shouldn't go to ArchivedCourses
        if (name === "Dashboard" || name === "dashboard") {
            componentPath = "Dashboard";
        } else if (name === "Welcome" || name === "welcome") {
            componentPath = "Welcome";
        } else if (name.includes("/")) {
            // For nested paths like "Catering/MealBreakPlans/Index", use as-is
            componentPath = name;
        } else {
            // Only redirect to ArchivedCourses if it's not a main route and not a special case
            componentPath = `ArchivedCourses/${name}`;
        }

        return resolvePageComponent(
            `./Pages/${componentPath}.jsx`,
            import.meta.glob("./Pages/**/*.{jsx,tsx,js,ts}")
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
