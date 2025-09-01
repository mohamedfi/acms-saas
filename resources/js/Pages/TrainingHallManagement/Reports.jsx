import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
// Icons replaced with emojis

export default function Reports({ auth, stats, halls, bookings, programs }) {
    const [selectedTimeframe, setSelectedTimeframe] = useState("month");
    const [selectedHall, setSelectedHall] = useState("all");
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        generateChartData();
    }, [selectedTimeframe, selectedHall, bookings, halls]);

    const generateChartData = () => {
        // Filter data based on selected hall
        let filteredBookings = bookings;
        if (selectedHall !== "all") {
            filteredBookings = bookings.filter(
                (booking) => booking.training_hall_id == selectedHall
            );
        }

        // Generate monthly data
        const monthlyData = {};
        const programData = {};
        const hallData = {};
        const statusData = {};

        filteredBookings.forEach((booking) => {
            const date = new Date(booking.start_date);
            const month = date.toLocaleString("default", {
                month: "short",
                year: "2-digit",
            });
            monthlyData[month] = (monthlyData[month] || 0) + 1;

            const programName = booking.training_program?.name || "Unknown";
            programData[programName] = (programData[programName] || 0) + 1;

            const hallName =
                halls.find((h) => h.id == booking.training_hall_id)?.name ||
                "Unknown";
            hallData[hallName] = (hallData[hallName] || 0) + 1;

            statusData[booking.status] = (statusData[booking.status] || 0) + 1;
        });

        setChartData({
            monthly: monthlyData,
            programs: programData,
            halls: hallData,
            status: statusData,
        });
    };

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

    const exportReport = () => {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Training Hall Report\n";
        csvContent += "Generated: " + new Date().toLocaleDateString() + "\n\n";

        csvContent +=
            "Hall Name,Code,City,Capacity,Total Bookings,Active Bookings,Utilization Rate\n";

        halls.forEach((hall) => {
            const hallBookings = bookings.filter(
                (b) => b.training_hall_id == hall.id
            );
            const activeBookings = hallBookings.filter(
                (b) => b.status !== "cancelled"
            );
            const utilizationRate =
                hall.capacity > 0
                    ? ((activeBookings.length / hall.capacity) * 100).toFixed(1)
                    : 0;

            csvContent += `"${hall.name}","${hall.code}","${hall.city}",${hall.capacity},${hallBookings.length},${activeBookings.length},${utilizationRate}%\n`;
        });

        // Download CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `training-hall-report-${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Training Hall Reports & Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Training Hall Reports & Analytics
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Comprehensive insights and performance metrics
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={exportReport}
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 border-green-600"
                            >
                                📥 Export CSV
                            </Button>
                            <Link href={route("training-halls.index")}>
                                <Button>← Back to Halls</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Timeframe
                                    </label>
                                    <select
                                        value={selectedTimeframe}
                                        onChange={(e) =>
                                            setSelectedTimeframe(e.target.value)
                                        }
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="week">This Week</option>
                                        <option value="month">
                                            This Month
                                        </option>
                                        <option value="quarter">
                                            This Quarter
                                        </option>
                                        <option value="year">This Year</option>
                                        <option value="all">All Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Training Hall
                                    </label>
                                    <select
                                        value={selectedHall}
                                        onChange={(e) =>
                                            setSelectedHall(e.target.value)
                                        }
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="all">All Halls</option>
                                        {halls.map((hall) => (
                                            <option
                                                key={hall.id}
                                                value={hall.id}
                                            >
                                                {hall.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        🏢
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Halls
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.total_halls}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        📅
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Bookings
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.total_bookings}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        👥
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Active Halls
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.active_halls}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        📈
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Utilization Rate
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.total_halls > 0
                                                ? Math.round(
                                                      (stats.halls_with_bookings /
                                                          stats.total_halls) *
                                                          100
                                                  )
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Monthly Bookings Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    📊 Monthly Bookings Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {chartData?.monthly &&
                                Object.keys(chartData.monthly).length > 0 ? (
                                    <div className="space-y-3">
                                        {Object.entries(chartData.monthly).map(
                                            ([month, count]) => (
                                                <div
                                                    key={month}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                                                        {month}
                                                    </span>
                                                    <div className="flex items-center space-x-2 flex-1">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
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
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                                                            {count}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No data available for the selected
                                        timeframe
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Program Distribution Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    🥧 Program Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {chartData?.programs &&
                                Object.keys(chartData.programs).length > 0 ? (
                                    <div className="space-y-3">
                                        {Object.entries(chartData.programs).map(
                                            ([program, count]) => (
                                                <div
                                                    key={program}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate max-w-32">
                                                        {program}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-32 bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className="bg-green-600 h-3 rounded-full transition-all duration-300"
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
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                                                            {count}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No data available for the selected
                                        timeframe
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Hall Performance Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📈 Hall Performance Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hall
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Capacity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Bookings
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Active Bookings
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Utilization Rate
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
                                        {halls.map((hall) => {
                                            const hallBookings =
                                                bookings.filter(
                                                    (b) =>
                                                        b.training_hall_id ==
                                                        hall.id
                                                );
                                            const activeBookings =
                                                hallBookings.filter(
                                                    (b) =>
                                                        b.status !== "cancelled"
                                                );
                                            const utilizationRate =
                                                hall.capacity > 0
                                                    ? (
                                                          (activeBookings.length /
                                                              hall.capacity) *
                                                          100
                                                      ).toFixed(1)
                                                    : 0;

                                            return (
                                                <tr key={hall.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {hall.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {hall.code}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {hall.city}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {hall.capacity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {hallBookings.length}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {activeBookings.length}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${
                                                                        utilizationRate >
                                                                        70
                                                                            ? "bg-green-600"
                                                                            : utilizationRate >
                                                                              40
                                                                            ? "bg-yellow-600"
                                                                            : "bg-red-600"
                                                                    }`}
                                                                    style={{
                                                                        width: `${Math.min(
                                                                            utilizationRate,
                                                                            100
                                                                        )}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-gray-900 dark:text-white">
                                                                {
                                                                    utilizationRate
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "training-halls.show",
                                                                    hall.id
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "training-halls.pdf",
                                                                    hall.id
                                                                )}
                                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                            >
                                                                PDF
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
