import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Index({ departments, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const { delete: destroy, patch } = useForm();

    const handleDelete = (department) => {
        if (confirm(`Are you sure you want to delete ${department.name}?`)) {
            destroy(route("departments.destroy", department.id));
        }
    };

    const handleToggleStatus = (department) => {
        patch(route("departments.toggle-status", department.id));
    };

    const filteredDepartments = departments
        .filter((department) => {
            const matchesSearch =
                department.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (department.code &&
                    department.code
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));
            const matchesStatus =
                selectedStatus === "" ||
                (selectedStatus === "active" && department.is_active) ||
                (selectedStatus === "inactive" && !department.is_active);
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "code":
                    return (a.code || "").localeCompare(b.code || "");
                case "employees":
                    return b.employees_count - a.employees_count;
                case "budget":
                    return (b.budget || 0) - (a.budget || 0);
                default:
                    return 0;
            }
        });

    const getStatusColor = (isActive) => {
        return isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    };

    const getBudgetUtilizationColor = (utilization) => {
        if (utilization >= 90) return "text-red-600 dark:text-red-400";
        if (utilization >= 75) return "text-orange-600 dark:text-orange-400";
        if (utilization >= 50) return "text-yellow-600 dark:text-yellow-400";
        return "text-green-600 dark:text-green-400";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        🏢 Department Management
                    </h2>
                    <Link
                        href={route("departments.create")}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ➕ Add Department
                    </Link>
                </div>
            }
        >
            <Head title="Department Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                🏢
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Departments
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {stats.total_departments}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                ✅
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Active Departments
                                        </div>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {stats.active_departments}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                👥
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Employees
                                        </div>
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {stats.total_employees}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                👨‍💼
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            With Managers
                                        </div>
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {stats.departments_with_managers}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🔍 Search
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Search by name or code..."
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        📊 Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) =>
                                            setSelectedStatus(e.target.value)
                                        }
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🔄 Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="name">Name</option>
                                        <option value="code">Code</option>
                                        <option value="employees">
                                            Employee Count
                                        </option>
                                        <option value="budget">Budget</option>
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedStatus("");
                                            setSortBy("name");
                                        }}
                                        className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                    >
                                        🗑️ Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Departments Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                📋 Departments List
                            </h3>

                            {filteredDepartments.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 dark:text-gray-400 text-lg">
                                        No departments found matching your
                                        criteria.
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Department
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Code
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Manager
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Employees
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Budget
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
                                            {filteredDepartments.map(
                                                (department) => (
                                                    <tr
                                                        key={department.id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        department.name
                                                                    }
                                                                </div>
                                                                {department.description && (
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                                        {
                                                                            department.description
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                                {department.code ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                {department.manager ? (
                                                                    <span className="flex items-center">
                                                                        <span className="mr-2">
                                                                            👨‍💼
                                                                        </span>
                                                                        {
                                                                            department
                                                                                .manager
                                                                                .first_name
                                                                        }{" "}
                                                                        {
                                                                            department
                                                                                .manager
                                                                                .last_name
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                        No
                                                                        Manager
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                <span className="font-medium">
                                                                    {
                                                                        department.employees_count
                                                                    }
                                                                </span>
                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                    {" "}
                                                                    employees
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                {department.budget ? (
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            EGP{" "}
                                                                            {parseFloat(
                                                                                department.budget
                                                                            ).toLocaleString()}
                                                                        </div>
                                                                        {department.total_salary && (
                                                                            <div
                                                                                className={`text-xs ${getBudgetUtilizationColor(
                                                                                    department.budget_utilization
                                                                                )}`}
                                                                            >
                                                                                {
                                                                                    department.budget_utilization
                                                                                }
                                                                                %
                                                                                utilized
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                        No
                                                                        Budget
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                                    department.is_active
                                                                )}`}
                                                            >
                                                                {department.is_active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={route(
                                                                        "departments.show",
                                                                        department.id
                                                                    )}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    👁️ View
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "departments.edit",
                                                                        department.id
                                                                    )}
                                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                >
                                                                    ✏️ Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleToggleStatus(
                                                                            department
                                                                        )
                                                                    }
                                                                    className={`${
                                                                        department.is_active
                                                                            ? "text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                                                            : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                    }`}
                                                                >
                                                                    {department.is_active
                                                                        ? "⏸️ Deactivate"
                                                                        : "▶️ Activate"}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            department
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
