import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function MealPlans({ mealPlans }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    📋 Meal Plans
                </h2>
            }
        >
            <Head title="Meal Plans" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Meal Plans
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                View and manage meal plan packages.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route("catering.meal-plans.create")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                ➕ Create New Meal Plan
                            </Link>
                            <Link
                                href={route("catering.index")}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Meal Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mealPlans && mealPlans.length > 0 ? (
                            mealPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                {plan.name}
                                            </h3>
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                $
                                                {parseFloat(
                                                    plan.total_price
                                                ).toFixed(2)}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {plan.description}
                                        </p>

                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            <div className="flex justify-between">
                                                <span>Duration:</span>
                                                <span className="font-medium">
                                                    {plan.duration_label}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Price per day:</span>
                                                <span className="font-medium">
                                                    $
                                                    {parseFloat(
                                                        plan.price_per_day
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                Meals Included:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {plan.meal_types &&
                                                    plan.meal_types.map(
                                                        (mealType) => (
                                                            <span
                                                                key={mealType}
                                                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded"
                                                            >
                                                                {mealType}
                                                            </span>
                                                        )
                                                    )}
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                📋 View Details
                                            </button>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                🛒 Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No Meal Plans Available
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Meal plans will appear here once they are
                                    created.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
