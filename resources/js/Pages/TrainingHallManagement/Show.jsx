import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
// Icons replaced with simple text/emoji

export default function Show({ auth, hall }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Generate chart data for the hall
        if (hall.bookings && hall.bookings.length > 0) {
            const monthlyData = {};
            const programData = {};

            hall.bookings.forEach((booking) => {
                const month = new Date(booking.start_date).toLocaleString(
                    "default",
                    { month: "short" }
                );
                monthlyData[month] = (monthlyData[month] || 0) + 1;

                const programName = booking.training_program?.name || "Unknown";
                programData[programName] = (programData[programName] || 0) + 1;
            });

            setChartData({
                monthly: monthlyData,
                programs: programData,
            });
        }
    }, [hall]);

    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "manager":
                return "bg-purple-100 text-purple-800";
            case "coordinator":
                return "bg-blue-100 text-blue-800";
            case "supervisor":
                return "bg-green-100 text-green-800";
            case "assistant":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Training Hall - ${hall.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {hall.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Code: {hall.code} • {hall.city}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route("training-halls.edit", hall.id)}>
                                <Button variant="default" className="bg-blue-600 hover:bg-blue-700 border-blue-600">📝 Edit</Button>
                            </Link>
                            <Link href={route("training-halls.pdf", hall.id)}>
                                <Button>📊 Export PDF</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            {["overview", "bookings", "analytics"].map(
                                (tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                                            activeTab === tab
                                                ? "border-indigo-500 text-indigo-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                )
                            )}
                        </nav>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        🏢 Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Status
                                        </label>
                                        <div className="mt-1">
                                            <Badge
                                                className={
                                                    hall.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {hall.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Capacity
                                        </label>
                                        <p className="mt-1 text-lg font-semibold">
                                            {hall.capacity} participants
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Description
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {hall.description ||
                                                "No description available"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location & Contact */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        📍 Location & Contact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Address
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {hall.address ||
                                                "No address available"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            City
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {hall.city}
                                        </p>
                                    </div>
                                    {hall.contact_person && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Contact Person
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                {hall.contact_person}
                                            </p>
                                        </div>
                                    )}
                                    {hall.contact_phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Phone
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                {hall.contact_phone}
                                            </p>
                                        </div>
                                    )}
                                    {hall.contact_email && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Email
                                            </label>
                                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                {hall.contact_email}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Employee Assignment */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        👤 Employee Assignment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {hall.assigned_employee ? (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Assigned Employee
                                                </label>
                                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                    {
                                                        hall.assigned_employee
                                                            .full_name
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Role
                                                </label>
                                                <div className="mt-1">
                                                    <Badge
                                                        className={getRoleColor(
                                                            hall.assigned_role
                                                        )}
                                                    >
                                                        {hall.assigned_role ||
                                                            "Not specified"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {hall.assignment_date && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Assignment Date
                                                    </label>
                                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                        {new Date(
                                                            hall.assignment_date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            {hall.assignment_notes && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Notes
                                                    </label>
                                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                                        {hall.assignment_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500">
                                            No employee assigned
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Bookings Tab */}
                    {activeTab === "bookings" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    📅 Training Sessions (
                                    {hall.bookings?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {hall.bookings && hall.bookings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Program
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Participants
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {hall.bookings.map(
                                                    (booking) => (
                                                        <tr key={booking.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {booking
                                                                        .training_program
                                                                        ?.name ||
                                                                        "Unknown Program"}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {booking
                                                                        .training_program
                                                                        ?.code ||
                                                                        "No Code"}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {new Date(
                                                                    booking.start_date
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {
                                                                    booking.start_time
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    booking.end_time
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {
                                                                    booking.current_participants
                                                                }
                                                                /
                                                                {
                                                                    booking.max_participants
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Badge
                                                                    className={getStatusColor(
                                                                        booking.status
                                                                    )}
                                                                >
                                                                    {booking.status.replace(
                                                                        "_",
                                                                        " "
                                                                    )}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <Link
                                                                    href={route(
                                                                        "hall-bookings.show",
                                                                        booking.id
                                                                    )}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No bookings found for this hall.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Monthly Bookings Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Bookings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {chartData?.monthly ? (
                                        <div className="space-y-3">
                                            {Object.entries(
                                                chartData.monthly
                                            ).map(([month, count]) => (
                                                <div
                                                    key={month}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {month}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (count /
                                                                            Math.max(
                                                                                ...Object.values(
                                                                                    chartData.monthly
                                                                                )
                                                                            )) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                                                            {count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            No data available for charts
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Program Distribution Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Program Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {chartData?.programs ? (
                                        <div className="space-y-3">
                                            {Object.entries(
                                                chartData.programs
                                            ).map(([program, count]) => (
                                                <div
                                                    key={program}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate max-w-32">
                                                        {program}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (count /
                                                                            Math.max(
                                                                                ...Object.values(
                                                                                    chartData.programs
                                                                                )
                                                                            )) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                                                            {count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            No data available for charts
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
