import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ archivedCourses }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📚 Course Archives
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {archivedCourses.length} Archived Course{archivedCourses.length !== 1 ? 's' : ''}
                    </div>
                </div>
            }
        >
            <Head title="Course Archives" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {archivedCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No archived courses yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Courses will appear here after they are completed and archived.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {archivedCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {course.course_name}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${course.status_badge}`}>
                                                {course.status}
                                            </span>
                                        </div>

                                        {course.course_code && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Code: {course.course_code}
                                            </p>
                                        )}

                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Trainer:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">{course.trainer_name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Coordinator:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">{course.coordinator_name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">{course.formatted_duration}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {course.total_participants} ({course.successful_participants} completed)
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Completion Rate:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {course.completion_rate}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Archived:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                    {new Date(course.archived_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Course Sections
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {course.sections.filter(s => s.is_completed).length}/{course.sections.length} completed
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {course.sections.slice(0, 3).map((section) => (
                                                    <div key={section.id} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`w-2 h-2 rounded-full ${section.is_completed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                {section.section_name_en}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {section.type}
                                                        </span>
                                                    </div>
                                                ))}
                                                {course.sections.length > 3 && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                        +{course.sections.length - 3} more sections
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <a
                                                href={route("archived-courses.show", course.id)}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center block transition-colors"
                                            >
                                                View Full Archive
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
