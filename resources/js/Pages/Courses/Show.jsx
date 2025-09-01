import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Show({ course }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDeliveryTypeLabel = (type) => {
        switch (type) {
            case "office":
                return "🏢 Office";
            case "offsite":
                return "🏫 Offsite";
            case "abroad":
                return "🌍 Abroad";
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    📚 Course Details
                </h2>
            }
        >
            <Head title={`Course: ${course.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {course.name}
                                    </h1>
                                    {course.code && (
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Course Code: {course.code}
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-3">
                                    <a
                                        href={route("courses.edit", course.id)}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        ✏️ Edit Course
                                    </a>
                                    <a
                                        href={route("courses.index")}
                                        className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                    >
                                        ← Back to Courses
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Course Information */}
                                <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        📋 Course Information
                                    </h2>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Description
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {course.description ||
                                                    "No description provided"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Delivery Type
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {getDeliveryTypeLabel(
                                                    course.delivery_type
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Training Location
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {course.location ? (
                                                    <>
                                                        📍{" "}
                                                        <strong>
                                                            {
                                                                course.location
                                                                    .name
                                                            }
                                                        </strong>
                                                        <br />
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            {course.location
                                                                .address &&
                                                                `${course.location.address}, `}
                                                            {course.location
                                                                .city &&
                                                                `${course.location.city}, `}
                                                            {
                                                                course.location
                                                                    .country
                                                            }
                                                        </span>
                                                        {course.location_details && (
                                                            <>
                                                                <br />
                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                    📋{" "}
                                                                    {
                                                                        course.location_details
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        📍{" "}
                                                        {course.city
                                                            ? `${course.city}, `
                                                            : ""}
                                                        {course.country ||
                                                            "Not specified"}
                                                    </>
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Staff Information */}
                                <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        👥 Staff Assignment
                                    </h2>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Trainer
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                🎓{" "}
                                                {course.trainer?.name ||
                                                    "Not assigned"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Coordinator
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                👨‍💼{" "}
                                                {course.coordinator?.name ||
                                                    "Not assigned"}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Timestamps */}
                                <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700 lg:col-span-2">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        📅 Course Timeline
                                    </h2>
                                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Created
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {formatDate(course.created_at)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Last Updated
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {formatDate(course.updated_at)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
