import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ role }) {
    const getStatusColor = (isActive) => {
        return isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    };

    const getRoleColor = (role) => {
        return role.color || "bg-gray-500";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👥 Role Details: {role.display_name}
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("role-management.edit", role.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            ✏️ Edit Role
                        </Link>
                        <Link
                            href={route("role-management.index")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            ← Back to Roles
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Role: ${role.display_name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Role Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`p-3 rounded-full ${getRoleColor(
                                        role
                                    )}`}
                                >
                                    <span className="text-2xl">
                                        {role.icon || "👥"}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {role.display_name}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {role.name}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        role.is_active
                                    )}`}
                                >
                                    {role.is_active ? "Active" : "Inactive"}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Access Level: {role.access_level || 1}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Role Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                📋 Role Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {role.description ||
                                            "No description provided"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Sort Order
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {role.sort_order || 0}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Color Theme
                                    </label>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <div
                                            className={`w-6 h-6 rounded-full ${
                                                role.color || "bg-gray-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                            {role.color || "Default"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                🔐 Permissions
                            </h3>
                            {role.permissions && role.permissions.length > 0 ? (
                                <div className="space-y-2">
                                    {role.permissions.map(
                                        (permission, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                <span className="text-green-500">
                                                    ✓
                                                </span>
                                                <span>{permission}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No specific permissions assigned
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Assigned Employees */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            👨‍💼 Assigned Employees ({role.employees?.length || 0}
                            )
                        </h3>
                        {role.employees && role.employees.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Employee ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Position
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {role.employees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {employee.employee_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {employee.first_name}{" "}
                                                    {employee.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {employee.position || "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No employees are currently assigned to this role
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
