import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ShowUnified({ hall, bookings }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter bookings based on search and status
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = !searchTerm || 
            booking.trainingProgram?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.trainer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'scheduled': return '📅';
            case 'in_progress': return '🔄';
            case 'completed': return '✅';
            case 'cancelled': return '❌';
            default: return '❓';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        🏢 {hall.name} - Unified View
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("training-halls.pdf", hall.id)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            📄 Download PDF Report
                        </Link>
                        <Link
                            href={route("training-halls.edit", hall.id)}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ✏️ Edit Hall
                        </Link>
                        <Link
                            href={route("training-halls.index")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ⬅️ Back to Halls
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${hall.name} - Unified View`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Hall Information Card */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        🏢 {hall.name}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        Code: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{hall.code}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        hall.is_active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {hall.is_active ? '✅ Active' : '❌ Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">📍</span>
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Location</p>
                                            <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">{hall.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">👥</span>
                                        <div>
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Capacity</p>
                                            <p className="text-lg font-semibold text-green-800 dark:text-green-200">{hall.capacity} participants</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">📅</span>
                                        <div>
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Bookings</p>
                                            <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">{bookings.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">🎯</span>
                                        <div>
                                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Sessions</p>
                                            <p className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                                                {bookings.filter(b => b.status !== 'cancelled').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {hall.description && (
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📝 Description</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{hall.description}</p>
                                </div>
                            )}

                            {hall.address && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🏠 Address</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{hall.address}</p>
                                </div>
                            )}

                            {hall.facilities && hall.facilities.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🛠️ Available Facilities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hall.facilities.map((facility, index) => (
                                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {facility}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(hall.contact_person || hall.contact_phone || hall.contact_email) && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📞 Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {hall.contact_person && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</p>
                                                <p className="text-gray-900 dark:text-white">{hall.contact_person}</p>
                                            </div>
                                        )}
                                        {hall.contact_phone && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                                                <p className="text-gray-900 dark:text-white">{hall.contact_phone}</p>
                                            </div>
                                        )}
                                        {hall.contact_email && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="text-gray-900 dark:text-white">{hall.contact_email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Employee Assignment Information */}
                            {hall.assigned_employee_id && (
                                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">👤 Employee Assignment</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Assigned Employee</p>
                                            <p className="text-purple-800 dark:text-purple-200 font-semibold">
                                                {hall.assignedEmployee?.full_name || 'Employee not found'}
                                            </p>
                                            {hall.assignedEmployee?.position && (
                                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                                    {hall.assignedEmployee.position}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Assignment Role</p>
                                            <p className="text-purple-800 dark:text-purple-200 font-semibold">
                                                {hall.assigned_role ? hall.assigned_role.charAt(0).toUpperCase() + hall.assigned_role.slice(1) : 'Not specified'}
                                            </p>
                                            {hall.assignment_date && (
                                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                                    Assigned: {hall.assignment_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {hall.assignment_notes && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Assignment Notes</p>
                                            <p className="text-purple-800 dark:text-purple-200">{hall.assignment_notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Course Specialization Information */}
                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">📚 Course Specialization</h3>
                                <div className="flex items-center mb-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        hall.is_general_purpose 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    }`}>
                                        {hall.is_general_purpose ? '🌐 General Purpose' : '🎯 Specialized'}
                                    </span>
                                </div>
                                {!hall.is_general_purpose && hall.specialized_courses && hall.specialized_courses.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Specialized Courses:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {hall.specialized_courses.map((courseId, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    Course ID: {courseId}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bookings Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    📅 Training Sessions & Bookings
                                </h2>
                                <Link
                                    href={route("hall-bookings.create")}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    ➕ Add New Booking
                                </Link>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search by course name, booking reference, or trainer..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="text-6xl mb-4 block">📭</span>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm || statusFilter !== 'all' 
                                            ? 'Try adjusting your search or filters'
                                            : 'This hall has no training sessions scheduled yet'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Course & Details
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Trainer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Schedule
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Participants
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredBookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {booking.trainingProgram?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                Ref: {booking.booking_reference}
                                                            </div>
                                                            {booking.notes && (
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                    📝 {booking.notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {booking.trainer?.full_name || 'Not assigned'}
                                                        </div>
                                                        {booking.trainer?.position && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {booking.trainer.position}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            <div>📅 {booking.start_date}</div>
                                                            <div>⏰ {booking.start_time} - {booking.end_time}</div>
                                                            {booking.start_date !== booking.end_date && (
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    to {booking.end_date}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            <div>{booking.current_participants} / {booking.max_participants}</div>
                                                            {booking.price_per_participant && (
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    ${parseFloat(booking.price_per_participant).toFixed(2)} per person
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {getStatusIcon(booking.status)} {booking.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route("hall-bookings.show", booking.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                👁️ View
                                                            </Link>
                                                            <Link
                                                                href={route("hall-bookings.edit", booking.id)}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                            >
                                                                ✏️ Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
