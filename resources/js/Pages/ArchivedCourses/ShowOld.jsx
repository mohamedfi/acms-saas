import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ archivedCourse }) {
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
                return type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📚 Archived Course: {archivedCourse.course_name}
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
            <Head title={`Archived Course: ${archivedCourse.course_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Course Overview Card */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Basic Info */}
                                    <div className="lg:col-span-2">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                            {archivedCourse.course_name}
                                        </h1>
                                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                            {archivedCourse.description ||
                                                "No description available"}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                    📍 Location
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {archivedCourse.location_details ||
                                                        "Not specified"}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                    🚀 Delivery Type
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {getDeliveryTypeText(
                                                        archivedCourse.delivery_type
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                                📊 Course Statistics
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>
                                                        Total Participants:
                                                    </span>
                                                    <span className="font-semibold">
                                                        {
                                                            archivedCourse.total_participants
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Successful:</span>
                                                    <span className="font-semibold">
                                                        {
                                                            archivedCourse.successful_participants
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>
                                                        Completion Rate:
                                                    </span>
                                                    <span className="font-semibold">
                                                        {archivedCourse.completion_rate.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Duration:</span>
                                                    <span className="font-semibold">
                                                        {
                                                            archivedCourse.duration_hours
                                                        }{" "}
                                                        hours
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                                👨‍🏫 Team
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">
                                                        Trainer:
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {
                                                            archivedCourse.trainer_name
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Coordinator:
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {
                                                            archivedCourse.coordinator_name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                📅 Archive Info
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Archived:</span>
                                                    <span>
                                                        {new Date(
                                                            archivedCourse.archived_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Start Date:</span>
                                                    <span>
                                                        {new Date(
                                                            archivedCourse.start_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>End Date:</span>
                                                    <span>
                                                        {new Date(
                                                            archivedCourse.end_date
                                                        ).toLocaleDateString()}
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
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                    📋 Course Sections
                                </h2>

                                <div className="grid gap-4">
                                    {archivedCourse.sections &&
                                        archivedCourse.sections.map(
                                            (section, index) => (
                                                <div
                                                    key={section.id}
                                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                                                                {section.order}.
                                                            </span>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        section.section_name_en
                                                                    }
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {
                                                                        section.section_name_ar
                                                                    }
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

                                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                        {section.description}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center">
                                                            📁 Type:{" "}
                                                            {section.type}
                                                        </span>
                                                        {section.is_required && (
                                                            <span className="flex items-center text-red-600 dark:text-red-400">
                                                                ⚠️ Required
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
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
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Participant
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Organization
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Nationality
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Attendance
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Evaluation
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Certificate
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {archivedCourse.participants.map(
                                                    (participant, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            participant.participant_name
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {
                                                                            participant.participant_email
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {participant.organization ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {participant.nationality ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
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
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {participant.evaluation_score
                                                                    ? `${participant.evaluation_score}/10`
                                                                    : "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
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

                        {/* Financial Records */}
                        {archivedCourse.finances &&
                            archivedCourse.finances.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                            💰 Financial Records
                                        </h2>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Amount
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {archivedCourse.finances.map(
                                                        (finance, index) => (
                                                            <tr
                                                                key={index}
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        finance.description
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        finance.amount
                                                                    }{" "}
                                                                    {
                                                                        finance.currency
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                            finance.type ===
                                                                            "income"
                                                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                        }`}
                                                                    >
                                                                        {finance.type ===
                                                                        "income"
                                                                            ? "Income"
                                                                            : "Expense"}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                    {new Date(
                                                                        finance.date
                                                                    ).toLocaleDateString()}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
