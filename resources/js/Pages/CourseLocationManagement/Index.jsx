import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ locations, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    // Filter and sort locations
    const filteredLocations = locations
        .filter(location => {
            const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                location.country?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || 
                                (statusFilter === "active" && location.is_active) ||
                                (statusFilter === "inactive" && !location.is_active);
            const matchesType = typeFilter === "all" || location.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "courses":
                    return b.courses_count - a.courses_count;
                case "capacity":
                    return (b.capacity || 0) - (a.capacity || 0);
                case "city":
                    return (a.city || "").localeCompare(b.city || "");
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const handleDelete = (location) => {
        if (confirm(`Are you sure you want to delete the location "${location.name}"?`)) {
            router.delete(route("course-location-management.destroy", location.id));
        }
    };

    const handleToggleStatus = (location) => {
        router.patch(route("course-location-management.toggle-status", location.id));
    };

    const getStatusColor = (isActive) => {
        return isActive 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    };

    const getTypeColor = (type) => {
        const colors = {
            'training_center': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'office': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'conference_room': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'hotel': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'client_site': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        };
        return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };

    const getTypeIcon = (type) => {
        const icons = {
            'training_center': '🎓',
            'office': '🏢',
            'conference_room': '💼',
            'hotel': '🏨',
            'client_site': '📍',
        };
        return icons[type] || '📍';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📍 Course Location Management
                    </h2>
                    <Link
                        href={route("course-location-management.create")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        ➕ Add New Location
                    </Link>
                </div>
            }
        >
            <Head title="Course Location Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Locations</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total_locations}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Locations</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.active_locations}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                                    <span className="text-2xl">📚</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total_courses}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                                    <span className="text-2xl">🏗️</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Location Types</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Object.keys(stats.locations_by_type).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Type Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            📊 Location Type Distribution
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(stats.locations_by_type).map(([type, count]) => (
                                <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-2xl mb-2">{getTypeIcon(type)}</div>
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                                        {type.replace('_', ' ')}
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{count}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search locations, cities, or countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">All Types</option>
                                    <option value="training_center">Training Centers</option>
                                    <option value="office">Offices</option>
                                    <option value="conference_room">Conference Rooms</option>
                                    <option value="hotel">Hotels</option>
                                    <option value="client_site">Client Sites</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="courses">Sort by Courses</option>
                                    <option value="capacity">Sort by Capacity</option>
                                    <option value="city">Sort by City</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Locations Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Locations ({filteredLocations.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Capacity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Courses
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
                                    {filteredLocations.map((location) => (
                                        <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-2xl mr-3">{getTypeIcon(location.type)}</div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {location.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {location.building && location.room ? `${location.building} - ${location.room}` : location.building || location.room || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(location.type)}`}>
                                                    {location.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                                                    {location.address && (
                                                        <div>{location.address}</div>
                                                    )}
                                                    {(location.city || location.country) && (
                                                        <div className="text-gray-500 dark:text-gray-400">
                                                            {[location.city, location.country].filter(Boolean).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {location.capacity ? `${location.capacity} people` : 'Not specified'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {location.courses_count} courses
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(location.is_active)}`}>
                                                    {location.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route("course-location-management.show", location.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        👁️ View
                                                    </Link>
                                                    <Link
                                                        href={route("course-location-management.edit", location.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        ✏️ Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(location)}
                                                        className={`${location.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'} dark:text-yellow-400 dark:hover:text-yellow-300`}
                                                    >
                                                        {location.is_active ? "⏸️ Deactivate" : "▶️ Activate"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(location)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        disabled={location.courses_count > 0}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredLocations.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📍</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No locations found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                                    ? "Try adjusting your search or filters."
                                    : "Get started by adding your first course location."
                                }
                            </p>
                            {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
                                <Link
                                    href={route("course-location-management.create")}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                                >
                                    ➕ Add Your First Location
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
