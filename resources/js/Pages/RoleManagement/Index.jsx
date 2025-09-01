import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ roles, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    // Filter and sort roles
    const filteredRoles = roles
        .filter((role) => {
            const matchesSearch =
                role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                role.display_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && role.is_active) ||
                (statusFilter === "inactive" && !role.is_active);
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "employees":
                    return b.employees_count - a.employees_count;
                case "access_level":
                    return b.access_level - a.access_level;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const handleDelete = (role) => {
        if (
            confirm(
                `Are you sure you want to delete the role "${role.display_name}"?`
            )
        ) {
            router.delete(route("role-management.destroy", role.id));
        }
    };

    const handleToggleStatus = (role) => {
        router.patch(route("role-management.toggle-status", role.id));
    };

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
                        👥 Role Management
                    </h2>
                    <Link
                        href={route("role-management.create")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        ➕ Create New Role
                    </Link>
                </div>
            }
        >
            <Head title="Role Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Roles
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stats.total_roles}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Active Roles
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stats.active_roles}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <span className="text-2xl">👨‍💼</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Employees
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stats.total_employees}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                                    <span className="text-2xl">🔗</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Roles in Use
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stats.roles_with_employees}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search roles..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">
                                        Inactive Only
                                    </option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="employees">
                                        Sort by Employees
                                    </option>
                                    <option value="access_level">
                                        Sort by Access Level
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Roles Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Roles ({filteredRoles.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Employees
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Access Level
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
                                    {filteredRoles.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${getRoleColor(
                                                            role
                                                        )} mr-3`}
                                                    ></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {role.display_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {role.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                                                    {role.description ||
                                                        "No description"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {role.employees_count}{" "}
                                                    employees
                                                </div>
                                                {role.employees_count > 0 && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {role.employees
                                                            ?.slice(0, 2)
                                                            .map(
                                                                (emp) =>
                                                                    emp.first_name
                                                            )
                                                            .join(", ")}
                                                        {role.employees_count >
                                                            2 &&
                                                            ` +${
                                                                role.employees_count -
                                                                2
                                                            } more`}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    Level{" "}
                                                    {role.access_level || 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                        role.is_active
                                                    )}`}
                                                >
                                                    {role.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route(
                                                            "role-management.show",
                                                            role.id
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        👁️ View
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "role-management.edit",
                                                            role.id
                                                        )}
                                                        className="text-indigo-600 hover:text-blue-900 dark:text-indigo-400 dark:hover:text-blue-300"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                role
                                                            )
                                                        }
                                                        className={`${
                                                            role.is_active
                                                                ? "text-yellow-600 hover:text-yellow-900"
                                                                : "text-green-600 hover:text-green-900"
                                                        } dark:text-yellow-400 dark:hover:text-yellow-300`}
                                                    >
                                                        {role.is_active
                                                            ? "⏸️ Deactivate"
                                                            : "▶️ Activate"}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(role)
                                                        }
                                                        className={`${
                                                            role.employees_count >
                                                            0
                                                                ? "text-gray-400 cursor-not-allowed opacity-50"
                                                                : "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        }`}
                                                        disabled={
                                                            role.employees_count >
                                                            0
                                                        }
                                                        title={
                                                            role.employees_count >
                                                            0
                                                                ? `Cannot delete: ${role.employees_count} employee(s) assigned`
                                                                : "Delete this role"
                                                        }
                                                    >
                                                        🗑️ Delete
                                                        {role.employees_count >
                                                            0 && (
                                                            <span className="ml-1 text-xs">
                                                                (
                                                                {
                                                                    role.employees_count
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredRoles.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No roles found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filters."
                                    : "Get started by creating your first role."}
                            </p>
                            {!searchTerm && statusFilter === "all" && (
                                <Link
                                    href={route("role-management.create")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                                >
                                    ➕ Create Your First Role
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
