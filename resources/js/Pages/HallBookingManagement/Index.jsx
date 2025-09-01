import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ bookings, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [hallFilter, setHallFilter] = useState("all");
    const [programFilter, setProgramFilter] = useState("all");

    // Get unique halls and programs for filters
    const uniqueHalls = [
        ...new Set(bookings.map((b) => b.training_hall?.name).filter(Boolean)),
    ];
    const uniquePrograms = [
        ...new Set(
            bookings.map((b) => b.training_program?.name).filter(Boolean)
        ),
    ];

    const [selectedCourses, setSelectedCourses] = useState(uniquePrograms);

    // Calculate dynamic statistics based on selected courses
    const getFilteredStats = () => {
        if (
            selectedCourses.length === 0 ||
            selectedCourses.length === uniquePrograms.length
        ) {
            return stats; // Return global stats if all courses selected or none selected
        }

        const filteredBookings = bookings.filter((booking) =>
            selectedCourses.includes(
                booking.training_program?.name || "Unknown Course"
            )
        );

        return {
            total_bookings: filteredBookings.length,
            scheduled_bookings: filteredBookings.filter(
                (b) => b.status === "scheduled"
            ).length,
            in_progress_bookings: filteredBookings.filter(
                (b) => b.status === "in_progress"
            ).length,
            completed_bookings: filteredBookings.filter(
                (b) => b.status === "completed"
            ).length,
        };
    };

    const filteredStats = getFilteredStats();

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.training_program?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            booking.training_hall?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            booking.booking_reference
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            booking.trainer?.full_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || booking.status === statusFilter;
        const matchesHall =
            hallFilter === "all" || booking.training_hall?.name === hallFilter;
        const matchesProgram =
            programFilter === "all" ||
            booking.training_program?.name === programFilter;

        return matchesSearch && matchesStatus && matchesHall && matchesProgram;
    });

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

    const formatSessionDates = (sessionDates) => {
        if (!sessionDates || !Array.isArray(sessionDates)) return "N/A";
        return (
            sessionDates.slice(0, 3).join(", ") +
            (sessionDates.length > 3 ? "..." : "")
        );
    };

    const formatTime = (time) => {
        if (!time) return "N/A";
        return time.replace(":00", "");
    };

    const exportReport = () => {
        // Filter bookings by selected courses
        const bookingsToExport =
            selectedCourses.length > 0
                ? filteredBookings.filter((booking) =>
                      selectedCourses.includes(
                          booking.training_program?.name || "Unknown Course"
                      )
                  )
                : filteredBookings;

        if (bookingsToExport.length === 0) {
            alert(
                "No bookings found for selected courses. Please select at least one course."
            );
            return;
        }

        // Create comprehensive CSV with all course and booking information
        const headers = [
            "Course Name",
            "Course Code",
            "Course Duration",
            "Course Category",
            "Hall Name",
            "Hall Location",
            "Hall Capacity",
            "Trainer Name",
            "Trainer Position",
            "Start Date",
            "End Date",
            "Start Time",
            "End Time",
            "Session Dates",
            "Max Participants",
            "Current Participants",
            "Status",
            "Price Per Participant",
            "Booking Reference",
            "Notes",
        ];

        const csvData = bookingsToExport.map((booking) => [
            booking.training_program?.name || "N/A",
            booking.training_program?.code || "N/A",
            booking.training_program?.duration || "N/A",
            booking.training_program?.category || "N/A",
            booking.training_hall?.name || "N/A",
            booking.training_hall?.city || "N/A",
            booking.training_hall?.capacity || "N/A",
            booking.trainer?.full_name || "N/A",
            booking.trainer?.position || "N/A",
            formatDate(booking.start_date),
            formatDate(booking.end_date),
            formatTime(booking.start_time),
            formatTime(booking.end_time),
            formatSessionDates(booking.session_dates),
            booking.max_participants || "N/A",
            booking.current_participants || "N/A",
            booking.status || "N/A",
            booking.price_per_participant || "N/A",
            booking.booking_reference || "N/A",
            booking.notes || "N/A",
        ]);

        const csvContent = [headers, ...csvData]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `hall_bookings_report_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportDetailedReport = () => {
        // Filter bookings by selected courses
        const bookingsToExport =
            selectedCourses.length > 0
                ? filteredBookings.filter((booking) =>
                      selectedCourses.includes(
                          booking.training_program?.name || "Unknown Course"
                      )
                  )
                : filteredBookings;

        if (bookingsToExport.length === 0) {
            alert(
                "No bookings found for selected courses. Please select at least one course."
            );
            return;
        }

        // Create a more detailed report with additional statistics
        const courseSummary = {};
        const hallSummary = {};
        const trainerSummary = {};

        bookingsToExport.forEach((booking) => {
            // Course summary
            const courseName =
                booking.training_program?.name || "Unknown Course";
            if (!courseSummary[courseName]) {
                courseSummary[courseName] = {
                    totalBookings: 0,
                    totalParticipants: 0,
                    totalRevenue: 0,
                    statuses: {},
                };
            }
            courseSummary[courseName].totalBookings++;
            courseSummary[courseName].totalParticipants +=
                booking.current_participants || 0;
            courseSummary[courseName].totalRevenue +=
                (booking.price_per_participant || 0) *
                (booking.current_participants || 0);
            courseSummary[courseName].statuses[booking.status] =
                (courseSummary[courseName].statuses[booking.status] || 0) + 1;

            // Hall summary
            const hallName = booking.training_hall?.name || "Unknown Hall";
            if (!hallSummary[hallName]) {
                hallSummary[hallName] = {
                    totalBookings: 0,
                    totalParticipants: 0,
                    utilization: 0,
                };
            }
            hallSummary[hallName].totalBookings++;
            hallSummary[hallName].totalParticipants +=
                booking.current_participants || 0;
            hallSummary[hallName].utilization +=
                ((booking.current_participants || 0) /
                    (booking.max_participants || 1)) *
                100;

            // Trainer summary
            const trainerName = booking.trainer?.full_name || "Unknown Trainer";
            if (!trainerSummary[trainerName]) {
                trainerSummary[trainerName] = {
                    totalBookings: 0,
                    totalParticipants: 0,
                };
            }
            trainerSummary[trainerName].totalBookings++;
            trainerSummary[trainerName].totalParticipants +=
                booking.current_participants || 0;
        });

        // Create detailed CSV with summaries
        const summaryHeaders = [
            "Report Type",
            "Name",
            "Total Bookings",
            "Total Participants",
            "Total Revenue",
            "Utilization %",
            "Status Breakdown",
            "Details",
        ];

        const summaryData = [];

        // Course summaries
        Object.entries(courseSummary).forEach(([courseName, data]) => {
            summaryData.push([
                "Course Summary",
                courseName,
                data.totalBookings,
                data.totalParticipants,
                `$${data.totalRevenue.toFixed(2)}`,
                "N/A",
                Object.entries(data.statuses)
                    .map(([status, count]) => `${status}: ${count}`)
                    .join("; "),
                `Duration: ${
                    filteredBookings.find(
                        (b) => b.training_program?.name === courseName
                    )?.training_program?.duration || "N/A"
                } days`,
            ]);
        });

        // Hall summaries
        Object.entries(hallSummary).forEach(([hallName, data]) => {
            summaryData.push([
                "Hall Summary",
                hallName,
                data.totalBookings,
                data.totalParticipants,
                "N/A",
                `${(data.utilization / data.totalBookings).toFixed(1)}%`,
                "N/A",
                `Location: ${
                    filteredBookings.find(
                        (b) => b.training_hall?.name === hallName
                    )?.training_hall?.city || "N/A"
                }`,
            ]);
        });

        // Trainer summaries
        Object.entries(trainerSummary).forEach(([trainerName, data]) => {
            summaryData.push([
                "Trainer Summary",
                trainerName,
                data.totalBookings,
                data.totalParticipants,
                "N/A",
                "N/A",
                "N/A",
                `Position: ${
                    filteredBookings.find(
                        (b) => b.trainer?.full_name === trainerName
                    )?.trainer?.position || "N/A"
                }`,
            ]);
        });

        const csvContent = [summaryHeaders, ...summaryData]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `detailed_hall_bookings_report_${
                new Date().toISOString().split("T")[0]
            }.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📅 Hall Bookings Management
                    </h2>
                    <Link
                        href={route("hall-bookings.create")}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ➕ Create New Booking
                    </Link>
                </div>
            }
        >
            <Head title="Hall Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Export Buttons */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        📊 Export Reports
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Generate comprehensive reports combining
                                        course, hall, and booking information
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={exportReport}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        📥 Export Basic CSV
                                    </button>
                                    <button
                                        onClick={exportDetailedReport}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        📊 Export Detailed Report
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedCourses.length === 0) {
                                                alert(
                                                    "Please select at least one course for the PDF report."
                                                );
                                                return;
                                            }
                                            const courseParams = selectedCourses
                                                .map(
                                                    (course) =>
                                                        `courses[]=${encodeURIComponent(
                                                            course
                                                        )}`
                                                )
                                                .join("&");
                                            window.location.href = `${route(
                                                "hall-bookings.pdf-report"
                                            )}?${courseParams}`;
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        📄 Generate PDF Report
                                    </button>
                                </div>
                            </div>

                            {/* Course Selection for Grouping */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                            🎯 Course Selection for Export
                                        </h4>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    setSelectedCourses(
                                                        uniquePrograms
                                                    )
                                                }
                                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setSelectedCourses([])
                                                }
                                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Select specific courses to include in
                                        your exports. Leave all selected for
                                        complete reports.
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {uniquePrograms.map((program) => (
                                            <label
                                                key={program}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCourses.includes(
                                                        program
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCourses([
                                                                ...selectedCourses,
                                                                program,
                                                            ]);
                                                        } else {
                                                            setSelectedCourses(
                                                                selectedCourses.filter(
                                                                    (c) =>
                                                                        c !==
                                                                        program
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {program}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {selectedCourses.length === 0
                                            ? "⚠️ No courses selected - exports will be empty"
                                            : selectedCourses.length ===
                                              uniquePrograms.length
                                            ? "✅ All courses selected for export"
                                            : `📋 ${selectedCourses.length} of ${uniquePrograms.length} courses selected for export`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="space-y-6 mb-8">
                        {/* Global Statistics */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                🌍 Global Statistics (All Courses)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">📊</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Total Bookings
                                                </div>
                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {stats.total_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">📅</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Scheduled
                                                </div>
                                                <div className="text-2xl font-semibold text-blue-600">
                                                    {stats.scheduled_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">🔄</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    In Progress
                                                </div>
                                                <div className="text-2xl font-semibold text-yellow-600">
                                                    {stats.in_progress_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">✅</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Completed
                                                </div>
                                                <div className="text-2xl font-semibold text-green-600">
                                                    {stats.completed_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filtered Statistics */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                🎯 Selected Courses Statistics
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                    ({selectedCourses.length === uniquePrograms.length ? 'All Courses' : `${selectedCourses.length} of ${uniquePrograms.length} courses selected`})
                                </span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-purple-200 dark:border-purple-700">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">📊</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                                    Total Bookings
                                                </div>
                                                <div className="text-2xl font-semibold text-purple-600">
                                                    {filteredStats.total_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-purple-200 dark:border-purple-700">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">📅</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                                    Scheduled
                                                </div>
                                                <div className="text-2xl font-semibold text-blue-600">
                                                    {filteredStats.scheduled_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-purple-200 dark:border-purple-700">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">🔄</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-purple-600 dark:text-gray-400">
                                                    In Progress
                                                </div>
                                                <div className="text-2xl font-semibold text-yellow-600">
                                                    {filteredStats.in_progress_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-purple-200 dark:border-purple-700">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-3xl">✅</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                                    Completed
                                                </div>
                                                <div className="text-2xl font-semibold text-green-600">
                                                    {filteredStats.completed_bookings}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
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
                                        placeholder="Search by course, hall, trainer, or reference..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        📊 Status
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                    >
                                        <option value="all">
                                            All Statuses
                                        </option>
                                        <option value="scheduled">
                                            📅 Scheduled
                                        </option>
                                        <option value="in_progress">
                                            🔄 In Progress
                                        </option>
                                        <option value="completed">
                                            ✅ Completed
                                        </option>
                                        <option value="cancelled">
                                            ❌ Cancelled
                                        </option>
                                    </select>
                                </div>

                                {/* Hall Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🏢 Hall
                                    </label>
                                    <select
                                        value={hallFilter}
                                        onChange={(e) =>
                                            setHallFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                    >
                                        <option value="all">All Halls</option>
                                        {uniqueHalls.map((hall) => (
                                            <option key={hall} value={hall}>
                                                {hall}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Program Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        📚 Course
                                    </label>
                                    <select
                                        value={programFilter}
                                        onChange={(e) =>
                                            setProgramFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                                    >
                                        <option value="all">All Courses</option>
                                        {uniquePrograms.map((program) => (
                                            <option
                                                key={program}
                                                value={program}
                                            >
                                                {program}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                📋 Training Sessions ({filteredBookings.length}{" "}
                                bookings)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            📚 Course & Hall
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            👨‍🏫 Trainer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            📅 Schedule
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            ⏰ Time Slots
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            👥 Participants
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            📊 Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            🔍 Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredBookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        📚{" "}
                                                        {booking
                                                            .training_program
                                                            ?.name || "N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        🏢{" "}
                                                        {booking.training_hall
                                                            ?.name || "N/A"}
                                                    </div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                                        🔑{" "}
                                                        {
                                                            booking.booking_reference
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    👨‍🏫{" "}
                                                    {booking.trainer
                                                        ?.full_name || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        📅{" "}
                                                        {formatDate(
                                                            booking.start_date
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDate(
                                                            booking.end_date
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        📋{" "}
                                                        {formatSessionDates(
                                                            booking.session_dates
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    ⏰{" "}
                                                    {formatTime(
                                                        booking.start_time
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        booking.end_time
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    👥{" "}
                                                    {booking.current_participants ||
                                                        0}{" "}
                                                    / {booking.max_participants}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
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
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        booking.status
                                                    )}{" "}
                                                    {booking.status.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route(
                                                            "hall-bookings.show",
                                                            booking.id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        👁️ View
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "hall-bookings.edit",
                                                            booking.id
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No bookings found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your search criteria or create a
                                new booking.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
