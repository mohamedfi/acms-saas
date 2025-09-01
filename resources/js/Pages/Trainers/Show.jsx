import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ trainer }) {
    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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
            case "active": return "Active";
            case "inactive": return "Inactive";
            case "on_leave": return "On Leave";
            default: return "Unknown";
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👨‍🏫 Trainer Profile: {trainer.full_name}
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("trainers.edit", trainer.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ✏️ Edit Trainer
                        </Link>
                        <Link
                            href={route("trainers.index")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ← Back to Trainers
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Trainer: ${trainer.full_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    {/* Profile Image */}
                                    <div className="text-center mb-6">
                                        {trainer.profile_image_url ? (
                                            <img
                                                src={trainer.profile_image_url}
                                                alt={trainer.full_name}
                                                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200 dark:border-gray-600"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto border-4 border-gray-200 dark:border-gray-600">
                                                <span className="text-gray-600 dark:text-gray-400 text-4xl font-semibold">
                                                    {trainer.full_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Basic Info */}
                                    <div className="text-center mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {trainer.full_name}
                                        </h1>
                                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                                            {trainer.position || 'No Position'}
                                        </p>
                                        <span className={getStatusBadge(trainer.status)}>
                                            {getStatusText(trainer.status)}
                                        </span>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 w-20">📧 Email:</span>
                                            <span className="text-gray-900 dark:text-gray-100">{trainer.email}</span>
                                        </div>
                                        {trainer.phone && (
                                            <div className="flex items-center text-sm">
                                                <span className="text-gray-500 dark:text-gray-400 w-20">📱 Phone:</span>
                                                <span className="text-gray-900 dark:text-gray-100">{trainer.phone}</span>
                                            </div>
                                        )}
                                        {trainer.years_experience > 0 && (
                                            <div className="flex items-center text-sm">
                                                <span className="text-gray-500 dark:text-gray-400 w-20">⏰ Experience:</span>
                                                <span className="text-gray-900 dark:text-gray-100">{trainer.years_experience} years</span>
                                            </div>
                                        )}
                                        {trainer.hourly_rate && (
                                            <div className="flex items-center text-sm">
                                                <span className="text-gray-500 dark:text-gray-400 w-20">💰 Rate:</span>
                                                <span className="text-gray-900 dark:text-gray-100">{trainer.hourly_rate} {trainer.currency}/hour</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CV Document */}
                                    {trainer.cv_document_url && (
                                        <div className="text-center">
                                            <a
                                                href={trainer.cv_document_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                                            >
                                                📄 View CV
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Detailed Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Bio */}
                            {trainer.bio && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            🎓 Professional Background
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {trainer.bio}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Expertise Areas */}
                            {trainer.expertise_areas && trainer.expertise_areas_array && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            🎯 Expertise Areas
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(trainer.expertise_areas_array) && trainer.expertise_areas_array.map((area, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200"
                                                >
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Qualifications */}
                            {trainer.qualifications && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            🏆 Qualifications & Certifications
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {trainer.qualifications}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Course Assignments */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📚 Course Assignments
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                                                👨‍🏫 As Trainer
                                            </h4>
                                            <p className="text-green-600 dark:text-green-300">
                                                {trainer.courses_as_trainer ? trainer.courses_as_trainer.length : 0} courses
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                                📋 As Coordinator
                                            </h4>
                                            <p className="text-blue-600 dark:text-blue-300">
                                                {trainer.courses_as_coordinator ? trainer.courses_as_coordinator.length : 0} courses
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {trainer.notes && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            📝 Additional Notes
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {trainer.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Created/Updated Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p>Created: {new Date(trainer.created_at).toLocaleDateString()}</p>
                                    <p>Last updated: {new Date(trainer.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
