import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function RolesIndex({ roles }) {
    const { flash } = usePage().props;
    const deleteForm = useForm();
    const toggleForm = useForm();

    const handleDelete = (roleId) => {
        if (confirm('Are you sure you want to delete this role?')) {
            deleteForm.delete(route('catering.roles.destroy', roleId));
        }
    };

    const handleToggleStatus = (roleId) => {
        toggleForm.patch(route('catering.roles.toggle', roleId));
    };

    const getHierarchyColor = (level) => {
        if (level <= 2) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
        if (level <= 4) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    };

    const getHierarchyLabel = (level) => {
        if (level <= 2) return 'Senior';
        if (level <= 4) return 'Mid-Level';
        return 'Entry-Level';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    👥 Catering Roles Management
                </h2>
            }
        >
            <Head title="Catering Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Success/Error Messages */}
                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-green-800 dark:text-green-200">{flash.success}</p>
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-200">{flash.error}</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Catering Roles
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Manage kitchen and service staff roles, responsibilities, and requirements.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('catering.roles.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ➕ Add New Role
                            </Link>
                            <Link
                                href={route('catering.index')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Roles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className={`bg-white dark:bg-gray-800 shadow rounded-xl border-2 transition-all hover:shadow-lg ${
                                    role.is_active
                                        ? 'border-green-200 dark:border-green-800'
                                        : 'border-red-200 dark:border-red-800'
                                }`}
                            >
                                {/* Role Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-3xl">{role.icon}</div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHierarchyColor(role.hierarchy_level)}`}>
                                                {getHierarchyLabel(role.hierarchy_level)}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Level {role.hierarchy_level}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {role.name}
                                    </h3>
                                    
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                            {role.slug.replace('_', ' ')}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            role.is_active
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                                        }`}>
                                            {role.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {role.description}
                                    </p>
                                </div>

                                {/* Required Skills */}
                                {role.required_skills && role.required_skills.length > 0 && (
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                            Required Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {role.required_skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-xs rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="p-6">
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('catering.roles.edit', role.id)}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            ✏️ Edit Role
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(role.id)}
                                            disabled={toggleForm.processing}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                role.is_active
                                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {toggleForm.processing ? "..." : (role.is_active ? "🚫 Disable" : "✅ Enable")}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(role.id)}
                                            disabled={deleteForm.processing}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {roles.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No Roles Available
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Start by creating your first catering role.
                            </p>
                            <Link
                                href={route('catering.roles.create')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                ➕ Add New Role
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
