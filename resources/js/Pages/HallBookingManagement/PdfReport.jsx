import React, { useEffect, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

export default function PdfReport({
    auth,
    bookings,
    stats,
    chartData,
    metadata,
}) {
    // Debug logging
    console.log("PdfReport props received:", {
        bookingsCount: bookings?.length || 0,
        stats: stats,
        chartDataKeys: chartData ? Object.keys(chartData) : "No chartData",
        metadata: metadata,
    });

    // Additional debugging for chartData
    if (chartData) {
        console.log("ChartData details:", {
            courseLabels: chartData.courseLabels,
            courseValues: chartData.courseValues,
            courseLabelsType: typeof chartData.courseLabels,
            courseValuesType: typeof chartData.courseValues,
            courseLabelsLength: chartData.courseLabels?.length,
            courseValuesLength: chartData.courseValues?.length,
            courseLabelsIsArray: Array.isArray(chartData.courseLabels),
            courseValuesIsArray: Array.isArray(chartData.courseValues),
        });

        // More detailed logging
        console.log("Full chartData object:", chartData);
        console.log("courseLabels content:", chartData.courseLabels);
        console.log("courseValues content:", chartData.courseValues);
        console.log("hallLabels content:", chartData.hallLabels);
        console.log("hallValues content:", chartData.hallValues);

        // Check if arrays are actually empty
        if (chartData.courseLabels && chartData.courseLabels.length > 0) {
            console.log("First course label:", chartData.courseLabels[0]);
            console.log("First course value:", chartData.courseValues[0]);
        } else {
            console.log("courseLabels array is empty or undefined");
        }
    } else {
        console.log("chartData is null or undefined");
    }
    const chartRefs = {
        courseChart: useRef(null),
        hallChart: useRef(null),
        monthlyChart: useRef(null),
        statusChart: useRef(null),
    };

    useEffect(() => {
        // Dynamically import Chart.js only when needed
        const loadCharts = async () => {
            try {
                console.log("Loading Chart.js...");
                const { default: Chart } = await import("chart.js/auto");
                window.Chart = Chart;
                console.log(
                    "Chart.js loaded successfully, initializing charts..."
                );

                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    initializeCharts();
                }, 100);
            } catch (error) {
                console.error("Failed to load Chart.js:", error);
            }
        };

        if (typeof window !== "undefined") {
            loadCharts();
        }

        // Cleanup function to destroy charts when component unmounts
        return () => {
            Object.values(chartRefs).forEach((ref) => {
                if (ref.current && ref.current.chart) {
                    ref.current.chart.destroy();
                }
            });
        };
    }, [chartData]);

    // Function to force high-resolution chart rendering for PDF
    const forceHighResolutionCharts = () => {
        Object.values(chartRefs).forEach((ref) => {
            if (ref.current && ref.current.chart) {
                const chart = ref.current.chart;
                const canvas = ref.current;

                // Force high DPI rendering
                const ctx = canvas.getContext("2d");
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();

                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = rect.width + "px";
                canvas.style.height = rect.height + "px";

                // Re-render chart
                chart.resize();
                chart.render();
            }
        });
    };

    const initializeCharts = () => {
        try {
            console.log("Initializing charts with data:", chartData);

            // Validate chart data before creating charts
            if (
                !chartData ||
                !chartData.courseLabels ||
                !chartData.courseValues
            ) {
                console.warn(
                    "Chart data is incomplete, skipping chart initialization"
                );
                console.log("Chart data validation failed:", {
                    hasChartData: !!chartData,
                    hasCourseLabels: !!chartData?.courseLabels,
                    hasCourseValues: !!chartData?.courseValues,
                    chartDataKeys: chartData
                        ? Object.keys(chartData)
                        : "No chartData",
                });
                return;
            }

            // Clone arrays to prevent Chart.js from corrupting the original data
            const courseLabels = [...chartData.courseLabels];
            const courseValues = [...chartData.courseValues];
            const hallLabels = [...chartData.hallLabels];
            const hallValues = [...chartData.hallValues];
            const monthlyLabels = [...chartData.monthlyLabels];
            const monthlyValues = [...chartData.monthlyValues];
            const statusLabels = [...chartData.statusLabels];
            const statusValues = [...chartData.statusValues];
            const trainerLabels = [...chartData.trainerLabels];
            const trainerValues = [...chartData.trainerValues];

            console.log("Cloned arrays for charts:", {
                courseLabels: courseLabels,
                courseValues: courseValues,
                hallLabels: hallLabels,
                hallValues: hallValues,
            });

            console.log("Starting chart creation...");
            console.log("Course chart ref:", chartRefs.courseChart.current);
            console.log("Hall chart ref:", chartRefs.hallChart.current);
            console.log("Monthly chart ref:", chartRefs.monthlyChart.current);
            console.log("Status chart ref:", chartRefs.statusChart.current);

            // Destroy existing charts to prevent conflicts
            Object.values(chartRefs).forEach((ref) => {
                if (ref.current && ref.current.chart) {
                    ref.current.chart.destroy();
                }
            });

            // Course Distribution Chart
            console.log("Creating course chart...");
            if (
                chartRefs.courseChart.current &&
                courseLabels.length > 0 &&
                courseValues.length > 0
            ) {
                const courseChart = new window.Chart(
                    chartRefs.courseChart.current,
                    {
                        type: "doughnut",
                        data: {
                            labels: courseLabels,
                            datasets: [
                                {
                                    data: courseValues,
                                    backgroundColor: [
                                        "#3B82F6",
                                        "#10B981",
                                        "#F59E0B",
                                        "#EF4444",
                                        "#8B5CF6",
                                        "#06B6D4",
                                        "#84CC16",
                                        "#F97316",
                                        "#EC4899",
                                        "#14B8A6",
                                    ],
                                    borderWidth: 2,
                                    borderColor: "#ffffff",
                                    hoverBorderWidth: 3,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            devicePixelRatio: 2,
                            onResize: (chart, size) => {
                                chart.canvas.style.width = size.width + "px";
                                chart.canvas.style.height = size.height + "px";
                            },
                            plugins: {
                                legend: {
                                    position: "bottom",
                                    labels: {
                                        padding: 20,
                                        usePointStyle: true,
                                        font: { size: 14, weight: "bold" },
                                    },
                                },
                                title: {
                                    display: true,
                                    text: "Course Distribution",
                                    font: { size: 18, weight: "bold" },
                                    color: "#374151",
                                },
                                tooltip: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    titleColor: "#ffffff",
                                    bodyColor: "#ffffff",
                                    borderColor: "#ffffff",
                                    borderWidth: 1,
                                },
                            },
                            animation: {
                                duration: 1000,
                                easing: "easeInOutQuart",
                            },
                        },
                    }
                );

                // Store chart reference for cleanup
                chartRefs.courseChart.current.chart = courseChart;
                console.log("✅ Course chart created successfully");
            }

            // Hall Utilization Chart
            console.log("Creating hall chart...");
            if (
                chartRefs.hallChart.current &&
                hallLabels.length > 0 &&
                hallValues.length > 0
            ) {
                const hallChart = new window.Chart(
                    chartRefs.hallChart.current,
                    {
                        type: "bar",
                        data: {
                            labels: hallLabels,
                            datasets: [
                                {
                                    label: "Bookings",
                                    data: hallValues,
                                    backgroundColor: [
                                        "#10B981",
                                        "#3B82F6",
                                        "#F59E0B",
                                        "#EF4444",
                                        "#8B5CF6",
                                        "#06B6D4",
                                        "#84CC16",
                                        "#F97316",
                                    ],
                                    borderColor: "#059669",
                                    borderWidth: 2,
                                    borderRadius: 4,
                                    borderSkipped: false,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            devicePixelRatio: 2,
                            onResize: (chart, size) => {
                                chart.canvas.style.width = size.width + "px";
                                chart.canvas.style.height = size.height + "px";
                            },
                            plugins: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: "Hall Utilization",
                                    font: { size: 18, weight: "bold" },
                                    color: "#374151",
                                },
                                tooltip: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    titleColor: "#ffffff",
                                    bodyColor: "#ffffff",
                                    borderColor: "#ffffff",
                                    borderWidth: 1,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1,
                                        font: { size: 12 },
                                        color: "#6B7280",
                                    },
                                    grid: {
                                        color: "rgba(107, 114, 128, 0.2)",
                                    },
                                },
                                x: {
                                    ticks: {
                                        font: { size: 12 },
                                        color: "#6B7280",
                                    },
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                            animation: {
                                duration: 1000,
                                easing: "easeOutQuart",
                            },
                        },
                    }
                );

                // Store chart reference for cleanup
                chartRefs.hallChart.current.chart = hallChart;
                console.log("✅ Hall chart created successfully");
            }

            // Monthly Distribution Chart
            console.log("Creating monthly chart...");
            if (
                chartRefs.monthlyChart.current &&
                monthlyLabels.length > 0 &&
                monthlyValues.length > 0
            ) {
                const monthlyChart = new window.Chart(
                    chartRefs.monthlyChart.current,
                    {
                        type: "line",
                        data: {
                            labels: monthlyLabels,
                            datasets: [
                                {
                                    label: "Bookings",
                                    data: monthlyValues,
                                    borderColor: "#3B82F6",
                                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    pointBackgroundColor: "#3B82F6",
                                    pointBorderColor: "#ffffff",
                                    pointBorderWidth: 2,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            devicePixelRatio: 2,
                            onResize: (chart, size) => {
                                chart.canvas.style.width = size.width + "px";
                                chart.canvas.style.height = size.height + "px";
                            },
                            plugins: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: "Monthly Booking Trends",
                                    font: { size: 18, weight: "bold" },
                                    color: "#374151",
                                },
                                tooltip: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    titleColor: "#ffffff",
                                    bodyColor: "#ffffff",
                                    borderColor: "#ffffff",
                                    borderWidth: 1,
                                    mode: "index",
                                    intersect: false,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1,
                                        font: { size: 12 },
                                        color: "#6B7280",
                                    },
                                    grid: {
                                        color: "rgba(107, 114, 128, 0.2)",
                                    },
                                },
                                x: {
                                    ticks: {
                                        font: { size: 12 },
                                        color: "#6B7280",
                                    },
                                    grid: {
                                        color: "rgba(107, 114, 128, 0.1)",
                                    },
                                },
                            },
                            interaction: {
                                mode: "nearest",
                                axis: "x",
                                intersect: false,
                            },
                            animation: {
                                duration: 1000,
                                easing: "easeInOutQuart",
                            },
                        },
                    }
                );

                // Store chart reference for cleanup
                chartRefs.monthlyChart.current.chart = monthlyChart;
                console.log("✅ Monthly chart created successfully");
            }

            // Status Distribution Chart
            console.log("Creating status chart...");
            if (
                chartRefs.statusChart.current &&
                statusLabels.length > 0 &&
                statusValues.length > 0
            ) {
                const statusChart = new window.Chart(
                    chartRefs.statusChart.current,
                    {
                        type: "pie",
                        data: {
                            labels: statusLabels.map(
                                (label) =>
                                    label.charAt(0).toUpperCase() +
                                    label.slice(1).replace("_", " ")
                            ),
                            datasets: [
                                {
                                    data: statusValues,
                                    backgroundColor: [
                                        "#10B981", // scheduled
                                        "#F59E0B", // in_progress
                                        "#EF4444", // completed
                                        "#6B7280", // cancelled
                                        "#8B5CF6", // other statuses
                                        "#06B6D4",
                                        "#84CC16",
                                        "#F97316",
                                    ],
                                    borderWidth: 3,
                                    borderColor: "#ffffff",
                                    hoverBorderWidth: 4,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            devicePixelRatio: 2,
                            onResize: (chart, size) => {
                                chart.canvas.style.width = size.width + "px";
                                chart.canvas.style.height = size.height + "px";
                            },
                            plugins: {
                                legend: {
                                    position: "bottom",
                                    labels: {
                                        padding: 20,
                                        usePointStyle: true,
                                        font: { size: 14, weight: "bold" },
                                        color: "#374151",
                                    },
                                },
                                title: {
                                    display: true,
                                    text: "Status Distribution",
                                    font: { size: 18, weight: "bold" },
                                    color: "#374151",
                                },
                                tooltip: {
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    titleColor: "#ffffff",
                                    bodyColor: "#ffffff",
                                    borderColor: "#ffffff",
                                    borderWidth: 1,
                                    callbacks: {
                                        label: function (context) {
                                            const total =
                                                context.dataset.data.reduce(
                                                    (a, b) => a + b,
                                                    0
                                                );
                                            const percentage = (
                                                (context.parsed / total) *
                                                100
                                            ).toFixed(1);
                                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                                        },
                                    },
                                },
                            },
                            animation: {
                                duration: 1000,
                                easing: "easeInOutQuart",
                            },
                        },
                    }
                );

                // Store chart reference for cleanup
                chartRefs.statusChart.current.chart = statusChart;
                console.log("✅ Status chart created successfully");
            }

            console.log("🎉 All charts initialized successfully!");
        } catch (error) {
            console.error("Error initializing charts:", error);

            // Fallback: try to initialize charts again after a delay
            setTimeout(() => {
                console.log("Retrying chart initialization...");
                try {
                    initializeCharts();
                } catch (retryError) {
                    console.error(
                        "Chart initialization retry failed:",
                        retryError
                    );
                }
            }, 500);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (time) => {
        if (!time) return "N/A";
        return time.replace(":00", "");
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

    const exportToPdf = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    📊 Hall Bookings PDF Report
                </h2>
            }
        >
            <Head title="Hall Bookings PDF Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Report Metadata */}
                    {metadata && (
                        <Card className="mb-6 print:shadow-none">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">
                                            Generated:
                                        </span>{" "}
                                        {metadata.generated_at}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Total Records:
                                        </span>{" "}
                                        {metadata.total_records}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Date Range:
                                        </span>{" "}
                                        {metadata.date_range?.earliest
                                            ? formatDate(
                                                  metadata.date_range.earliest
                                              )
                                            : "N/A"}{" "}
                                        -{" "}
                                        {metadata.date_range?.latest
                                            ? formatDate(
                                                  metadata.date_range.latest
                                              )
                                            : "N/A"}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Courses:
                                        </span>{" "}
                                        {Array.isArray(
                                            metadata.courses_filtered
                                        )
                                            ? metadata.courses_filtered.join(
                                                  ", "
                                              )
                                            : metadata.courses_filtered}
                                    </div>
                                </div>
                                {metadata.error && (
                                    <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                                        ⚠️ {metadata.error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}



                    {/* Header Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8 print:mb-4">
                        <div className="p-8 print:p-4">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 print:text-2xl">
                                    🎓 Training Hall Bookings Report
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 print:text-base">
                                    Comprehensive analysis of training hall
                                    utilization and course management
                                </p>
                                <div className="text-sm text-gray-500 dark:text-gray-400 print:text-xs">
                                    Generated on:{" "}
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 print:grid-cols-5 print:gap-4">
                        <Card className="print:shadow-none">
                            <CardHeader className="pb-2 print:pb-1">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-xs">
                                    📊 Total Bookings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">
                                    {stats.total_bookings}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="print:shadow-none">
                            <CardHeader className="pb-2 print:pb-1">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-xs">
                                    📅 Scheduled
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600 print:text-xl">
                                    {stats.scheduled_bookings}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="print:shadow-none">
                            <CardHeader className="pb-2 print:pb-1">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-xs">
                                    ⏳ In Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600 print:text-xl">
                                    {stats.in_progress_bookings}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="print:shadow-none">
                            <CardHeader className="pb-2 print-1">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-xs">
                                    ✅ Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600 print:text-xl">
                                    {stats.completed_bookings}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="print:shadow-none">
                            <CardHeader className="pb-2 print:pb-1">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-xs">
                                    ❌ Cancelled
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600 print:text-xl">
                                    {stats.cancelled_bookings || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:grid-cols-2 print:gap-6">
                        {/* Course Distribution */}
                        <Card className="print:shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold print:text-base">
                                    📚 Course Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 print:h-48">
                                    <canvas
                                        ref={chartRefs.courseChart}
                                        className="w-full h-full"
                                    ></canvas>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hall Utilization */}
                        <Card className="print:shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold print:text-base">
                                    🏢 Hall Utilization
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 print:h-48">
                                    <canvas
                                        ref={chartRefs.hallChart}
                                        className="w-full h-full"
                                    ></canvas>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Trends */}
                        <Card className="print:shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold print:text-base">
                                    📈 Monthly Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 print:h-48">
                                    <canvas
                                        ref={chartRefs.monthlyChart}
                                        className="w-full h-full"
                                    ></canvas>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Distribution */}
                        <Card className="print:shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold print:text-base">
                                    🎯 Status Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 print:h-48">
                                    <canvas
                                        ref={chartRefs.statusChart}
                                        className="w-full h-full"
                                    ></canvas>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Bookings Table */}
                    <Card className="print:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold print:text-lg">
                                📋 Detailed Bookings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto print:overflow-visible">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800 print:bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:text-xs print:px-2 print:py-2">
                                                Course
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:text-xs print:px-2 print:py-2">
                                                Hall
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:text-xs print:px-2 print:py-2">
                                                Trainer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:text-xs print:px-2 print:py-2">
                                                Schedule
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:text-xs print:px-2 print:py-2">
                                                Participants
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider print:text-xs print:px-2 print:py-2">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 print:bg-white">
                                        {bookings.map((booking, index) => (
                                            <tr
                                                key={booking.id}
                                                className={
                                                    index % 2 === 0
                                                        ? "bg-gray-50 dark:bg-gray-800 print:bg-gray-50"
                                                        : "bg-white dark:bg-gray-900 print:bg-white"
                                                }
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white print:text-xs print:px-2 print:py-2">
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking
                                                                .training_program
                                                                ?.name || "N/A"}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400 text-xs print:text-xs">
                                                            {booking
                                                                .training_program
                                                                ?.code || "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white print:text-xs print:px-2 print:py-2">
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking
                                                                .training_hall
                                                                ?.name || "N/A"}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400 text-xs print:text-xs">
                                                            {booking
                                                                .training_hall
                                                                ?.city || "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white print:text-xs print:px-2 print:py-2">
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking.trainer
                                                                ?.full_name ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400 text-xs print:text-xs">
                                                            {booking.trainer
                                                                ?.position ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white print:text-xs print:px-2 print:py-2">
                                                    <div>
                                                        <div className="font-medium">
                                                            {formatDate(
                                                                booking.start_date
                                                            )}{" "}
                                                            -{" "}
                                                            {formatDate(
                                                                booking.end_date
                                                            )}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400 text-xs print:text-xs">
                                                            {formatTime(
                                                                booking.start_time
                                                            )}{" "}
                                                            -{" "}
                                                            {formatTime(
                                                                booking.end_time
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white print:text-xs print:px-2 print:py-2">
                                                    <div>
                                                        <div className="font-medium">
                                                            {booking.current_participants ||
                                                                0}{" "}
                                                            /{" "}
                                                            {booking.max_participants ||
                                                                0}
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1 print:h-1">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full print:h-1"
                                                                style={{
                                                                    width: `${
                                                                        ((booking.current_participants ||
                                                                            0) /
                                                                            (booking.max_participants ||
                                                                                1)) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap print:text-xs print:px-2 print:py-2">
                                                    <Badge
                                                        className={`${getStatusColor(
                                                            booking.status
                                                        )} print:text-xs`}
                                                    >
                                                        {booking.status
                                                            ?.replace("_", " ")
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            booking.status
                                                                ?.slice(1)
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                ) || "Unknown"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-8 print:hidden">
                        <Button
                            onClick={forceHighResolutionCharts}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-medium rounded-lg"
                        >
                            🎯 Optimize Charts for PDF
                        </Button>
                        <Button
                            onClick={exportToPdf}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-medium rounded-lg"
                        >
                            🖨️ Print/Export PDF
                        </Button>
                        <Button
                            onClick={() =>
                                router.visit(route("hall-bookings.index"))
                            }
                            className="px-6 py-3 text-lg font-medium rounded-lg bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
                        >
                            ← Back to Bookings
                        </Button>
                    </div>

                    {/* Print Instructions */}
                    <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
                        <p>
                            This report was generated from the PMEC Training
                            Management System
                        </p>
                        <p>
                            For questions or support, please contact the system
                            administrator
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
