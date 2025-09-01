import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Roles({ auth, roles }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const handleDelete = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            router.delete(
                route("user-management.roles.destroy", roleToDelete.id)
            );
            setShowDeleteModal(false);
            setRoleToDelete(null);
        }
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Manage Roles
                </h2>
            }
        >
            <Head title="Manage Roles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Role Management
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Create, edit, and manage user roles and
                                    permissions.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("user-management.index")}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ← Back to Dashboard
                                </Link>
                                <Link
                                    href={route("user-management.roles.create")}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ➕ Create Role
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Roles Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {roles.data && roles.data.length > 0 ? (
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
                                                    Users
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
                                            {roles.data.map((role) => (
                                                <tr
                                                    key={role.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                    <span className="text-lg">
                                                                        🔐
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {role.display_name ||
                                                                        role.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {role.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {role.description ||
                                                            "No description"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {role.users_count ||
                                                                0}{" "}
                                                            users
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                role.is_active
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                            }`}
                                                        >
                                                            {role.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {formatDate(
                                                            role.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "user-management.roles.edit",
                                                                    role.id
                                                                )}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                                                            >
                                                                ✏️ Edit
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        role
                                                                    )
                                                                }
                                                                disabled={
                                                                    role.users_count >
                                                                    0
                                                                }
                                                                className={`${
                                                                    role.users_count >
                                                                    0
                                                                        ? "text-gray-400 cursor-not-allowed"
                                                                        : "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                                                                }`}
                                                                title={
                                                                    role.users_count >
                                                                    0
                                                                        ? "Cannot delete role with assigned users"
                                                                        : "Delete role"
                                                                }
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                                        🔐
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No Roles Found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start by creating your first role.
                                    </p>
                                    <Link
                                        href={route(
                                            "user-management.roles.create"
                                        )}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Create First Role
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {roles.links && roles.links.length > 1 && (
                        <div className="mt-6">
                            <nav className="flex justify-center">
                                <div className="flex space-x-1">
                                    {roles.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            } ${
                                                !link.url &&
                                                "opacity-50 cursor-not-allowed"
                                            }`}
                                            {...(!link.url && {
                                                onClick: (e) =>
                                                    e.preventDefault(),
                                            })}
                                        >
                                            {link.label
                                                .replace("&laquo;", "«")
                                                .replace("&raquo;", "»")}
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        </div>
                    )}

                    {/* About Roles */}
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                            About User Roles
                        </h3>
                        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
                            <p>
                                <strong>Roles</strong> define what users can
                                access and do in the system. Each role has
                                specific permissions that control access to
                                different features.
                            </p>
                            <p>
                                <strong>Admin:</strong> Full system access, can
                                manage users, roles, and all features.
                            </p>
                            <p>
                                <strong>Manager:</strong> Limited admin access,
                                can manage specific areas and users.
                            </p>
                            <p>
                                <strong>Employee:</strong> Basic access to
                                assigned features and personal information.
                            </p>
                            <p>
                                <strong>Viewer:</strong> Read-only access to
                                specific information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && roleToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">
                                Delete Role
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Are you sure you want to delete the role{" "}
                                <strong>
                                    "
                                    {roleToDelete.display_name ||
                                        roleToDelete.name}
                                    "
                                </strong>
                                ? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-3 mt-6">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
