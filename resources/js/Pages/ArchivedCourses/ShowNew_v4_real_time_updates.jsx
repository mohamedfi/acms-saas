import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function ShowNew({ archivedCourse }) {
    console.log("ShowNew component rendered with data:", archivedCourse);

    // State for image modal
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check if archivedCourse exists
    if (!archivedCourse) {
        console.error("No archivedCourse data provided");
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            Error: No archived course data provided
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const getSectionStatusBadge = (isCompleted) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        return isCompleted
            ? `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
            : `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    };

    const getSectionStatusText = (isCompleted) => {
        return isCompleted ? "Completed" : "Pending";
    };

    const getDeliveryTypeText = (type) => {
        switch (type) {
            case "office":
                return "Office";
            case "offsite":
                return "Offsite";
            case "abroad":
                return "Abroad";
            default:
                return type || "Not specified";
        }
    };

    // File upload handler
    const handleFileUpload = async (event, sectionId) => {
        const files = event.target.files;
        if (!files.length) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files[]", files[i]);
        }

        try {
            const response = await fetch(
                route("archived-course-sections.files.store", sectionId),
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                // Refresh the page to show new files
                window.location.reload();
            } else {
                alert("Error uploading files");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading files");
        }

        // Reset file input
        event.target.value = "";
    };

    // File delete handler
    const handleFileDelete = async (fileId) => {
        if (!confirm("Are you sure you want to delete this file?")) {
            return;
        }

        try {
            const response = await fetch(
                route("archived-course-section-files.destroy", fileId),
                {
                    method: "DELETE",
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                // Refresh the page to update file list
                window.location.reload();
            } else {
                alert("Error deleting file");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting file");
        }
    };

    // Image modal handlers
    const openImageModal = (file) => {
        setSelectedImage(file);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    // Handle file view - open modal for images, new window for others
    const handleFileView = (file) => {
        // Check if file is an image based on file type or extension
        const isImage =
            file.file_type?.startsWith("image/") ||
            file.file_name
                ?.toLowerCase()
                .match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);

        if (isImage) {
            openImageModal(file);
        } else {
            // Open in new window for non-image files
            window.open(file.file_url, "_blank");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📚 Archived Course:{" "}
                        {archivedCourse.course_name || "Unknown"}
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("archived-courses.index")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ← Back to Archives
                        </Link>
                    </div>
                </div>
            }
        >
            <Head
                title={`Archived Course: ${
                    archivedCourse.course_name || "Unknown"
                }`}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Top Charts Section */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                    📊 Course Analytics Dashboard
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                    {/* Completion Progress */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 text-center text-sm">
                                            📈 Completion Progress
                                        </h3>
                                        <div className="text-center">
                                            <div className="relative inline-flex items-center justify-center w-28 h-28 mb-3">
                                                <svg className="w-28 h-28 transform -rotate-90">
                                                    <circle
                                                        cx="56"
                                                        cy="56"
                                                        r="48"
                                                        stroke="currentColor"
                                                        strokeWidth="10"
                                                        fill="transparent"
                                                        className="text-blue-200 dark:text-blue-800"
                                                    />
                                                    <circle
                                                        cx="56"
                                                        cy="56"
                                                        r="48"
                                                        stroke="currentColor"
                                                        strokeWidth="10"
                                                        fill="transparent"
                                                        strokeDasharray={`${(() => {
                                                            const rate =
                                                                archivedCourse.completion_rate;
                                                            if (
                                                                typeof rate ===
                                                                "number"
                                                            ) {
                                                                return (
                                                                    (rate /
                                                                        100) *
                                                                    301.6
                                                                );
                                                            } else if (
                                                                typeof rate ===
                                                                    "string" &&
                                                                !isNaN(
                                                                    parseFloat(
                                                                        rate
                                                                    )
                                                                )
                                                            ) {
                                                                return (
                                                                    (parseFloat(
                                                                        rate
                                                                    ) /
                                                                        100) *
                                                                    301.6
                                                                );
                                                            } else {
                                                                return 0;
                                                            }
                                                        })()} 301.6`}
                                                        strokeDashoffset="0"
                                                        className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-out"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-blue-800 dark:text-blue-200">
                                                        {(() => {
                                                            const rate =
                                                                archivedCourse.completion_rate;
                                                            if (
                                                                typeof rate ===
                                                                "number"
                                                            ) {
                                                                return rate.toFixed(
                                                                    1
                                                                );
                                                            } else if (
                                                                typeof rate ===
                                                                    "string" &&
                                                                !isNaN(
                                                                    parseFloat(
                                                                        rate
                                                                    )
                                                                )
                                                            ) {
                                                                return parseFloat(
                                                                    rate
                                                                ).toFixed(1);
                                                            } else {
                                                                return "0.0";
                                                            }
                                                        })()}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                Course Completion Rate
                                            </p>
                                        </div>
                                    </div>

                                    {/* Participant Distribution */}
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 text-center text-sm">
                                            👥 Participant Distribution
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                                                    {archivedCourse.real_time_stats?.total_participants || 0}
                                                    /
                                                    {archivedCourse.real_time_stats?.successful_participants || 0}
                                                </div>
                                                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3">
                                                    <div
                                                        className="bg-green-600 dark:bg-green-400 h-3 rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${archivedCourse.real_time_stats?.completion_rate || 0}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                    Success Rate: {archivedCourse.real_time_stats?.completion_rate || 0}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Status */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                        <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3 text-center text-sm">
                                            📊 Course Status
                                        </h3>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-2">
                                                {archivedCourse.status ||
                                                    "Archived"}
                                            </div>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                                    <span className="text-indigo-700 dark:text-indigo-300">
                                                        Active
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Completed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Duration */}
                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                                        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 text-center text-sm">
                                            ⏱️ Duration
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-orange-800 dark:text-orange-200 mb-2">
                                                    {archivedCourse.real_time_stats?.real_duration_hours || 0}h
                                                </div>
                                                <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${Math.min((archivedCourse.real_time_stats?.real_duration_hours || 0) / 100 * 100, 100)}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-orange-600 dark:text-orange-400 mt-1">
                                                    <span>0h</span>
                                                    <span>100h</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Status */}
                                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                                        <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-3 text-center text-sm">
                                            📋 Sections
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-teal-800 dark:text-teal-200 mb-2">
                                                    {archivedCourse.real_time_stats?.completed_sections || 0}
                                                    /
                                                    {archivedCourse.real_time_stats?.total_sections || 0}
                                                </div>
                                                <div className="w-full bg-teal-200 dark:bg-teal-800 rounded-full h-3">
                                                    <div
                                                        className="bg-teal-600 dark:bg-teal-400 h-3 rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${archivedCourse.real_time_stats?.section_completion_rate || 0}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                                                    Completed: {archivedCourse.real_time_stats?.section_completion_rate || 0}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Overview Card */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {/* Full Width Title */}
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 px-4 py-2 rounded-lg shadow-lg text-center">
                                        {archivedCourse.course_name ||
                                            "Unknown Course"}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 text-center">
                                        {archivedCourse.description ||
                                            "No description available"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Basic Info & Location */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                                    📍 Location
                                                </h3>
                                                <p className="text-gray-700 dark:text-gray-200 font-medium">
                                                    {archivedCourse.location_details ||
                                                        "Not specified"}
                                                </p>
                                            </div>

                                            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
                                                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                                                    👨‍🏫 Team
                                                </h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-green-700 dark:text-green-300 font-medium text-xs">
                                                            Trainer:
                                                        </span>
                                                        <span className="font-semibold text-green-800 dark:text-green-200">
                                                            {archivedCourse.trainer_name ||
                                                                "Not assigned"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-green-700 dark:text-green-300 font-medium text-xs">
                                                            Coordinator:
                                                        </span>
                                                        <span className="font-semibold text-green-800 dark:text-green-200">
                                                            {archivedCourse.coordinator_name ||
                                                                "Not assigned"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                                    🚀 Delivery Type
                                                </h3>
                                                <p className="text-gray-700 dark:text-gray-200 font-medium">
                                                    {getDeliveryTypeText(
                                                        archivedCourse.delivery_type
                                                    )}
                                                </p>
                                            </div>

                                                               {/* Course Statistics - Now horizontally aligned */}
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                       <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                           📊 Course Statistics
                       </h3>
                       <div className="space-y-2 text-sm">
                           <div className="flex justify-between items-center">
                               <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">
                                   Participants:
                               </span>
                               <span className="font-bold text-blue-800 dark:text-blue-200">
                                   {archivedCourse.real_time_stats?.total_participants || 0}
                               </span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">
                                   Success:
                               </span>
                               <span className="font-bold text-blue-800 dark:text-blue-200">
                                   {archivedCourse.real_time_stats?.successful_participants || 0}
                               </span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">
                                   Rate:
                               </span>
                               <span className="font-bold text-blue-800 dark:text-blue-200">
                                   {archivedCourse.real_time_stats?.completion_rate || 0}%
                               </span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">
                                   Duration:
                               </span>
                               <span className="font-bold text-blue-800 dark:text-blue-200">
                                   {archivedCourse.real_time_stats?.real_duration_hours || 0} h
                               </span>
                           </div>
                       </div>
                   </div>
                                        </div>

                                        {/* Additional Info Box */}
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3 flex items-center">
                                                📋 Course Details
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-indigo-700 dark:text-indigo-300">
                                                        Status:
                                                    </span>
                                                    <span className="font-semibold text-indigo-800 dark:text-indigo-200">
                                                        {archivedCourse.status ||
                                                            "Archived"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-indigo-700 dark:text-indigo-300">
                                                        Course Code:
                                                    </span>
                                                    <span className="font-semibold text-indigo-800 dark:text-indigo-200">
                                                        {archivedCourse.course_code ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Participant Summary */}
                                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-rose-200 dark:border-rose-800">
                                            <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-3 flex items-center">
                                                👥 Participant Summary
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center p-2 bg-rose-100 dark:bg-rose-800/30 rounded">
                                                    <span className="text-rose-700 dark:text-rose-300 font-medium">
                                                        Total:
                                                    </span>
                                                    <span className="font-semibold text-rose-800 dark:text-rose-200">
                                                        {archivedCourse.real_time_stats?.total_participants || 0}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-rose-100 dark:bg-rose-800/30 rounded">
                                                    <span className="text-rose-700 dark:text-rose-300 font-medium">
                                                        Successful:
                                                    </span>
                                                    <span className="font-semibold text-rose-800 dark:text-rose-200">
                                                        {archivedCourse.real_time_stats?.successful_participants || 0}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-rose-200 dark:bg-rose-800 rounded-full h-2">
                                                    <div
                                                        className="bg-rose-600 dark:bg-rose-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${archivedCourse.real_time_stats?.completion_rate || 0}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-rose-600 dark:text-rose-400 text-center">
                                                    Success Rate: {archivedCourse.real_time_stats?.completion_rate || 0}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Stats & Team */}
                                    <div className="space-y-6">
                                        {/* Archive Info */}
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                                            <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center">
                                                📅 Archive Info
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                                                    <span className="text-purple-700 dark:text-purple-300 font-medium">
                                                        Archived:
                                                    </span>
                                                    <span className="font-semibold text-purple-800 dark:text-purple-200">
                                                        {archivedCourse.archived_date
                                                            ? new Date(
                                                                  archivedCourse.archived_date
                                                              ).toLocaleDateString()
                                                            : "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                                                    <span className="text-purple-700 dark:text-purple-300 font-medium">
                                                        Start Date:
                                                    </span>
                                                    <span className="font-semibold text-purple-800 dark:text-purple-200">
                                                        {archivedCourse.start_date
                                                            ? new Date(
                                                                  archivedCourse.start_date
                                                              ).toLocaleDateString()
                                                            : "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                                                    <span className="text-purple-700 dark:text-purple-300 font-medium">
                                                        End Date:
                                                    </span>
                                                    <span className="font-semibold text-purple-800 dark:text-purple-200">
                                                        {archivedCourse.end_date
                                                            ? new Date(
                                                                  archivedCourse.end_date
                                                              ).toLocaleDateString()
                                                            : "Unknown"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Overview */}
                                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-5 rounded-lg border border-teal-200 dark:border-teal-800">
                                            <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-3 flex items-center">
                                                📊 Section Overview
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center p-2 bg-teal-100 dark:bg-teal-800/30 rounded">
                                                    <span className="text-teal-700 dark:text-teal-300 font-medium">
                                                        Total Sections:
                                                    </span>
                                                    <span className="font-semibold text-teal-800 dark:text-teal-200">
                                                        {archivedCourse.real_time_stats?.total_sections || 0}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-teal-100 dark:bg-teal-800/30 rounded">
                                                    <span className="text-teal-700 dark:text-teal-300 font-medium">
                                                        Completed:
                                                    </span>
                                                    <span className="font-semibold text-teal-800 dark:text-teal-200">
                                                        {archivedCourse.real_time_stats?.completed_sections || 0}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-teal-200 dark:bg-teal-800 rounded-full h-2">
                                                    <div
                                                        className="bg-teal-600 dark:bg-teal-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${archivedCourse.real_time_stats?.section_completion_rate || 0}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-teal-600 dark:text-teal-400 text-center">
                                                    Section Completion Rate
                                                </p>
                                            </div>
                                        </div>

                                        {/* Course Timeline */}
                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-5 rounded-lg border border-amber-200 dark:border-amber-800">
                                            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center">
                                                📅 Course Timeline
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center p-2 bg-amber-100 dark:bg-amber-800/30 rounded">
                                                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                                                        Start Date:
                                                    </span>
                                                    <span className="font-semibold text-amber-800 dark:text-amber-200">
                                                        {archivedCourse.start_date
                                                            ? new Date(
                                                                  archivedCourse.start_date
                                                              ).toLocaleDateString()
                                                            : "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-amber-100 dark:bg-amber-800/30 rounded">
                                                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                                                        End Date:
                                                    </span>
                                                    <span className="font-semibold text-amber-800 dark:text-amber-200">
                                                        {archivedCourse.end_date
                                                            ? new Date(
                                                                  archivedCourse.end_date
                                                              ).toLocaleDateString()
                                                            : "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-amber-100 dark:bg-amber-800/30 rounded">
                                                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                                                        Duration:
                                                    </span>
                                                    <span className="font-semibold text-amber-800 dark:text-amber-200">
                                                        {archivedCourse.real_time_stats?.real_duration_hours || 0}{" "}
                                                        hours
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                {/* Course Sections */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        📋 Course Sections (
                                        {archivedCourse.real_time_stats?.total_sections || 0})
                                    </h2>
                                    <div className="flex space-x-3">
                                        <a
                                            href={`/attendance/course/${archivedCourse.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            📊 Manage Attendance
                                        </a>
                                        <a
                                            href={`/attendance/export/${archivedCourse.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            📥 Export Report
                                        </a>
                                    </div>
                                </div>

                                {archivedCourse.sections &&
                                archivedCourse.sections.length > 0 ? (
                                    <div className="grid gap-6">
                                        {archivedCourse.sections.map(
                                            (section, index) => (
                                                <div
                                                    key={section.id || index}
                                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-5"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                                                                {section.order ||
                                                                    index + 1}
                                                                .
                                                            </span>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    {section.section_name_en ||
                                                                        "Unnamed Section"}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {section.section_name_ar ||
                                                                        "No Arabic name"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className={getSectionStatusBadge(
                                                                section.is_completed
                                                            )}
                                                        >
                                                            {getSectionStatusText(
                                                                section.is_completed
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        {section.description ||
                                                            "No description"}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                        <span className="flex items-center">
                                                            📁 Type:{" "}
                                                            {section.type ||
                                                                "Unknown"}
                                                        </span>
                                                        {section.is_required && (
                                                            <span className="flex items-center text-red-600 dark:text-red-400">
                                                                ⚠️ Required
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* File Upload Section */}
                                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                📎 Files (
                                                                {section.files
                                                                    ?.length ||
                                                                    0}
                                                                )
                                                            </h4>
                                                            <button
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            `file-upload-${section.id}`
                                                                        )
                                                                        .click()
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                                                            >
                                                                + Upload Files
                                                            </button>
                                                        </div>

                                                        {/* Hidden file input */}
                                                        <input
                                                            id={`file-upload-${section.id}`}
                                                            type="file"
                                                            multiple
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
                                                            className="hidden"
                                                            onChange={(e) =>
                                                                handleFileUpload(
                                                                    e,
                                                                    section.id
                                                                )
                                                            }
                                                        />

                                                        {/* Files List */}
                                                        {section.files &&
                                                        section.files.length >
                                                            0 ? (
                                                            <div className="grid gap-2">
                                                                {section.files.map(
                                                                    (
                                                                        file,
                                                                        fileIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                file.id ||
                                                                                fileIndex
                                                                            }
                                                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                                        >
                                                                            <div className="flex items-center space-x-3">
                                                                                <span className="text-xl">
                                                                                    {
                                                                                        file.file_icon
                                                                                    }
                                                                                </span>
                                                                                <div>
                                                                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                                                                        {
                                                                                            file.file_name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                        {
                                                                                            file.file_size_formatted
                                                                                        }{" "}
                                                                                        •{" "}
                                                                                        {
                                                                                            file.uploaded_by
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleFileView(
                                                                                            file
                                                                                        )
                                                                                    }
                                                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                                                                >
                                                                                    👁️
                                                                                    View
                                                                                </button>
                                                                                <a
                                                                                    href={route(
                                                                                        "archived-course-section-files.download",
                                                                                        file.id
                                                                                    )}
                                                                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm"
                                                                                >
                                                                                    ⬇️
                                                                                    Download
                                                                                </a>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleFileDelete(
                                                                                            file.id
                                                                                        )
                                                                                    }
                                                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                                                                >
                                                                                    🗑️
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                                <p>
                                                                    No files
                                                                    uploaded yet
                                                                </p>
                                                                <p className="text-sm">
                                                                    Click
                                                                    "Upload
                                                                    Files" to
                                                                    add
                                                                    documents,
                                                                    images, or
                                                                    spreadsheets
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 text-6xl mb-4">
                                            📋
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            No sections found
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No course sections were archived
                                            with this course.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Archived Participants */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                    👥 Archived Participants (
                                    {archivedCourse.participants?.length || 0})
                                </h2>

                                {archivedCourse.participants &&
                                archivedCourse.participants.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Participant
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Organization
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Nationality
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Attendance
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Evaluation
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Certificate
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {archivedCourse.participants.map(
                                                    (participant, index) => (
                                                        <tr
                                                            key={
                                                                participant.id ||
                                                                index
                                                            }
                                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <td className="px-6 py-5 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {participant.participant_name ||
                                                                            "Unknown"}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {participant.participant_email ||
                                                                            "No email"}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {participant.organization ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {participant.nationality ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="px-6 py-5 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        participant.attendance_status ===
                                                                        "present"
                                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                    }`}
                                                                >
                                                                    {participant.attendance_status ===
                                                                    "present"
                                                                        ? "Present"
                                                                        : "Absent"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {participant.evaluation_score
                                                                    ? `${participant.evaluation_score}/10`
                                                                    : "N/A"}
                                                            </td>
                                                            <td className="px-6 py-5 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        participant.certificate_issued
                                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                                    }`}
                                                                >
                                                                    {participant.certificate_issued
                                                                        ? "Issued"
                                                                        : "Pending"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 text-6xl mb-4">
                                            👥
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            No participants archived
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No participant data was archived
                                            with this course.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {isModalOpen && selectedImage && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={closeImageModal}
                        ></div>

                        {/* Modal content */}
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            {/* Modal header */}
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                    📷 {selectedImage.file_name}
                                </h3>
                                <button
                                    onClick={closeImageModal}
                                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-full p-2 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="px-4 py-5 sm:p-6">
                                <div className="text-center">
                                    <img
                                        src={selectedImage.file_url}
                                        alt={selectedImage.file_name}
                                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                                        style={{ maxHeight: "70vh" }}
                                    />
                                </div>

                                {/* File information */}
                                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    <p>
                                        Size:{" "}
                                        {selectedImage.file_size_formatted}
                                    </p>
                                    <p>
                                        Uploaded by: {selectedImage.uploaded_by}
                                    </p>
                                    {selectedImage.description && (
                                        <p>
                                            Description:{" "}
                                            {selectedImage.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-end space-x-3">
                                <a
                                    href={selectedImage.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    🔗 Open in New Tab
                                </a>
                                <a
                                    href={route(
                                        "archived-course-section-files.download",
                                        selectedImage.id
                                    )}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    ⬇️ Download
                                </a>
                                <button
                                    onClick={closeImageModal}
                                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
