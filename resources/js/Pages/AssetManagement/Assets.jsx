import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Assets({ auth, assets, categories, locations }) {
    const getStatusBadge = (status) => {
        const badges = {
            available:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            in_use: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            maintenance:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            retired:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
            lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return (
            badges[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    const getStatusLabel = (status) => {
        const labels = {
            available: "Available",
            in_use: "In Use",
            maintenance: "Maintenance",
            retired: "Retired",
            lost: "Lost",
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🏢 Asset Management
                </h2>
            }
        >
            <Head title="Assets" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Assets
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage and track all your company assets and
                                    equipment.
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
                                    href={route(
                                        "asset-management.assets.create"
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ➕ Add Asset
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Assets Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Assets ({assets.data ? assets.data.length : 0})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {assets.data && assets.data.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Asset
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Location
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
                                        {assets.data.map((asset) => (
                                            <tr
                                                key={asset.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                <span className="text-lg">
                                                                    {asset
                                                                        .category
                                                                        ?.icon ||
                                                                        "📦"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {asset.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {
                                                                    asset.asset_code
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {asset.category?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {asset.location?.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                                            asset.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            asset.status
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route(
                                                                "asset-management.assets.show",
                                                                asset.id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                                        >
                                                            👁️ View
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "asset-management.assets.edit",
                                                                asset.id
                                                            )}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:underline"
                                                        >
                                                            ✏️ Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        `Are you sure you want to delete "${asset.name}"?`
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        route(
                                                                            "asset-management.assets.destroy",
                                                                            asset.id
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No Assets Found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start by adding your first asset to the
                                        system.
                                    </p>
                                    <Link
                                        href={route(
                                            "asset-management.assets.create"
                                        )}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ➕ Add First Asset
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
