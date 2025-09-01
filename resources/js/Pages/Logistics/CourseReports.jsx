import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function CourseReports() {
    // Mock data for demonstration
    const courseData = {
        total_courses: 89,
        completed_courses: 76,
        active_courses: 13,
        total_participants: 1245,
        average_cost_per_course: 850,
        on_time_delivery: 94.2,
        customer_satisfaction: 4.7
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    📚 Course Logistics Reports
                </h2>
            }
        >
            <Head title="Course Logistics Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Course Logistics Reports & Analytics
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Comprehensive analysis of course delivery, logistics performance, and participant satisfaction.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('logistics.reports')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Reports
                                </Link>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    📥 Export Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">📚</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {courseData.total_courses}
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
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {courseData.completed_courses}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Participants</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {courseData.total_participants.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Cost</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        ${courseData.average_cost_per_course}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Placeholder */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Course Logistics Analytics Dashboard
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Detailed course logistics reports and analytics will be displayed here.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                📊 Generate Report
                            </button>
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                📧 Email Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
