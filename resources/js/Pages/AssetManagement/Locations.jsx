import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Locations({ auth, locations }) {
    const formatCurrency = (amount) => {
        if (!amount) return "-";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getLocationAddress = (location) => {
        const parts = [];
        if (location.building) parts.push(location.building);
        if (location.floor) parts.push(`Floor ${location.floor}`);
        if (location.room) parts.push(`Room ${location.room}`);
        if (location.area) parts.push(location.area);
        
        return parts.length > 0 ? parts.join(", ") : "No address details";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🏢 Asset Management
                </h2>
            }
        >
            <Head title="Asset Locations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Asset Locations
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage and track where your assets are located.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("asset-management.index")}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Dashboard
                                </Link>
                                <Link
                                    href={route("asset-management.assets")}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    📋 Manage Assets
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Locations Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Locations ({locations.data ? locations.data.length : 0})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {locations.data && locations.data.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Address Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Assets Count
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Total Value
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {locations.data.map((location) => (
                                            <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                <span className="text-lg">📍</span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {location.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                Sort Order: {location.sort_order}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {getLocationAddress(location)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {location.assets_count || 0} assets
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(location.assets_sum_purchase_price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        location.is_active 
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                                    }`}>
                                                        {location.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route("asset-management.assets", { location: location.id })}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                                        >
                                                            👁️ View Assets
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📍</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No Locations Found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Asset locations will appear here once they are created.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {locations.links && locations.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex space-x-2">
                                {locations.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                        {...(!link.url && { onClick: (e) => e.preventDefault() })}
                                    >
                                        {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Location Information */}
                    <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                About Asset Locations
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        What are Asset Locations?
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Asset locations help you track where your assets are physically located, making it easier to find and manage equipment across different buildings, floors, and rooms.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        Examples of Locations
                                    </h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <li>• 🏢 Main Building - 1st Floor</li>
                                        <li>• 🏭 Warehouse A - Storage Area</li>
                                        <li>• 🏢 Office Building - Conference Room</li>
                                        <li>• 🚗 Parking Garage - Level 2</li>
                                        <li>• 🏢 Annex Building - IT Department</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
