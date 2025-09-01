import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ mealBreakPlan }) {
    console.log("Show component rendering with data:", mealBreakPlan);

    // Simple date formatting function
    const formatDate = (dateString) => {
        try {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
        } catch (error) {
            console.error("Date formatting error:", error);
            return "Invalid Date";
        }
    };

    const getStatusBadge = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";

        const badges = {
            draft: "bg-gray-100 text-gray-800",
            active: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return badges[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status) => {
        return status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Unknown";
    };

    if (!mealBreakPlan) {
        return (
            <AuthenticatedLayout>
                <Head title="Meal Break Plan Not Found" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <div className="text-6xl mb-4">❌</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Plan Not Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    The meal break plan you're looking for
                                    doesn't exist.
                                </p>
                                <Link
                                    href="/pmec2/public/catering/meal-break-plans"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    Back to Plans
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Meal Break Plan: ${mealBreakPlan.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold">
                                        📅 {mealBreakPlan.name}
                                    </h2>
                                    {mealBreakPlan.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {mealBreakPlan.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/pmec2/public/catering/meal-break-plans/${mealBreakPlan.id}/edit`}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        ✏️ Edit Plan
                                    </Link>
                                    <Link
                                        href={`/pmec2/public/catering/meal-break-plans/${mealBreakPlan.id}/daily-orders`}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        📋 Daily Orders
                                    </Link>
                                    <Link
                                        href="/pmec2/public/catering/meal-break-plans"
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        ← Back to Plans
                                    </Link>
                                </div>
                            </div>

                            {/* Plan Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {/* Status */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-gray-600 dark:text-gray-400 text-lg mr-3">
                                            🏷️
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Status
                                            </div>
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusBadge(
                                                    mealBreakPlan.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    mealBreakPlan.status
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Period */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-gray-600 dark:text-gray-400 text-lg mr-3">
                                            📅
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Period
                                            </div>
                                            <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                                                {formatDate(
                                                    mealBreakPlan.start_date
                                                )}{" "}
                                                -{" "}
                                                {formatDate(
                                                    mealBreakPlan.end_date
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Days */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-gray-600 dark:text-gray-400 text-lg mr-3">
                                            ⏱️
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Duration
                                            </div>
                                            <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                                                {mealBreakPlan.total_days || 0}{" "}
                                                days
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Food Cost */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-blue-600 dark:text-blue-400 text-lg mr-3">
                                            🍽️
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                Total Food Cost
                                            </div>
                                            <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mt-1">
                                                $
                                                {parseFloat(
                                                    mealBreakPlan.total_food_cost ||
                                                        0
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Delivery Cost */}
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-green-600 dark:text-green-400 text-lg mr-3">
                                            🚚
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                Total Delivery Cost
                                            </div>
                                            <div className="text-lg font-bold text-green-800 dark:text-green-200 mt-1">
                                                $
                                                {parseFloat(
                                                    mealBreakPlan.total_delivery_cost ||
                                                        0
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-purple-600 dark:text-purple-400 text-lg mr-3">
                                            💰
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                                Grand Total
                                            </div>
                                            <div className="text-xl font-bold text-purple-800 dark:text-purple-200 mt-1">
                                                $
                                                {parseFloat(
                                                    mealBreakPlan.grand_total ||
                                                        0
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {mealBreakPlan.notes && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="text-yellow-600 dark:text-yellow-400 text-lg mr-3 mt-0.5">
                                            📝
                                        </div>
                                        <div>
                                            <div className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                                                Notes
                                            </div>
                                            <div className="text-yellow-700 dark:text-yellow-300">
                                                {mealBreakPlan.notes}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Created/Updated Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Created by:
                                        </span>
                                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                                            {mealBreakPlan.created_by?.name ||
                                                "Unknown"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Created on:
                                        </span>
                                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                                            {formatDate(
                                                mealBreakPlan.created_at
                                            )}
                                        </span>
                                    </div>
                                    {mealBreakPlan.updated_at && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Last updated:
                                            </span>
                                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                                                {formatDate(
                                                    mealBreakPlan.updated_at
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {mealBreakPlan.approved_by && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Approved by:
                                            </span>
                                            <span className="ml-2 text-gray-900 dark:text-gray-100">
                                                {mealBreakPlan.approved_by.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
