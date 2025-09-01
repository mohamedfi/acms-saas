import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ShowAsset({ auth, asset }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const getStatusBadge = (status) => {
        const badges = {
            available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            in_use: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            retired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
            lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return badges[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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

    const getConditionBadge = (condition) => {
        const badges = {
            excellent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            fair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            poor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
            damaged: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return badges[condition] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    };

    const formatCurrency = (amount) => {
        if (!amount) return "-";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    const handleDelete = () => {
        router.delete(route("asset-management.assets.destroy", asset.id));
        setShowDeleteModal(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🏢 Asset Management
                </h2>
            }
        >
            <Head title={`Asset: ${asset.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Asset Details
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    View complete information for {asset.name}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("asset-management.assets")}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Assets
                                </Link>
                                <Link
                                    href={route("asset-management.assets.edit", asset.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ✏️ Edit Asset
                                </Link>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    🗑️ Delete Asset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Asset Information */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Basic Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Asset Name
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {asset.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Asset Code
                                    </label>
                                    <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
                                        {asset.asset_code}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{asset.category?.icon || "📦"}</span>
                                        <span className="text-lg text-gray-900 dark:text-gray-100">
                                            {asset.category?.name}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">📍</span>
                                        <span className="text-lg text-gray-900 dark:text-gray-100">
                                            {asset.location?.name}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(asset.status)}`}>
                                        {getStatusLabel(asset.status)}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Condition
                                    </label>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getConditionBadge(asset.condition)}`}>
                                        {asset.condition}
                                    </span>
                                </div>
                            </div>

                            {asset.description && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{asset.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Asset Details */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Asset Details
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Brand
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{asset.brand || "-"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Model
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{asset.model || "-"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Serial Number
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{asset.serial_number || "-"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Assigned To
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {asset.assigned_to ? `👤 ${asset.assigned_to}` : "Not Assigned"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Financial Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Purchase Price
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(asset.purchase_price)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Purchase Date
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(asset.purchase_date)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Supplier
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{asset.supplier || "-"}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Warranty Expiry
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(asset.warranty_expiry)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Information */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Maintenance Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Maintenance
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(asset.last_maintenance)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Next Maintenance
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(asset.next_maintenance)}</p>
                                </div>
                            </div>
                            {asset.maintenance_notes && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Maintenance Notes
                                    </label>
                                    <p className="text-gray-900 dark:text-gray-100">{asset.maintenance_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    {asset.notes && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Additional Notes
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-900 dark:text-gray-100">{asset.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* QR Code */}
                    {asset.qr_code && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    QR Code
                                </h3>
                            </div>
                            <div className="p-6 text-center">
                                <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">QR Code: {asset.qr_code}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">
                                Delete Asset
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center space-x-3 mt-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
