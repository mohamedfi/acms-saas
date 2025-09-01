import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Users({ auth, users, roles, employees }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    const getRoleColor = (roleName) => {
        const colors = {
            admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            manager:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            employee:
                "bg-green-100 text-green-800 dark:bg-gray-900 dark:text-green-300",
            viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        };
        return (
            colors[roleName] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    const handleDelete = (userId, userName) => {
        if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
            router.delete(route("user-management.users.destroy", userId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    👥 User Management
                </h2>
            }
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Manage Users
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Create, edit, and manage user accounts and
                                    permissions.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("user-management.index")}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Dashboard
                                </Link>
                                <Link
                                    href={route("user-management.users.create")}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ➕ Add User
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Users ({users.data ? users.data.length : 0})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {users.data && users.data.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                <span className="text-lg">
                                                                    👤
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.role ? (
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                                                                user.role.name
                                                            )}`}
                                                        >
                                                            {user.role
                                                                .display_name ||
                                                                user.role.name}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                                            No Role
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {user.employee ? (
                                                        <div className="flex items-center">
                                                            <span className="text-blue-600 dark:text-blue-400 mr-2">👤</span>
                                                            <span>{user.employee.first_name} {user.employee.last_name}</span>
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">({user.employee.position})</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 dark:text-gray-400">Not linked</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            user.is_active
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                        }`}
                                                    >
                                                        {user.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(
                                                        user.created_at
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route(
                                                                "user-management.users.edit",
                                                                user.id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                                        >
                                                            ✏️ Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                    user.name
                                                                )
                                                            }
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
                                    <div className="text-6xl mb-4">👥</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No Users Found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start by creating your first user
                                        account.
                                    </p>
                                    <Link
                                        href={route(
                                            "user-management.users.create"
                                        )}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ➕ Add First User
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex space-x-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        } ${
                                            !link.url &&
                                            "opacity-50 cursor-not-allowed"
                                        }`}
                                        {...(!link.url && {
                                            onClick: (e) => e.preventDefault(),
                                        })}
                                    >
                                        {link.label
                                            .replace("&laquo;", "«")
                                            .replace("&raquo;", "»")}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
