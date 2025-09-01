import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function LogisticsReports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generatedReportId, setGeneratedReportId] = useState(null);
    const [generationCompleted, setGenerationCompleted] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [actionData, setActionData] = useState(null);

    // Mock data for demonstration - in real app this would come from props
    const reports = [
        {
            id: 1,
            title: "Transportation Usage Report",
            type: "transport",
            period: "January 2024",
            status: "completed",
            generated_date: "2024-01-31",
            summary:
                "Total bookings: 45, Revenue: $12,450, Most used route: Dubai Mall to Business Bay",
        },
        {
            id: 2,
            title: "Course Logistics Summary",
            type: "courses",
            period: "Q4 2023",
            status: "completed",
            generated_date: "2024-01-15",
            summary:
                "15 courses completed, 89% on-time delivery, Average cost per course: $850",
        },
        {
            id: 3,
            title: "Vehicle Fleet Analysis",
            type: "transport",
            period: "December 2023",
            status: "completed",
            generated_date: "2024-01-01",
            summary:
                "Fleet utilization: 78%, Maintenance costs: $2,300, Fuel efficiency: 12.5 km/l",
        },
        {
            id: 4,
            title: "Cost Analysis Report",
            type: "financial",
            period: "2023 Annual",
            status: "in_progress",
            generated_date: "2024-01-20",
            summary:
                "Annual logistics spend: $89,200, Cost per booking: $156, Savings vs budget: 12%",
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            completed:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            in_progress:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            pending:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        };
        return (
            badges[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    const getTypeIcon = (type) => {
        const icons = {
            transport: "🚌",
            courses: "📚",
            financial: "💰",
            maintenance: "🔧",
            performance: "📊",
        };
        return icons[type] || "📋";
    };

    const getTypeLabel = (type) => {
        const labels = {
            transport: "Transportation",
            courses: "Course Logistics",
            financial: "Financial",
            maintenance: "Maintenance",
            performance: "Performance",
        };
        return labels[type] || "General";
    };

    // Action handlers
    const handleView = (report) => {
        setSelectedReport(report);
        setShowViewModal(true);
    };

    const handleDownload = (report) => {
        // In a real app, this would generate and download the report
        alert(
            `Downloading ${report.title}...\n\nThis would generate a PDF/Excel file for:\n- ${report.type} report\n- Period: ${report.period}\n- Generated: ${report.generated_date}`
        );
    };

    const handleEmail = (report) => {
        // In a real app, this would open an email composition window
        alert(
            `Emailing ${report.title}...\n\nThis would open an email client with:\n- Subject: ${report.title}\n- Body: ${report.summary}\n- Attachment: ${report.title}.pdf`
        );
    };

    const handleTemplateClick = (templateType) => {
        const templateNames = {
            monthly_summary: "Monthly Summary",
            kpi_dashboard: "KPI Dashboard",
            trend_analysis: "Trend Analysis",
            cost_analysis: "Cost Analysis",
            fleet_report: "Fleet Report",
            course_logistics: "Course Logistics",
        };

        const templateName = templateNames[templateType];
        setSelectedTemplate({ type: templateType, name: templateName });
        setShowTemplateModal(true);
    };

    const handleGenerateReport = async () => {
        if (!selectedTemplate) return;

        setIsGenerating(true);
        setGenerationProgress(0);
        setGenerationCompleted(false);

        // Generate a stable report ID
        const reportId = `RPT-${Date.now().toString().slice(-6)}`;
        setGeneratedReportId(reportId);

        // Simulate report generation process
        const steps = [
            "Collecting data...",
            "Analyzing metrics...",
            "Generating charts...",
            "Compiling report...",
            "Finalizing...",
        ];

        for (let i = 0; i < steps.length; i++) {
            setGenerationProgress((i + 1) * 20);
            await new Promise((resolve) => setTimeout(resolve, 800));
        }

        // Set completion state
        setIsGenerating(false);
        setGenerationProgress(100);
        setGenerationCompleted(true);
    };

    const handleViewReport = () => {
        setActionType("view");
        setActionData({
            title: selectedTemplate.name,
            reportId: generatedReportId,
            generated: new Date().toLocaleString(),
            format: "Interactive Web Dashboard",
            size: "2.4 MB",
            features: [
                "Real-time data visualization",
                "Interactive charts and graphs",
                "Filterable data tables",
                "Export capabilities",
                "Responsive design",
            ],
        });
        setShowActionModal(true);
    };

    const handleDownloadReport = () => {
        setActionType("download");
        setActionData({
            title: selectedTemplate.name,
            reportId: generatedReportId,
            generated: new Date().toLocaleString(),
            format: "PDF",
            size: "2.4 MB",
            filename: `${selectedTemplate.name.replace(/\s+/g, "_")}_${
                new Date().toISOString().split("T")[0]
            }.pdf`,
            options: [
                "High-quality PDF format",
                "Print-ready layout",
                "Bookmarks and navigation",
                "Searchable text",
                "Professional styling",
            ],
        });
        setShowActionModal(true);
    };

    const handleEmailReport = () => {
        setActionType("email");
        setActionData({
            title: selectedTemplate.name,
            reportId: generatedReportId,
            generated: new Date().toLocaleString(),
            format: "PDF",
            size: "2.4 MB",
            subject: `${
                selectedTemplate.name
            } Report - ${new Date().toLocaleDateString()}`,
            recipients: ["team@company.com", "manager@company.com"],
            message: `Please find attached the ${
                selectedTemplate.name
            } report generated on ${new Date().toLocaleDateString()}. This report contains comprehensive analysis and insights for your review.`,
        });
        setShowActionModal(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    📊 Logistics Reports
                </h2>
            }
        >
            <Head title="Logistics Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Logistics Reports & Analytics
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Generate and view comprehensive reports on
                                    transportation, courses, and logistics
                                    performance.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("logistics.index")}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Logistics
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Report Generation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href={route("logistics.reports.transport")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-3xl">🚌</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Transportation Report
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Vehicle usage, routes, and efficiency
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("logistics.reports.courses")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-3xl">📚</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Course Logistics Report
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Course delivery and logistics
                                        performance
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-3xl">💰</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Financial Report
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Cost analysis and budget tracking
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Reports
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {reports.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {
                                            reports.filter(
                                                (r) => r.status === "completed"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <span className="text-2xl">⏳</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        In Progress
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {
                                            reports.filter(
                                                (r) =>
                                                    r.status === "in_progress"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        This Month
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {
                                            reports.filter(
                                                (r) =>
                                                    new Date(
                                                        r.generated_date
                                                    ).getMonth() ===
                                                    new Date().getMonth()
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Recent Reports
                            </h3>
                        </div>

                        {reports.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Report
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Period
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Generated
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {reports.map((report) => (
                                            <tr
                                                key={report.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <span className="text-2xl">
                                                                {getTypeIcon(
                                                                    report.type
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {report.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                {report.summary}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {getTypeLabel(
                                                            report.type
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {report.period}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                                            report.status
                                                        )}`}
                                                    >
                                                        {report.status
                                                            .replace("_", " ")
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            report.status
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )
                                                                .slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {new Date(
                                                            report.generated_date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    report
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
                                                        >
                                                            👁️ View
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActionType(
                                                                    "download"
                                                                );
                                                                setActionData({
                                                                    title: report.title,
                                                                    reportId:
                                                                        String(
                                                                            report.id ||
                                                                                `RPT-${Date.now()
                                                                                    .toString()
                                                                                    .slice(
                                                                                        -6
                                                                                    )}`
                                                                        ),
                                                                    generated:
                                                                        report.generated_date ||
                                                                        new Date().toLocaleString(),
                                                                    format: "PDF",
                                                                    size: "2.4 MB",
                                                                    filename: `${report.title.replace(
                                                                        /\s+/g,
                                                                        "_"
                                                                    )}_${
                                                                        new Date()
                                                                            .toISOString()
                                                                            .split(
                                                                                "T"
                                                                            )[0]
                                                                    }.pdf`,
                                                                    options: [
                                                                        "High-quality PDF format",
                                                                        "Print-ready layout",
                                                                        "Bookmarks and navigation",
                                                                        "Searchable text",
                                                                        "Professional styling",
                                                                    ],
                                                                });
                                                                setShowActionModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:underline cursor-pointer"
                                                        >
                                                            📥 Download
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActionType(
                                                                    "email"
                                                                );
                                                                setActionData({
                                                                    title: report.title,
                                                                    reportId:
                                                                        String(
                                                                            report.id ||
                                                                                `RPT-${Date.now()
                                                                                    .toString()
                                                                                    .slice(
                                                                                        -6
                                                                                    )}`
                                                                        ),
                                                                    generated:
                                                                        report.generated_date ||
                                                                        new Date().toLocaleString(),
                                                                    format: "PDF",
                                                                    size: "2.4 MB",
                                                                    subject: `${
                                                                        report.title
                                                                    } Report - ${new Date().toLocaleDateString()}`,
                                                                    recipients:
                                                                        [
                                                                            "team@company.com",
                                                                            "manager@company.com",
                                                                        ],
                                                                    message: `Please find attached the ${
                                                                        report.title
                                                                    } report generated on ${new Date().toLocaleDateString()}. This report contains comprehensive analysis and insights for your review.`,
                                                                });
                                                                setShowActionModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 hover:underline cursor-pointer"
                                                        >
                                                            📧 Email
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No Reports Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Generated reports will appear here. Use the
                                    quick report buttons above to create new
                                    reports.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Report Templates */}
                    <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Report Templates
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button
                                    onClick={() =>
                                        handleTemplateClick("monthly_summary")
                                    }
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-left w-full transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">📈</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Monthly Summary
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Overview of monthly logistics
                                                performance
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        handleTemplateClick("kpi_dashboard")
                                    }
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-left w-full transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">🎯</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                KPI Dashboard
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Key performance indicators and
                                                metrics
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        handleTemplateClick("trend_analysis")
                                    }
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-left w-full transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">📊</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Trend Analysis
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Historical data and trend
                                                patterns
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        handleTemplateClick("cost_analysis")
                                    }
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-left w-full transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">💰</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Cost Analysis
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Detailed cost breakdown and
                                                analysis
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        handleTemplateClick("fleet_report")
                                    }
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-left w-full transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">🚌</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Fleet Report
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Vehicle utilization and
                                                maintenance
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() =>
                                        handleTemplateClick("course_logistics")
                                    }
                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-left w-full transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">📚</span>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Course Logistics
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Course delivery performance
                                                metrics
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Report Modal */}
            {showViewModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                📊 {selectedReport.title}
                            </h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Report Type:
                                    </span>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {getTypeLabel(selectedReport.type)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Period:
                                    </span>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {selectedReport.period}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status:
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                            selectedReport.status
                                        )}`}
                                    >
                                        {selectedReport.status
                                            .replace("_", " ")
                                            .charAt(0)
                                            .toUpperCase() +
                                            selectedReport.status
                                                .replace("_", " ")
                                                .slice(1)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Generated:
                                    </span>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {new Date(
                                            selectedReport.generated_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Summary:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100 mt-1">
                                    {selectedReport.summary}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => handleDownload(selectedReport)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                📥 Download Report
                            </button>
                            <button
                                onClick={() => handleEmail(selectedReport)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                📧 Email Report
                            </button>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Template Generation Modal */}
            {showTemplateModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                📊 Generate {selectedTemplate.name} Report
                            </h3>
                            <button
                                onClick={() => {
                                    setShowTemplateModal(false);
                                    setSelectedTemplate(null);
                                    setIsGenerating(false);
                                    setGenerationProgress(0);
                                    setGenerationCompleted(false);
                                    setGeneratedReportId(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        {!isGenerating && !generationCompleted ? (
                            <div className="space-y-6">
                                {/* Report Configuration */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Report Configuration
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Date Range
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                                                <option>Last 30 Days</option>
                                                <option>Last Quarter</option>
                                                <option>Last Year</option>
                                                <option>Custom Range</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Format
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                                                <option>PDF</option>
                                                <option>Excel</option>
                                                <option>PowerPoint</option>
                                                <option>Web Dashboard</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Preview */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        What This Report Will Include
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        {selectedTemplate.type ===
                                            "monthly_summary" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    <span>
                                                        Monthly performance
                                                        metrics
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    <span>
                                                        Revenue and cost
                                                        analysis
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    <span>
                                                        Key achievements and
                                                        challenges
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {selectedTemplate.type ===
                                            "kpi_dashboard" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    <span>
                                                        Real-time KPI monitoring
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    <span>
                                                        Performance benchmarks
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    <span>
                                                        Trend analysis and
                                                        forecasting
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {selectedTemplate.type ===
                                            "trend_analysis" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    <span>
                                                        Historical data patterns
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    <span>
                                                        Seasonal trends
                                                        identification
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    <span>
                                                        Predictive analytics
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {selectedTemplate.type ===
                                            "cost_analysis" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                    <span>
                                                        Detailed cost breakdown
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                    <span>
                                                        Budget vs. actual
                                                        comparison
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                    <span>
                                                        Cost optimization
                                                        recommendations
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {selectedTemplate.type ===
                                            "fleet_report" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    <span>
                                                        Vehicle utilization
                                                        metrics
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    <span>
                                                        Maintenance schedules
                                                        and costs
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    <span>
                                                        Fuel efficiency analysis
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {selectedTemplate.type ===
                                            "course_logistics" && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                    <span>
                                                        Course delivery
                                                        performance
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                    <span>
                                                        Participant satisfaction
                                                        metrics
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                    <span>
                                                        Resource allocation
                                                        analysis
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowTemplateModal(false);
                                            setSelectedTemplate(null);
                                            setIsGenerating(false);
                                            setGenerationProgress(0);
                                            setGenerationCompleted(false);
                                            setGeneratedReportId(null);
                                        }}
                                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerateReport}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                    >
                                        <span>🚀</span>
                                        <span>Generate Report</span>
                                    </button>
                                </div>
                            </div>
                        ) : isGenerating ? (
                            <div className="space-y-6">
                                {/* Progress Bar */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Generating Report...</span>
                                        <span>{generationProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${generationProgress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Generation Steps */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Current Step
                                    </h4>
                                    <div className="space-y-2">
                                        {generationProgress >= 20 && (
                                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                <span>✅</span>
                                                <span>Collecting data</span>
                                            </div>
                                        )}
                                        {generationProgress >= 40 && (
                                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                <span>✅</span>
                                                <span>Analyzing metrics</span>
                                            </div>
                                        )}
                                        {generationProgress >= 60 && (
                                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                <span>✅</span>
                                                <span>Generating charts</span>
                                            </div>
                                        )}
                                        {generationProgress >= 80 && (
                                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                <span>✅</span>
                                                <span>Compiling report</span>
                                            </div>
                                        )}
                                        {generationProgress >= 100 && (
                                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                                <span>✅</span>
                                                <span>Finalizing</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            generationCompleted && (
                                <div className="space-y-6">
                                    {/* Completion Actions */}
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <span className="text-2xl">🎉</span>
                                            <h4 className="font-medium text-green-800 dark:text-green-200">
                                                Report Generated Successfully!
                                            </h4>
                                        </div>
                                        <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                                            Your {selectedTemplate.name} report
                                            is ready. You can now view,
                                            download, or share it.
                                        </p>

                                        {/* Report Actions */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                            <button
                                                onClick={handleViewReport}
                                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <span>👁️</span>
                                                <span>View Report</span>
                                            </button>
                                            <button
                                                onClick={handleDownloadReport}
                                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <span>📥</span>
                                                <span>Download PDF</span>
                                            </button>
                                            <button
                                                onClick={handleEmailReport}
                                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                <span>📧</span>
                                                <span>Email Report</span>
                                            </button>
                                        </div>

                                        {/* Report Details */}
                                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Report ID:
                                                    </span>
                                                    <span className="ml-2 text-gray-900 dark:text-gray-100 font-mono">
                                                        {generatedReportId}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Generated:
                                                    </span>
                                                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                                                        {new Date().toLocaleString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Format:
                                                    </span>
                                                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                                                        PDF
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Size:
                                                    </span>
                                                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                                                        2.4 MB
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => {
                                                    setShowTemplateModal(false);
                                                    setSelectedTemplate(null);
                                                    setIsGenerating(false);
                                                    setGenerationProgress(0);
                                                    setGenerationCompleted(
                                                        false
                                                    );
                                                    setGeneratedReportId(null);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {showActionModal && actionData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {actionType === "view" && "👁️ View Report"}
                                {actionType === "download" &&
                                    "📥 Download Report"}
                                {actionType === "email" && "📧 Email Report"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowActionModal(false);
                                    setActionType(null);
                                    setActionData(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        {actionType === "view" && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                                        Interactive Web Dashboard
                                    </h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                        Your report will open in a new browser
                                        tab with full interactive capabilities.
                                    </p>
                                    <div className="space-y-2">
                                        {actionData.features.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300"
                                                >
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    <span>{feature}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Report ID:
                                        </span>
                                        <p className="text-gray-900 dark:text-gray-100 font-mono">
                                            {actionData.reportId}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Generated:
                                        </span>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {actionData.generated}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Format:
                                        </span>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {actionData.format}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Size:
                                        </span>
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {actionData.size}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowActionModal(false);
                                            setActionType(null);
                                            setActionData(null);
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Simulate opening report in new tab
                                            const newWindow = window.open(
                                                "",
                                                "_blank"
                                            );
                                            if (newWindow) {
                                                newWindow.document.write(`
                                                    <!DOCTYPE html>
                                                    <html>
                                                    <head>
                                                        <title>${actionData.title} - Interactive Dashboard</title>
                                                        <style>
                                                            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                                                            .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                                            .dashboard { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                                            .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #007bff; }
                                                            .chart-placeholder { background: #e9ecef; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: #6c757d; }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <div class="header">
                                                            <h1>📊 ${actionData.title}</h1>
                                                            <p><strong>Report ID:</strong> ${actionData.reportId} | <strong>Generated:</strong> ${actionData.generated}</p>
                                                        </div>
                                                        <div class="dashboard">
                                                            <h2>Key Performance Metrics</h2>
                                                            <div class="metric">
                                                                <h3>📈 Overall Performance</h3>
                                                                <p>Current performance score: <strong>87%</strong></p>
                                                            </div>
                                                            <div class="metric">
                                                                <h3>🎯 Target Achievement</h3>
                                                                <p>Target completion: <strong>92%</strong></p>
                                                            </div>
                                                            <div class="metric">
                                                                <h3>📊 Data Quality</h3>
                                                                <p>Data accuracy: <strong>94%</strong></p>
                                                            </div>
                                                            <h2>Interactive Charts</h2>
                                                            <div class="chart-placeholder">
                                                                📊 Interactive Chart Area<br>
                                                                <small>Hover over data points, zoom, and filter</small>
                                                            </div>
                                                            <div class="chart-placeholder">
                                                                📈 Trend Analysis<br>
                                                                <small>Real-time trend visualization</small>
                                                            </div>
                                                        </div>
                                                    </body>
                                                    </html>
                                                `);
                                                newWindow.document.close();
                                            }
                                            setShowActionModal(false);
                                            setActionType(null);
                                            setActionData(null);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        🚀 Open Report
                                    </button>
                                </div>
                            </div>
                        )}

                        {actionType === "download" && (
                            <div className="space-y-6">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                                        Download Options
                                    </h4>
                                    <div className="space-y-2">
                                        {actionData.options.map(
                                            (option, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300"
                                                >
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    <span>{option}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        File Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Filename:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100 font-mono text-xs break-all">
                                                {actionData.filename}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Format:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {actionData.format}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Size:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {actionData.size}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Report ID:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100 font-mono">
                                                {actionData.reportId}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowActionModal(false);
                                            setActionType(null);
                                            setActionData(null);
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Simulate PDF download
                                            const link =
                                                document.createElement("a");
                                            const content = `
                                                %PDF-1.4
                                                1 0 obj
                                                <<
                                                /Type /Catalog
                                                /Pages 2 0 R
                                                >>
                                                endobj
                                                
                                                2 0 obj
                                                <<
                                                /Type /Pages
                                                /Kids [3 0 R]
                                                /Count 1
                                                >>
                                                endobj
                                                
                                                3 0 obj
                                                <<
                                                /Type /Page
                                                /Parent 2 0 R
                                                /MediaBox [0 0 612 792]
                                                /Contents 4 0 R
                                                >>
                                                endobj
                                                
                                                4 0 obj
                                                <<
                                                /Length 100
                                                >>
                                                stream
                                                BT
                                                /F1 12 Tf
                                                72 720 Td
                                                (${actionData.title} Report) Tj
                                                0 -20 Td
                                                (Generated: ${actionData.generated}) Tj
                                                0 -20 Td
                                                (Report ID: ${actionData.reportId}) Tj
                                                ET
                                                endstream
                                                endobj
                                                
                                                xref
                                                0 5
                                                0000000000 65535 f
                                                0000000009 00000 n
                                                0000000058 00000 n
                                                0000000115 00000 n
                                                0000000204 00000 n
                                                trailer
                                                <<
                                                /Size 5
                                                /Root 1 0 R
                                                >>
                                                startxref
                                                364
                                                %%EOF
                                            `;
                                            const blob = new Blob([content], {
                                                type: "application/pdf",
                                            });
                                            const url =
                                                URL.createObjectURL(blob);
                                            link.href = url;
                                            link.download = actionData.filename;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);

                                            // Show success message
                                            const successDiv =
                                                document.createElement("div");
                                            successDiv.innerHTML = `
                                                <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 16px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; max-width: 300px;">
                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                        <span style="font-size: 20px;">✅</span>
                                                        <div>
                                                            <div style="font-weight: 600;">Download Started!</div>
                                                            <div style="font-size: 14px; opacity: 0.9;">${actionData.filename}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                            document.body.appendChild(
                                                successDiv
                                            );
                                            setTimeout(() => {
                                                document.body.removeChild(
                                                    successDiv
                                                );
                                            }, 4000);

                                            setShowActionModal(false);
                                            setActionType(null);
                                            setActionData(null);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        📥 Download Now
                                    </button>
                                </div>
                            </div>
                        )}

                        {actionType === "email" && (
                            <div className="space-y-6">
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-3">
                                        Email Configuration
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                                                Subject:
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue={
                                                    actionData.subject
                                                }
                                                onChange={(e) => {
                                                    const newData = {
                                                        ...actionData,
                                                    };
                                                    newData.subject =
                                                        e.target.value;
                                                    setActionData(newData);
                                                }}
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                                                Recipients:
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue={actionData.recipients.join(
                                                    ", "
                                                )}
                                                onChange={(e) => {
                                                    const newData = {
                                                        ...actionData,
                                                    };
                                                    newData.recipients =
                                                        e.target.value
                                                            .split(",")
                                                            .map((email) =>
                                                                email.trim()
                                                            );
                                                    setActionData(newData);
                                                }}
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                                                Message:
                                            </label>
                                            <textarea
                                                defaultValue={
                                                    actionData.message
                                                }
                                                onChange={(e) => {
                                                    const newData = {
                                                        ...actionData,
                                                    };
                                                    newData.message =
                                                        e.target.value;
                                                    setActionData(newData);
                                                }}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Attachment Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Report:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {actionData.title}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Format:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {actionData.format}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Size:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {actionData.size}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Report ID:
                                            </span>
                                            <p className="text-gray-900 dark:text-gray-100 font-mono">
                                                {actionData.reportId}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowActionModal(false);
                                            setActionType(null);
                                            setActionData(null);
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                // Show loading state
                                                const button = event.target;
                                                const originalText =
                                                    button.textContent;
                                                button.textContent =
                                                    "📤 Sending...";
                                                button.disabled = true;

                                                // Prepare email data
                                                const emailData = {
                                                    subject: actionData.subject,
                                                    recipients:
                                                        actionData.recipients,
                                                    message: actionData.message,
                                                    reportTitle:
                                                        actionData.title,
                                                    reportFormat:
                                                        actionData.format,
                                                    reportSize: actionData.size,
                                                    reportId:
                                                        actionData.reportId,
                                                };

                                                // Get fresh CSRF token first
                                                await fetch(
                                                    "/sanctum/csrf-cookie",
                                                    {
                                                        method: "GET",
                                                        credentials: "include",
                                                    }
                                                );

                                                // Send real email via API
                                                const response = await fetch(
                                                    "/send-report-email",
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        credentials: "include",
                                                        body: JSON.stringify(
                                                            emailData
                                                        ),
                                                    }
                                                );

                                                const result =
                                                    await response.json();

                                                if (result.success) {
                                                    // Show success message
                                                    alert(
                                                        `✅ ${
                                                            result.message
                                                        }\n\nRecipients: ${result.recipients.join(
                                                            ", "
                                                        )}`
                                                    );

                                                    // Close modal
                                                    setShowActionModal(false);
                                                    setActionType(null);
                                                    setActionData(null);
                                                } else {
                                                    throw new Error(
                                                        result.message
                                                    );
                                                }
                                            } catch (error) {
                                                console.error(
                                                    "Email sending failed:",
                                                    error
                                                );
                                                alert(
                                                    `❌ Failed to send email: ${error.message}`
                                                );
                                            } finally {
                                                // Reset button state
                                                const button = event.target;
                                                button.textContent =
                                                    "📤 Send Email";
                                                button.disabled = false;
                                            }
                                        }}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        📧 Send Email
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
