import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const managementSystems = [
        {
            title: "🏢 Department Management",
            description:
                "Manage organizational departments, assign managers, and track budgets",
            route: route("departments.index"),
            icon: "🏢",
            color: "from-blue-500 to-blue-600",
            features: [
                "Create and manage departments",
                "Assign department managers",
                "Track budgets and utilization",
                "Monitor employee distribution",
            ],
        },
        {
            title: "👥 Role Management",
            description:
                "Manage user roles, permissions, and access levels across the system",
            route: route("role-management.index"),
            icon: "👥",
            color: "from-purple-500 to-purple-600",
            features: [
                "Define user roles and permissions",
                "Set access levels and restrictions",
                "Manage role assignments",
                "Track role usage and statistics",
            ],
        },
        {
            title: "📍 Course Location Management",
            description:
                "Manage training centers, offices, and conference venues for courses",
            route: route("course-location-management.index"),
            icon: "📍",
            color: "from-green-500 to-green-600",
            features: [
                "Training centers and offices",
                "Conference rooms and hotels",
                "Client site locations",
                "Capacity and facilities tracking",
            ],
        },
        {
            title: "📅 Meal Break Plans Management",
            description:
                "Manage meal planning, catering schedules, and dietary requirements",
            route: route("catering.meal-break-plans.index"),
            icon: "📅",
            color: "from-orange-500 to-orange-600",
            features: [
                "Create dynamic meal plans (1-30 days)",
                "Manage breakfast, lunch, dinner, and snacks",
                "Track dietary requirements",
                "Generate comprehensive reports",
            ],
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ⚙️ System Management
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your organization's structure and settings
                    </div>
                </div>
            }
        >
            <Head title="System Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-8 mb-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                                🎯 System Management Center
                            </h1>
                            <p className="text-lg text-indigo-700 dark:text-indigo-300 max-w-3xl mx-auto">
                                Centralized management for your organization's
                                departments, roles, and locations. Keep your
                                system organized and efficient with these
                                powerful management tools.
                            </p>
                        </div>
                    </div>

                    {/* Management Systems Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {managementSystems.map((system, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Header */}
                                <div
                                    className={`bg-gradient-to-r ${system.color} p-6 text-white`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-4xl">
                                            {system.icon}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm opacity-90">
                                                Management
                                            </div>
                                            <div className="text-xs opacity-75">
                                                System
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        {system.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        {system.description}
                                    </p>

                                    {/* Features List */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            ✨ Key Features:
                                        </h4>
                                        <ul className="space-y-2">
                                            {system.features.map(
                                                (feature, featureIndex) => (
                                                    <li
                                                        key={featureIndex}
                                                        className="flex items-start"
                                                    >
                                                        <span className="text-green-500 mr-2">
                                                            ✓
                                                        </span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={system.route}
                                        className={`w-full bg-gradient-to-r ${system.color} hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center block`}
                                    >
                                        🚀 Access {system.title.split(" ")[0]}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            📊 Quick Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    🏢
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Department Management
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                    Organize your teams
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    👥
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Role Management
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                    Control access levels
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    📍
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Location Management
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                    Manage venues
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            💡 How to Use
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p>
                                <strong>1. Department Management:</strong>{" "}
                                Create organizational departments, assign
                                managers, and track budgets and employee
                                distribution.
                            </p>
                            <p>
                                <strong>2. Role Management:</strong> Define user
                                roles, set permissions, and control access
                                levels across your system.
                            </p>
                            <p>
                                <strong>3. Course Location Management:</strong>{" "}
                                Manage training centers, offices, conference
                                rooms, and client sites for your courses.
                            </p>
                            <p>
                                <strong>4. Integration:</strong> All systems
                                work together to provide a comprehensive
                                organizational management solution.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
