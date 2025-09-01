import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function DailyOrders({ auth, mealBreakPlan, dailyOrders }) {
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        order_date: "",
        course_name: "",
        number_of_attendance: "",
        location: "",
        delivery_cost: "",
        special_instructions: "",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            route(
                "catering.meal-break-plans.daily-orders.store",
                mealBreakPlan.id
            ),
            {
                onSuccess: () => {
                    reset();
                    setShowCreateForm(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Daily Orders - {mealBreakPlan.name}
                </h2>
            }
        >
            <Head title={`Daily Orders - ${mealBreakPlan.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {mealBreakPlan.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(mealBreakPlan.start_date)} -{" "}
                                        {formatDate(mealBreakPlan.end_date)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {mealBreakPlan.description}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route(
                                            "catering.meal-break-plans.show",
                                            mealBreakPlan.id
                                        )}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Back to Plan
                                    </Link>
                                    <button
                                        onClick={() =>
                                            setShowCreateForm(!showCreateForm)
                                        }
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {showCreateForm
                                            ? "Cancel"
                                            : "Add Daily Order"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showCreateForm && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">
                                    Create New Daily Order
                                </h4>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={data.order_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "order_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {errors.order_date && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.order_date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Course Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.course_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "course_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {errors.course_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.course_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Number of Attendance
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    data.number_of_attendance
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "number_of_attendance",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {errors.number_of_attendance && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.number_of_attendance
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                value={data.location}
                                                onChange={(e) =>
                                                    setData(
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {errors.location && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.location}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Delivery Cost
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.delivery_cost}
                                                onChange={(e) =>
                                                    setData(
                                                        "delivery_cost",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {errors.delivery_cost && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.delivery_cost}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Special Instructions
                                            </label>
                                            <textarea
                                                value={
                                                    data.special_instructions
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "special_instructions",
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            {errors.special_instructions && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.special_instructions
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCreateForm(false)
                                            }
                                            className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                        >
                                            {processing
                                                ? "Creating..."
                                                : "Create Daily Order"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Daily Orders List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">
                                Daily Orders
                            </h4>

                            {dailyOrders && dailyOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Course
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Attendance
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Delivery Cost
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Food Orders
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dailyOrders.map((dailyOrder) => (
                                                <tr
                                                    key={dailyOrder.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(
                                                            dailyOrder.order_date
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {dailyOrder.course_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {
                                                            dailyOrder.number_of_attendance
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {dailyOrder.location}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        $
                                                        {
                                                            dailyOrder.delivery_cost
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {dailyOrder.individual_food_orders_count ||
                                                            0}{" "}
                                                        orders
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "catering.daily-orders.food-orders",
                                                                    dailyOrder.id
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View Orders
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "catering.daily-orders.edit",
                                                                    dailyOrder.id
                                                                )}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        No daily orders found for this meal
                                        break plan.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Click "Add Daily Order" to get started.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
