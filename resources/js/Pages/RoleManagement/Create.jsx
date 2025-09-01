import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        display_name: "",
        description: "",
        permissions: [],
        is_active: true,
        sort_order: 0,
        color: "",
        icon: "",
        access_level: 1,
        assigned_employees: [], // New field for employee assignment
    });

    const permissionOptions = [
        {
            group: "Course Management",
            permissions: [
                "courses.view",
                "courses.create",
                "courses.edit",
                "courses.delete",
                "courses.manage",
            ],
        },
        {
            group: "Participant Management",
            permissions: [
                "participants.view",
                "participants.create",
                "participants.edit",
                "participants.delete",
                "participants.manage",
            ],
        },
        {
            group: "Employee Management",
            permissions: [
                "employees.view",
                "employees.create",
                "employees.edit",
                "employees.delete",
                "employees.manage",
            ],
        },
        {
            group: "Department Management",
            permissions: [
                "departments.view",
                "departments.create",
                "departments.edit",
                "departments.delete",
                "departments.manage",
            ],
        },
        {
            group: "Role Management",
            permissions: [
                "roles.view",
                "roles.create",
                "roles.edit",
                "roles.delete",
                "roles.manage",
            ],
        },
        {
            group: "Asset Management",
            permissions: [
                "assets.view",
                "assets.create",
                "assets.edit",
                "assets.delete",
                "assets.manage",
            ],
        },
        {
            group: "Financial Management",
            permissions: [
                "finance.view",
                "finance.create",
                "finance.edit",
                "finance.delete",
                "finance.manage",
            ],
        },
        {
            group: "Task Management",
            permissions: [
                "tasks.view",
                "tasks.create",
                "tasks.edit",
                "tasks.delete",
                "tasks.manage",
            ],
        },
        {
            group: "Reports & Analytics",
            permissions: [
                "reports.view",
                "reports.create",
                "reports.export",
                "analytics.view",
            ],
        },
        {
            group: "System Administration",
            permissions: [
                "system.settings",
                "system.users",
                "system.backup",
                "system.logs",
            ],
        },
    ];

    const colorOptions = [
        { name: "Red", value: "bg-red-500", preview: "bg-red-500" },
        { name: "Blue", value: "bg-blue-500", preview: "bg-blue-500" },
        { name: "Green", value: "bg-green-500", preview: "bg-green-500" },
        { name: "Purple", value: "bg-purple-500", preview: "bg-purple-500" },
        { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500" },
        { name: "Teal", value: "bg-teal-500", preview: "bg-teal-500" },
        { name: "Pink", value: "bg-pink-500", preview: "bg-pink-500" },
        { name: "Indigo", value: "bg-indigo-500", preview: "bg-indigo-500" },
        { name: "Yellow", value: "bg-yellow-500", preview: "bg-yellow-500" },
        { name: "Gray", value: "bg-gray-500", preview: "bg-gray-500" },
    ];

    const iconOptions = [
        "👑",
        "👥",
        "👨‍💼",
        "👩‍💼",
        "🎓",
        "💼",
        "🔧",
        "📊",
        "💰",
        "📈",
        "🎯",
        "⚡",
        "🌟",
        "💎",
        "🔥",
        "💡",
        "🚀",
        "🎪",
        "🏆",
        "💪",
    ];

    const handlePermissionChange = (permission) => {
        const newPermissions = data.permissions.includes(permission)
            ? data.permissions.filter((p) => p !== permission)
            : [...data.permissions, permission];
        setData("permissions", newPermissions);
    };

    const handleSelectAll = (group) => {
        const groupPermissions = group.permissions;
        const hasAllPermissions = groupPermissions.every((p) =>
            data.permissions.includes(p)
        );

        if (hasAllPermissions) {
            // Remove all permissions from this group
            const newPermissions = data.permissions.filter(
                (p) => !groupPermissions.includes(p)
            );
            setData("permissions", newPermissions);
        } else {
            // Add all permissions from this group
            const newPermissions = [
                ...new Set([...data.permissions, ...groupPermissions]),
            ];
            setData("permissions", newPermissions);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("role-management.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ➕ Create New Role
                    </h2>
                    <Link
                        href={route("role-management.index")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        ← Back to Roles
                    </Link>
                </div>
            }
        >
            <Head title="Create New Role" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                📝 Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., admin, manager, trainer"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Display Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.display_name}
                                        onChange={(e) =>
                                            setData(
                                                "display_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Administrator, Department Manager"
                                    />
                                    {errors.display_name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.display_name}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Describe the role's purpose and responsibilities..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role Configuration */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                ⚙️ Role Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Access Level *
                                    </label>
                                    <select
                                        value={data.access_level}
                                        onChange={(e) =>
                                            setData(
                                                "access_level",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value={1}>
                                            Level 1 - Basic Access
                                        </option>
                                        <option value={2}>
                                            Level 2 - Standard Access
                                        </option>
                                        <option value={3}>
                                            Level 3 - Advanced Access
                                        </option>
                                        <option value={4}>
                                            Level 4 - Manager Access
                                        </option>
                                        <option value={5}>
                                            Level 5 - Admin Access
                                        </option>
                                        <option value={10}>
                                            Level 10 - Super Admin
                                        </option>
                                    </select>
                                    {errors.access_level && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.access_level}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="0"
                                    />
                                    {errors.sort_order && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.sort_order}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    "is_active",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Customization */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                🎨 Visual Customization
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role Color
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "color",
                                                        color.value
                                                    )
                                                }
                                                className={`w-8 h-8 rounded-full ${
                                                    color.preview
                                                } border-2 ${
                                                    data.color === color.value
                                                        ? "border-gray-900"
                                                        : "border-transparent"
                                                } hover:scale-110 transition-transform`}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    {errors.color && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.color}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role Icon
                                    </label>
                                    <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                                        {iconOptions.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() =>
                                                    setData("icon", icon)
                                                }
                                                className={`w-8 h-8 text-lg hover:scale-110 transition-transform ${
                                                    data.icon === icon
                                                        ? "ring-2 ring-purple-500"
                                                        : ""
                                                }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.icon && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.icon}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Employee Assignment */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                👥 Assign Employees to This Role
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Select Employees
                                    </label>

                                    {/* Employee Selection Dropdown */}
                                    <div className="relative">
                                        {/* Quick Action Buttons */}
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const allEmployeeIds =
                                                        employees.map(
                                                            (emp) => emp.id
                                                        );
                                                    setData(
                                                        "assigned_employees",
                                                        allEmployeeIds
                                                    );
                                                }}
                                                className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "assigned_employees",
                                                        []
                                                    )
                                                }
                                                className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        </div>

                                        <select
                                            multiple
                                            value={data.assigned_employees}
                                            onChange={(e) => {
                                                const selectedOptions =
                                                    Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        (option) =>
                                                            parseInt(
                                                                option.value
                                                            )
                                                    );
                                                setData(
                                                    "assigned_employees",
                                                    selectedOptions
                                                );
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-h-32"
                                        >
                                            {employees.map((employee) => (
                                                <option
                                                    key={employee.id}
                                                    value={employee.id}
                                                >
                                                    {employee.label}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            💡 Hold Ctrl (or Cmd on Mac) to
                                            select multiple employees
                                        </p>
                                    </div>

                                    {/* Selected Count Display */}
                                    {data.assigned_employees.length > 0 && (
                                        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <p className="text-sm text-purple-700 dark:text-purple-300">
                                                <strong>Selected:</strong>{" "}
                                                {data.assigned_employees.length}{" "}
                                                employee(s)
                                            </p>
                                        </div>
                                    )}

                                    {errors.assigned_employees && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.assigned_employees}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                🔐 Permissions
                            </h3>
                            <div className="space-y-4">
                                {permissionOptions.map((group) => (
                                    <div
                                        key={group.group}
                                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                                                {group.group}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSelectAll(group)
                                                }
                                                className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                            >
                                                {group.permissions.every((p) =>
                                                    data.permissions.includes(p)
                                                )
                                                    ? "Deselect All"
                                                    : "Select All"}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {group.permissions.map(
                                                (permission) => (
                                                    <label
                                                        key={permission}
                                                        className="flex items-center"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.permissions.includes(
                                                                permission
                                                            )}
                                                            onChange={() =>
                                                                handlePermissionChange(
                                                                    permission
                                                                )
                                                            }
                                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                            {permission
                                                                .split(".")
                                                                .pop()
                                                                .replace(
                                                                    /([A-Z])/g,
                                                                    " $1"
                                                                )
                                                                .trim()}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.permissions}
                                </p>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4">
                            <Link
                                href={route("role-management.index")}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                {processing ? "Creating..." : "Create Role"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
