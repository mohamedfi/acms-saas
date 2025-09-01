import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ mealBreakPlans }) {
    console.log("Component rendering with data:", mealBreakPlans);

    // Simple data processing
    const plans = mealBreakPlans?.data || [];

    // Delete form
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to delete this meal break plan? This action cannot be undone."
            )
        ) {
            destroy(route('catering.meal-break-plans.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Meal Break Plans" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    📅 Meal Break Plans
                                </h2>
                                <Link
                                    href={route('catering.meal-break-plans.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    ➕ Create New Plan
                                </Link>
                            </div>

                            {plans.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🍽️</div>
                                    <h3 className="text-lg font-medium mb-2">
                                        No meal break plans yet
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Create your first meal break plan to
                                        start managing catering for your
                                        courses.
                                    </p>
                                    <Link
                                        href={route('catering.meal-break-plans.create')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        Create Your First Plan
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Plan Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Days
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Total Cost
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {plans.map((plan) => (
                                                <tr
                                                    key={plan.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {plan.name ||
                                                                "Unnamed Plan"}
                                                        </div>
                                                        {plan.description && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {
                                                                    plan.description
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                plan.status ===
                                                                "active"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : plan.status ===
                                                                      "draft"
                                                                    ? "bg-gray-100 text-gray-800"
                                                                    : plan.status ===
                                                                      "completed"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {plan.status
                                                                ? plan.status
                                                                      .charAt(0)
                                                                      .toUpperCase() +
                                                                  plan.status.slice(
                                                                      1
                                                                  )
                                                                : "Unknown"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {plan.total_days || 0}{" "}
                                                        days
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        $
                                                        {parseFloat(
                                                            plan.grand_total ||
                                                                0
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/pmec2/public/catering/meal-break-plans/${plan.id}`}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                👁️ View
                                                            </Link>
                                                            <Link
                                                                href={`/pmec2/public/catering/meal-break-plans/${plan.id}/edit`}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                ✏️ Edit
                                                            </Link>
                                                            <Link
                                                                href={`/pmec2/public/catering/meal-break-plans/${plan.id}/daily-orders`}
                                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                            >
                                                                📋 Orders
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        plan.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
