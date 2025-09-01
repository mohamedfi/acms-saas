import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function FinancialManagementIndex({
    auth,
    stats,
    recentTransactions,
    topExpenseCategories,
    accountBalances,
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getTransactionTypeColor = (type) => {
        const colors = {
            income: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            expense:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            transfer:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
        return (
            colors[type] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    const getAccountTypeIcon = (type) => {
        const icons = {
            bank: "🏦",
            cash: "💵",
            credit: "💳",
            investment: "📈",
            other: "📊",
        };
        return icons[type] || "💰";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    💰 Financial Management Dashboard
                </h2>
            }
        >
            <Head title="Financial Management Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Financial Dashboard
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Monitor your financial health, track income
                                    and expenses, and manage budgets.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route(
                                        "financial-management.transactions.create"
                                    )}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ➕ New Transaction
                                </Link>
                                <Link
                                    href={route(
                                        "financial-management.accounts.create"
                                    )}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    🏦 New Account
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Financial Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Income */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 dark:text-green-400 text-lg">
                                                📈
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Monthly Income
                                        </p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(stats.total_income)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Expenses */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                            <span className="text-red-600 dark:text-red-400 text-lg">
                                                📉
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Monthly Expenses
                                        </p>
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {formatCurrency(
                                                stats.total_expenses
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Profit */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                stats.net_profit >= 0
                                                    ? "bg-green-100 dark:bg-green-900"
                                                    : "bg-red-100 dark:bg-red-900"
                                            }`}
                                        >
                                            <span
                                                className={`text-lg ${
                                                    stats.net_profit >= 0
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {stats.net_profit >= 0
                                                    ? "💰"
                                                    : "⚠️"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Net Profit
                                        </p>
                                        <p
                                            className={`text-2xl font-bold ${
                                                stats.net_profit >= 0
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {formatCurrency(stats.net_profit)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Accounts */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 dark:text-blue-400 text-lg">
                                                🏦
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Accounts
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {stats.total_accounts}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href={route("financial-management.accounts")}
                            className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 dark:text-blue-400 text-2xl">
                                                🏦
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Manage Accounts
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            View and manage your bank accounts,
                                            cash, and investments
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("financial-management.transactions")}
                            className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 dark:text-green-400 text-2xl">
                                                📊
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            View Transactions
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Track all your income, expenses, and
                                            transfers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("financial-management.budgets")}
                            className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600 dark:text-purple-400 text-2xl">
                                                📋
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Budget Planning
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Set budgets and track performance
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Recent Transactions
                                </h3>
                                <Link
                                    href={route(
                                        "financial-management.transactions"
                                    )}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {recentTransactions &&
                            recentTransactions.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Transaction
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Account
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {recentTransactions.map(
                                            (transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                    <span className="text-lg">
                                                                        {transaction.type ===
                                                                        "income"
                                                                            ? "📈"
                                                                            : transaction.type ===
                                                                              "expense"
                                                                            ? "📉"
                                                                            : "🔄"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        transaction.reference_number
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {transaction.account
                                                            ?.name || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {transaction.category
                                                            ?.display_name ||
                                                            transaction.category
                                                                ?.name ||
                                                            "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(
                                                                transaction.type
                                                            )}`}
                                                        >
                                                            {formatCurrency(
                                                                transaction.amount
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {formatDate(
                                                            transaction.transaction_date
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                                        📊
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No Transactions Yet
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start tracking your finances by creating
                                        your first transaction.
                                    </p>
                                    <Link
                                        href={route(
                                            "financial-management.transactions.create"
                                        )}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ➕ Create Transaction
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Balances */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Account Balances
                                </h3>
                                <Link
                                    href={route(
                                        "financial-management.accounts"
                                    )}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {accountBalances && accountBalances.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {accountBalances.map((account) => (
                                        <div
                                            key={account.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-3">
                                                        {getAccountTypeIcon(
                                                            account.type
                                                        )}
                                                    </span>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {account.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {account.type_label}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(
                                                            account.current_balance
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {account.currency}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">
                                        🏦
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        No accounts set up yet. Create your
                                        first account to start tracking
                                        finances.
                                    </p>
                                    <Link
                                        href={route(
                                            "financial-management.accounts.create"
                                        )}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        ➕ Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* About Financial Management */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                            About Financial Management
                        </h3>
                        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
                            <p>
                                <strong>Financial Management</strong> helps you
                                track income, expenses, and manage budgets
                                across all your business operations.
                            </p>
                            <p>
                                <strong>Accounts:</strong> Manage bank accounts,
                                cash, credit cards, and investments with
                                real-time balance tracking.
                            </p>
                            <p>
                                <strong>Transactions:</strong> Record all
                                financial activities with categories,
                                descriptions, and business entity linking.
                            </p>
                            <p>
                                <strong>Budgets:</strong> Set spending limits
                                and track performance against your financial
                                goals.
                            </p>
                            <p>
                                <strong>Reports:</strong> Generate financial
                                statements, analyze trends, and make informed
                                business decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
