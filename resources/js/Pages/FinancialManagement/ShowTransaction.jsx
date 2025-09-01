import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ShowTransaction({ auth, transaction }) {
    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getTransactionTypeColor = (type) => {
        const colors = {
            income: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            expense: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            transfer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
        return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    };

    const getTransactionTypeIcon = (type) => {
        const icons = {
            income: "📈",
            expense: "📉",
            transfer: "🔄",
        };
        return icons[type] || "💰";
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    📊 Transaction Details
                </h2>
            }
        >
            <Head title="Transaction Details" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Transaction Details
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Complete information about this financial transaction.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("financial-management.transactions.edit", transaction.id)}
                                    className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 focus:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ✏️ Edit Transaction
                                </Link>
                                <Link
                                    href={route("financial-management.transactions")}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ← Back to Transactions
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details Card */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Transaction Information
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                                        {getTransactionTypeIcon(transaction.type)} {transaction.type}
                                    </span>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            Basic Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Description
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.description}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Reference Number
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                    {transaction.reference_number}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Amount
                                                </label>
                                                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(transaction.amount, transaction.currency)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Transaction Date
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(transaction.transaction_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account & Category */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            Account & Category
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Account
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.account?.name || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Category
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.category?.display_name || transaction.category?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Additional Details */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            Additional Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Notes
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.notes || 'No notes provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Related Entity
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.related_type && transaction.related_id 
                                                        ? `${transaction.related_type} #${transaction.related_id}`
                                                        : 'Not specified'
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Created By
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {transaction.user?.name || 'System'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    {transaction.metadata && (
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                                Additional Information
                                            </h4>
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                                    {JSON.stringify(transaction.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {/* Timestamps */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            Timestamps
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Created
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(transaction.created_at)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Last Updated
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(transaction.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Dashboard */}
                    <div className="mt-8">
                        <Link
                            href={route("financial-management.index")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
