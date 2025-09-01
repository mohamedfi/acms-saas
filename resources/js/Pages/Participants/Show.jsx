import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ participant }) {
    const getVisaStatusBadge = (status, nationality) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

        // If Egyptian, no visa needed
        if (nationality && nationality.toLowerCase() === "egyptian") {
            return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
        }

        // For non-Egyptians, visa is required
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
    };

    const getVisaStatusText = (status, nationality) => {
        // If Egyptian, no visa needed
        if (nationality && nationality.toLowerCase() === "egyptian") {
            return "Not Required";
        }

        // For non-Egyptians, visa is required
        return "Required";
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👤 Participant Details
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("participants.edit", participant.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ✏️ Edit Participant
                        </Link>
                        <Link
                            href={route("participants.index")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ← Back to List
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Participant - ${participant.full_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Participant Header */}
                            <div className="flex items-center mb-8">
                                <div className="h-20 w-20 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                                    {participant.profile_image_url ? (
                                        <img
                                            src={participant.profile_image_url}
                                            alt={participant.full_name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-2xl">
                                            {getInitials(participant.full_name)}
                                        </span>
                                    )}
                                </div>
                                <div className="ml-6">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {participant.full_name}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                                        Participant ID: {participant.id}
                                    </p>
                                </div>
                            </div>

                            {/* Participant Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📋 Personal Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {participant.full_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Email Address
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {participant.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Phone Number
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {participant.phone ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Travel Information */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        🛂 Travel Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Nationality
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {participant.nationality ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Passport/ID Number
                                            </label>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {participant.passport_no ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Visa Status
                                            </label>
                                            <div className="mt-1">
                                                <span
                                                    className={getVisaStatusBadge(
                                                        participant.visa_status ||
                                                            "active",
                                                        participant.nationality
                                                    )}
                                                >
                                                    {getVisaStatusText(
                                                        participant.visa_status ||
                                                            "active",
                                                        participant.nationality
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {participant.passport_id_document_url && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Passport/ID Document
                                                </label>
                                                <div className="mt-2">
                                                    <a
                                                        href={
                                                            participant.passport_id_document_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm font-medium transition-colors dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                                                    >
                                                        📄 View Document
                                                        <svg
                                                            className="ml-2 h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Passport/ID Document */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📄 Passport/ID Document
                                    </h3>
                                    {participant.passport_id_document_url ? (
                                        <div className="flex items-center space-x-3">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                Document uploaded
                                            </span>
                                            <Link
                                                href={
                                                    participant.passport_id_document_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                📎 View Document
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No document uploaded
                                        </p>
                                    )}
                                </div>

                                {/* QR Code */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📱 QR Code
                                    </h3>
                                    {participant.qr_code ? (
                                        <div className="space-y-4">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                <strong>QR Code:</strong>{" "}
                                                {participant.qr_code}
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={route(
                                                        "participants.qr-code",
                                                        participant.id
                                                    )}
                                                    alt={`QR Code for ${participant.full_name}`}
                                                    className="w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-lg"
                                                />
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>Scan this QR code to:</p>
                                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                                        <li>Mark attendance</li>
                                                        <li>
                                                            Access participant
                                                            info
                                                        </li>
                                                        <li>
                                                            Track course
                                                            progress
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                💡 This QR code is unique to
                                                this participant and can be used
                                                for attendance tracking and
                                                identification.
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No QR code generated
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    📅 Additional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Created At
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {new Date(
                                                participant.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Last Updated
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {new Date(
                                                participant.updated_at
                                            ).toLocaleDateString()}
                                        </p>
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
