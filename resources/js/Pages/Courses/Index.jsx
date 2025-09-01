import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

export default function Index() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use the correct URL for MAMP
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/courses`;

        console.log("Debug - Fetching courses from:", apiUrl);

        fetch(apiUrl)
            .then((response) => {
                console.log(
                    "Debug - Courses response status:",
                    response.status
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Debug - Courses data received:", data);
                setCourses(data.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setLoading(false);
            });
    }, []);

    const getStatusBadge = (status) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case "active":
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case "upcoming":
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
            case "completed":
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
            case "cancelled":
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this course?")) {
            router.delete(route("courses.destroy", id));
        }
    };

    const handleArchive = (id) => {
        if (confirm("Are you sure you want to archive this course?")) {
            router.post(route("courses.archive", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📚 Courses Management
                    </h2>
                    <a
                        href={route("courses.create")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        + Add New Course
                    </a>
                </div>
            }
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <span className="ml-2">
                                        Loading courses...
                                    </span>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        📚
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No courses found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Get started by creating your first
                                        course.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                                    {course.name}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    Active
                                                </span>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                                {course.description}
                                            </p>

                                            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">
                                                        🌍
                                                    </span>
                                                    {course.delivery_type ===
                                                    "abroad"
                                                        ? "International"
                                                        : course.delivery_type}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">
                                                        📍
                                                    </span>
                                                    {course.city},{" "}
                                                    {course.country}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">
                                                        🎓
                                                    </span>
                                                    Trainer:{" "}
                                                    {course.trainer
                                                        ?.full_name ||
                                                        "Not Assigned"}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">
                                                        👨‍💼
                                                    </span>
                                                    Coordinator:{" "}
                                                    {course.coordinator
                                                        ?.full_name ||
                                                        "Not Assigned"}
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route(
                                                            "courses.show",
                                                            course.id
                                                        )}
                                                        className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded text-sm font-medium transition-colors text-center"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "courses.edit",
                                                            course.id
                                                        )}
                                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 text-center"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                course.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleArchive(
                                                                course.id
                                                            )
                                                        }
                                                        className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                                                    >
                                                        📚 Archive
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
