import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function UserManagementIndex({ auth, stats, recentUsers, usersByRole }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };

    const getRoleColor = (roleName) => {
        const colors = {
            admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            employee: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        };
        return colors[roleName] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    👥 User Management
                </h2>
            }
        >
            <Head title="User Management Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    User Management Dashboard
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage user accounts, roles, and permissions across your system.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-3xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Users
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.total_users}
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
                                        Active Users
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.active_users}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-3xl">🔑</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Roles
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.total_roles}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <span className="text-3xl">👑</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Admin Users
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.admin_users}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href={route("user-management.users")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-3xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Manage Users
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Create, edit, and manage user accounts
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("user-management.roles")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-3xl">🔑</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Manage Roles
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Create and manage user roles and permissions
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("user-management.users.create")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-3xl">➕</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Add New User
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Create a new user account with specific role
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Recent Users
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {recentUsers && recentUsers.length > 0 ? (
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
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {recentUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                <span className="text-lg">👤</span>
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
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role.name)}`}>
                                                            {user.role.display_name || user.role.name}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                                            No Role
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route("user-management.users.edit", user.id)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                                        >
                                                            ✏️ Edit
                                                        </Link>
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
                                        Start by creating your first user account.
                                    </p>
                                    <Link
                                        href={route("user-management.users.create")}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ➕ Add First User
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Users by Role */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Users by Role
                            </h3>
                        </div>
                        <div className="p-6">
                            {usersByRole && usersByRole.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {usersByRole.map((roleGroup) => (
                                        <div key={roleGroup.role_id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {roleGroup.role?.display_name || roleGroup.role?.name || 'Unknown Role'}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {roleGroup.count} users
                                                    </p>
                                                </div>
                                                <div className="text-2xl">
                                                    {roleGroup.role?.name === 'admin' ? '👑' : 
                                                     roleGroup.role?.name === 'manager' ? '👔' : 
                                                     roleGroup.role?.name === 'employee' ? '👷' : '👤'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No role distribution data available.
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
