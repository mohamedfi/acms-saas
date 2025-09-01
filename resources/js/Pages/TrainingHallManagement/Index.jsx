import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ halls, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredHalls = halls.filter((hall) => {
        const matchesSearch =
            hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hall.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hall.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && hall.is_active) ||
            (statusFilter === "inactive" && !hall.is_active);

        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        🏢 Training Halls Management
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("training-halls.create")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ➕ Add Hall Only
                        </Link>
                        <Link
                            href={route("training-halls.create-unified")}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            🚀 Add Hall + Booking
                        </Link>
                        <Link
                            href={route("training-halls.reports")}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            📊 Reports & Analytics
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Training Halls" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-2xl">🏢</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Halls
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            {stats.total_halls}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Active Halls
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            {stats.active_halls}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-2xl">📅</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Bookings
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            {stats.total_bookings}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Halls with Bookings
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            {stats.halls_with_bookings}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search halls by name, code, or city..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">
                                            Active Only
                                        </option>
                                        <option value="inactive">
                                            Inactive Only
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Training Halls List */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Training Halls ({filteredHalls.length})
                            </h3>

                            {filteredHalls.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="mx-auto text-6xl text-gray-400">
                                        🏢
                                    </span>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        No training halls found
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm || statusFilter !== "all"
                                            ? "Try adjusting your search or filters."
                                            : "Get started by creating a new training hall."}
                                    </p>
                                    {!searchTerm && statusFilter === "all" && (
                                        <div className="mt-6">
                                            <Link
                                                href={route(
                                                    "training-halls.create"
                                                )}
                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                            >
                                                ➕ Add New Hall
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredHalls.map((hall) => (
                                        <div
                                            key={hall.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {hall.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Code: {hall.code}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        hall.is_active
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}
                                                >
                                                    {hall.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="mr-2">
                                                        📍
                                                    </span>
                                                    {hall.city}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="mr-2">
                                                        👥
                                                    </span>
                                                    Capacity: {hall.capacity}{" "}
                                                    participants
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="mr-2">
                                                        📅
                                                    </span>
                                                    {hall.bookings_count || 0}{" "}
                                                    active bookings
                                                </div>
                                            </div>

                                            {hall.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                    {hall.description}
                                                </p>
                                            )}

                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route(
                                                        "training-halls.show-unified",
                                                        hall.id
                                                    )}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-md transition-colors duration-200"
                                                >
                                                    🎯 Unified View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "training-halls.show",
                                                        hall.id
                                                    )}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors duration-200"
                                                >
                                                    👁️ View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "training-halls.edit",
                                                        hall.id
                                                    )}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-md transition-colors duration-200"
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "training-halls.pdf",
                                                        hall.id
                                                    )}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 text-sm font-medium rounded-md transition-colors duration-200"
                                                >
                                                    📄 PDF
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
