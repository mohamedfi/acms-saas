import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Show({ department }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        🏢 Department Details: {department.name}
                    </h2>
                    <div className="flex space-x-4">
                        <Link
                            href={route("departments.edit", department.id)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ✏️ Edit Department
                        </Link>
                        <Link
                            href={route("departments.index")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ⬅️ Back to Departments
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${department.name} - Department Details`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Department Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {department.name}
                                    </h1>
                                    {department.code && (
                                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                                            Code: {department.code}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        department.is_active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {department.is_active ? '🟢 Active' : '🔴 Inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            {department.description && (
                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                    {department.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        📋 Department Information
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Department Name
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.name}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Department Code
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.code || 'Not specified'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Sort Order
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.sort_order || 0}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Status
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.is_active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>

                                    {department.description && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Description
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white leading-relaxed">
                                                {department.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Management Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        👥 Management & Organization
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Department Manager
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.manager ? (
                                                    <span>
                                                        {department.manager.full_name}
                                                        <br />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {department.manager.position}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    'Not assigned'
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Employee Count
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.employees_count || 0} employees
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial & Contact Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        💰 Financial & Contact Information
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Annual Budget
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.budget ? `$${parseFloat(department.budget).toLocaleString()}` : 'Not specified'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Location
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.location || 'Not specified'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Contact Email
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.contact_email ? (
                                                    <a 
                                                        href={`mailto:${department.contact_email}`}
                                                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                                    >
                                                        {department.contact_email}
                                                    </a>
                                                ) : (
                                                    'Not specified'
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Contact Phone
                                            </h4>
                                            <p className="mt-1 text-lg text-gray-900 dark:text-white">
                                                {department.contact_phone || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        ⚡ Quick Actions
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <Link
                                            href={route("departments.edit", department.id)}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            ✏️ Edit Department
                                        </Link>
                                        
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this department?')) {
                                                    // Handle delete
                                                }
                                            }}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            🗑️ Delete Department
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Department Stats */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📊 Department Statistics
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Total Employees</span>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {department.employees_count || 0}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                department.is_active 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {department.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Created</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {new Date(department.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {new Date(department.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
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
