import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ trainers }) {
    const [filterStatus, setFilterStatus] = useState("all");

    console.log("Trainers data:", trainers); // Debug log

    const getFilteredTrainers = () => {
        if (filterStatus === "all") return trainers;
        return trainers.filter((trainer) => trainer.status === filterStatus);
    };

    const handleDelete = (trainerId) => {
        if (confirm("Are you sure you want to delete this trainer?")) {
            router.delete(route("trainers.destroy", trainerId));
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case "active":
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case "inactive":
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            case "on_leave":
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "active":
                return "Active";
            case "inactive":
                return "Inactive";
            case "on_leave":
                return "On Leave";
            default:
                return "Unknown";
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👨‍🏫 Trainers Management
                    </h2>
                    <Link
                        href={route("trainers.create")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        + Add New Trainer
                    </Link>
                </div>
            }
        >
            <Head title="Trainers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Filter Section */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Filter by Status:
                                    </label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) =>
                                            setFilterStatus(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="all">
                                            All Statuses
                                        </option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                        <option value="on_leave">
                                            On Leave
                                        </option>
                                    </select>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {getFilteredTrainers().length} trainer
                                        {getFilteredTrainers().length !== 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                            </div>

                            {trainers.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        👨‍🏫
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No trainers found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Get started by adding your first
                                        trainer.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {getFilteredTrainers().map((trainer) => (
                                        <div
                                            key={trainer.id}
                                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    {trainer.profile_image_url ? (
                                                        <img
                                                            src={
                                                                trainer.profile_image_url
                                                            }
                                                            alt={
                                                                trainer.full_name
                                                            }
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                                                                {trainer.full_name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {trainer.full_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {trainer.position ||
                                                                "No Position"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={getStatusBadge(
                                                        trainer.status
                                                    )}
                                                >
                                                    {getStatusText(
                                                        trainer.status
                                                    )}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400 w-20">
                                                        Email:
                                                    </span>
                                                    <span className="text-gray-900 dark:text-gray-100">
                                                        {trainer.email}
                                                    </span>
                                                </div>
                                                {trainer.phone && (
                                                    <div className="flex items-center text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400 w-20">
                                                            Phone:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-gray-100">
                                                            {trainer.phone}
                                                        </span>
                                                    </div>
                                                )}
                                                {trainer.years_experience >
                                                    0 && (
                                                    <div className="flex items-center text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400 w-20">
                                                            Experience:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-gray-100">
                                                            {
                                                                trainer.years_experience
                                                            }{" "}
                                                            years
                                                        </span>
                                                    </div>
                                                )}
                                                {trainer.hourly_rate && (
                                                    <div className="flex items-center text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400 w-20">
                                                            Rate:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-gray-100">
                                                            {
                                                                trainer.hourly_rate
                                                            }{" "}
                                                            {trainer.currency}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {trainer.expertise_areas &&
                                                trainer.expertise_areas_array && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Expertise Areas:
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {Array.isArray(
                                                                trainer.expertise_areas_array
                                                            ) &&
                                                                trainer.expertise_areas_array.map(
                                                                    (
                                                                        area,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200"
                                                                        >
                                                                            {
                                                                                area
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                )}

                                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Course Assignments
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {/* {trainer.total_courses} total */}
                                                        Coming Soon
                                                    </span>
                                                </div>
                                                {/* Temporarily commented out for debugging
                                                <div className="space-y-2">
                                                    {trainer.courses_as_trainer && trainer.courses_as_trainer.length > 0 && (
                                                        <div className="text-xs">
                                                            <span className="text-green-600 dark:text-green-400">
                                                                👨‍🏫 Trainer:
                                                            </span>{" "}
                                                            {
                                                                trainer
                                                                    .courses_as_trainer
                                                                    .length
                                                            }{" "}
                                                            courses
                                                        </div>
                                                    )}
                                                    {trainer
                                                        .courses_as_coordinator
                                                        .length > 0 && (
                                                        <div className="text-xs">
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                📋 Coordinator:
                                                            </span>{" "}
                                                            {
                                                                trainer
                                                                    .courses_as_coordinator
                                                                    .length
                                                            }{" "}
                                                            courses
                                                        </div>
                                                    )}
                                                </div>
                                                */}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route(
                                                            "trainers.show",
                                                            trainer.id
                                                        )}
                                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium text-center transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "trainers.edit",
                                                            trainer.id
                                                        )}
                                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium text-center transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                trainer.id
                                                            )
                                                        }
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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
