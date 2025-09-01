import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ employee }) {
    const getRoleBadge = (role) => {
        const roleColors = {
            admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            coordinator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            trainer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            support: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };

        const colorClass = roleColors[role?.name] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                {role?.display_name || 'No Role'}
            </span>
        );
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                🟢 Active
            </span>
        ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                🔴 Inactive
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👤 Employee Details
                    </h2>
                    <div className="space-x-2">
                        <Link
                            href={route('employees.edit', employee.id)}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ✏️ Edit Employee
                        </Link>
                        <Link
                            href={route('employees.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ⬅️ Back to Employees
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${employee.full_name} - Employee Details`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Employee Header Card */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center space-x-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                        {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {employee.full_name}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                                        {employee.position || 'No Position'} • {employee.employee_id}
                                    </p>
                                    <div className="flex items-center space-x-3">
                                        {getRoleBadge(employee.role)}
                                        {getStatusBadge(employee.is_active)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    📞 Contact Information
                                </h3>
                                
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                📧 {employee.email}
                                            </a>
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {employee.phone ? (
                                                <a href={`tel:${employee.phone}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                    📱 {employee.phone}
                                                </a>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">📱 Not provided</span>
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Work Information */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    🏢 Work Information
                                </h3>
                                
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            🏢 {employee.department || 'Not assigned'}
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            💼 {employee.position || 'Not specified'}
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Hire Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            📅 {formatDate(employee.hire_date)}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Role Details */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                🎭 Role Details
                            </h3>
                            
                            {employee.role ? (
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                                        <dd className="mt-1">
                                            {getRoleBadge(employee.role)}
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {employee.role.description || 'No description available'}
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Permissions</dt>
                                        <dd className="mt-1">
                                            {employee.role.permissions && employee.role.permissions.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {employee.role.permissions.map((permission, index) => (
                                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            🔐 {permission}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">No permissions defined</span>
                                            )}
                                        </dd>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No role assigned</p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {employee.bio && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    📝 Bio
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {employee.bio}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                ⚡ Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href={route('employees.edit', employee.id)}
                                    className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <div className="text-2xl mb-2">✏️</div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Edit Profile</span>
                                </Link>
                                
                                <a
                                    href={`mailto:${employee.email}`}
                                    className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <div className="text-2xl mb-2">📧</div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Send Email</span>
                                </a>
                                
                                {employee.phone && (
                                    <a
                                        href={`tel:${employee.phone}`}
                                        className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <div className="text-2xl mb-2">📱</div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Call</span>
                                    </a>
                                )}
                                
                                <Link
                                    href={route('tasks.index', { assigned_to: employee.id })}
                                    className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <div className="text-2xl mb-2">📋</div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Tasks</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
