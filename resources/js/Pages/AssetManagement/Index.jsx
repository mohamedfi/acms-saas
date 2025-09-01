import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AssetManagementIndex({ auth, stats, recentAssets, assetsByCategory, assetsByLocation }) {
    const getStatusBadge = (status) => {
        const badges = {
            available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            in_use: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            retired: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return badges[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };

    const getStatusLabel = (status) => {
        const labels = {
            available: 'Available',
            in_use: 'In Use',
            maintenance: 'Maintenance',
            retired: 'Retired',
            lost: 'Lost',
        };
        return labels[status] || status;
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🏢 Asset Management
                </h2>
            }
        >
            <Head title="Asset Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Asset Management Dashboard
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Track and manage all your company assets, equipment, and resources.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-3xl">📦</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Assets
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.total_assets}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-3xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Available
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.available_assets}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-3xl">💰</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Value
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(stats.total_value)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <span className="text-3xl">🔧</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Maintenance
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.maintenance_assets}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href={route('asset-management.assets')}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-3xl">📋</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Manage Assets
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        View, add, edit, and manage all assets
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('asset-management.categories')}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-3xl">🏷️</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Asset Categories
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Organize assets by type and category
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('asset-management.locations')}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-3xl">📍</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Asset Locations
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Track where assets are located
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Assets */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Recent Assets
                            </h3>
                        </div>
                        <div className="p-6">
                            {recentAssets.length > 0 ? (
                                <div className="space-y-4">
                                    {recentAssets.map((asset) => (
                                        <div key={asset.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    <span className="text-2xl">{asset.category?.icon || '📦'}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {asset.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {asset.category?.name} • {asset.location?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Code: {asset.asset_code}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(asset.status)}`}>
                                                    {getStatusLabel(asset.status)}
                                                </span>
                                                <Link
                                                    href={route('asset-management.assets.show', asset.id)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No Assets Found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start by adding your first asset to the system.
                                    </p>
                                    <Link
                                        href={route('asset-management.assets.create')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add First Asset
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assets by Category Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Assets by Category
                                </h3>
                            </div>
                            <div className="p-6">
                                {assetsByCategory.length > 0 ? (
                                    <div className="space-y-3">
                                        {assetsByCategory.map((item) => (
                                            <div key={item.category_id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{item.category?.icon || '📦'}</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {item.category?.name}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {item.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        No category data available
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Assets by Location
                                </h3>
                            </div>
                            <div className="p-6">
                                {assetsByLocation.length > 0 ? (
                                    <div className="space-y-3">
                                        {assetsByLocation.map((item) => (
                                            <div key={item.location_id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">📍</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {item.location?.name}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {item.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        No location data available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
