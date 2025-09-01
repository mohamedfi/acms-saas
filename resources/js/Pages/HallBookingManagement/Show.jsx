import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ booking }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "scheduled":
                return "📅";
            case "in_progress":
                return "🔄";
            case "completed":
                return "✅";
            case "cancelled":
                return "❌";
            default:
                return "❓";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    const formatTime = (time) => {
        if (!time) return "N/A";
        return time.replace(":00", "");
    };

    const formatSessionDates = (sessionDates) => {
        if (!sessionDates || !Array.isArray(sessionDates)) return "N/A";
        return sessionDates.join(", ");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📋 Hall Booking Details
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("hall-bookings.edit", booking.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ✏️ Edit Booking
                        </Link>
                        <Link
                            href={route("hall-bookings.index")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ⬅️ Back to Bookings
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Booking ${booking.booking_reference}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {getStatusIcon(booking.status)}{" "}
                                            {booking.status
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            #{booking.booking_reference}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        📚 {booking.training_program?.name || "Unknown Program"}
                                    </h1>

                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        🏢 {booking.training_hall?.name || "Unknown Hall"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Course & Hall Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Course Details */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        📚 Course Information
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Course Name
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {booking.training_program?.name || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Course Code
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {booking.training_program?.code || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Duration
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {booking.training_program?.duration || "N/A"} days
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Category
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {booking.training_program?.category || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        📅 Schedule & Timing
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Start Date
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatDate(booking.start_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                End Date
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatDate(booking.end_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Start Time
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatTime(booking.start_time)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                End Time
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatTime(booking.end_time)}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Session Dates
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {formatSessionDates(booking.session_dates)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Participants Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        👥 Participants & Capacity
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Maximum Participants
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {booking.max_participants}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Current Participants
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {booking.current_participants || 0}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Capacity Usage
                                            </label>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${
                                                                ((booking.current_participants ||
                                                                    0) /
                                                                    booking.max_participants) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    {Math.round(
                                                        ((booking.current_participants ||
                                                            0) /
                                                            booking.max_participants) *
                                                            100
                                                    )}% full
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Hall Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        🏢 Hall Information
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Hall Name
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.training_hall?.name || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Location
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.training_hall?.city || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Capacity
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.training_hall?.capacity || "N/A"} participants
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Address
                                            </label>
                                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                                {booking.training_hall?.address || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trainer Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        👨‍🏫 Trainer Information
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Trainer Name
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.trainer?.full_name || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Position
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.trainer?.position || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Department
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.trainer?.department || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        ℹ️ Additional Details
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Price per Participant
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.price_per_participant
                                                    ? `$${booking.price_per_participant}`
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Recurring Session
                                            </label>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {booking.is_recurring ? "Yes" : "No"}
                                            </p>
                                        </div>
                                        {booking.notes && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Notes
                                                </label>
                                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                                    {booking.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
