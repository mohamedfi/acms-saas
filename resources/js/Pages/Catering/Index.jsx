import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    cateringServices,
    mealPlans,
    dietaryRequirements,
    recentOrders,
    upcomingOrders,
    stats,
    courses,
}) {
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", name: "Overview", icon: "📊" },
        { id: "services", name: "Services", icon: "🍽️" },
        { id: "meal-plans", name: "Meal Plans", icon: "📋" },
        { id: "orders", name: "Orders", icon: "📦" },
        { id: "dietary", name: "Dietary Requirements", icon: "⚠️" },
    ];

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-3xl">🍽️</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Services
                            </p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.total_services}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-3xl">📦</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Orders
                            </p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {stats.total_orders}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-3xl">⏳</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pending Orders
                            </p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.pending_orders}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border-l-4 border-purple-500">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-3xl">📋</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Meal Plans
                            </p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.active_meal_plans}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Recent Orders
                    </h3>
                </div>
                <div className="p-6">
                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {order.event_name ||
                                                `Order #${order.order_number}`}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.event_date} •{" "}
                                            {order.expected_attendees} attendees
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${order.status_color}`}
                                        >
                                            {order.status_label}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {order.formatted_final_amount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No recent orders
                        </p>
                    )}
                </div>
            </div>

            {/* Upcoming Orders */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Upcoming Orders
                    </h3>
                </div>
                <div className="p-6">
                    {upcomingOrders.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {order.event_name ||
                                                `Order #${order.order_number}`}
                                        </p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            {order.event_date} •{" "}
                                            {order.expected_attendees} attendees
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${order.status_color}`}
                                        >
                                            {order.status_label}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {order.formatted_final_amount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No upcoming orders
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderServices = () => (
        <div className="space-y-6">
            {Object.entries(cateringServices).map(([type, services]) => (
                <div
                    key={type}
                    className="bg-white dark:bg-gray-800 shadow rounded-xl"
                >
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {type} Services ({services.length})
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="text-2xl">
                                            {service.type_icon}
                                        </div>
                                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {service.formatted_price}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        {service.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center space-x-2 mb-3">
                                        {service.dietary_icons && (
                                            <span className="text-sm">
                                                {service.dietary_icons}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <p>
                                            Prep time:{" "}
                                            {service.preparation_time_minutes}{" "}
                                            min
                                        </p>
                                        <p>Cuisine: {service.cuisine_type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMealPlans = () => (
        <div className="space-y-6">
            {mealPlans.length > 0 ? (
                mealPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white dark:bg-gray-800 shadow rounded-xl"
                    >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {plan.name}
                                </h3>
                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {plan.formatted_total_price}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {plan.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        Plan Details
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <p>Duration: {plan.duration_label}</p>
                                        <p>
                                            Price per day:{" "}
                                            {plan.formatted_price_per_day}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        Meals Included
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.meal_types.map((mealType) => (
                                            <span
                                                key={mealType}
                                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded"
                                            >
                                                {mealType}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No meal plans available
                    </p>
                </div>
            )}
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Recent Orders
                </h3>
                <Link
                    href={route("catering.orders")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    View All Orders
                </Link>
            </div>

            {recentOrders.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            #{order.order_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.event_name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.event_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${order.status_color}`}
                                            >
                                                {order.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {order.formatted_final_amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No orders found
                    </p>
                </div>
            )}
        </div>
    );

    const renderDietaryRequirements = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dietaryRequirements.map((requirement) => (
                    <div
                        key={requirement.id}
                        className="bg-white dark:bg-gray-800 shadow rounded-xl p-6"
                    >
                        <div className="flex items-center mb-4">
                            <div className="text-3xl mr-3">
                                {requirement.display_icon}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {requirement.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {requirement.category_label}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {requirement.description}
                        </p>

                        {requirement.restrictions && (
                            <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    Restrictions:
                                </h4>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {requirement.restrictions}
                                </p>
                            </div>
                        )}

                        {requirement.allowed_foods && (
                            <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    Allowed Foods:
                                </h4>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    {requirement.allowed_foods}
                                </p>
                            </div>
                        )}

                        {requirement.requires_medical_attention && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                                    ⚠️ Requires Medical Attention
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🍽️ Catering Management
                </h2>
            }
        >
            <Head title="Catering Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Actions */}
                    <div className="mb-8 flex flex-wrap gap-4">
                        <Link
                            href={route("catering.create-order")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            🆕 Create New Order
                        </Link>
                        <Link
                            href={route("catering.services")}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            🍽️ View All Services
                        </Link>
                        <Link
                            href={route("catering.meal-plans")}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            📋 View Meal Plans
                        </Link>
                        <Link
                            href={route("catering.orders")}
                            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                        >
                            📦 View All Orders
                        </Link>
                        <Link
                            href={route("catering.roles.index")}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            👥 Manage Roles
                        </Link>
                        <Link
                            href={route("transportation.index")}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            🚗 Vehicle Rental
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl mb-8">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav
                                className="flex space-x-8 px-6"
                                aria-label="Tabs"
                            >
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl">
                        <div className="p-6">
                            {activeTab === "overview" && renderOverview()}
                            {activeTab === "services" && renderServices()}
                            {activeTab === "meal-plans" && renderMealPlans()}
                            {activeTab === "orders" && renderOrders()}
                            {activeTab === "dietary" &&
                                renderDietaryRequirements()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}






