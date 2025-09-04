import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ClientShow({ client, clientType, relatedData }) {
    const getClientTypeIcon = (type) => {
        switch (type) {
            case 'participant': return '👥';
            case 'company': return '🏢';
            case 'user': return '👤';
            default: return '👤';
        }
    };

    const getClientTypeColor = (type) => {
        switch (type) {
            case 'participant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'company': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'user': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'verified': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'featured': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    👤 Client Details
                </h2>
            }
        >
            <Head title={`Client Details - ${client.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href={route('clients.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                            ← Back to Clients
                        </Link>
                    </div>

                    {/* Client Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6">
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-3xl">
                                            {getClientTypeIcon(clientType)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {client.name}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {client.email}
                                    </p>
                                    <div className="mt-2 flex space-x-2">
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getClientTypeColor(clientType)}`}>
                                            {clientType === 'participant' ? 'Training Participant' : 
                                             clientType === 'company' ? 'Rental Company' : 'System User'}
                                        </span>
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(client.status || 'active')}`}>
                                            {client.status || 'active'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Basic Information */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        📋 Basic Information
                                    </h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Full Name
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {client.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Email Address
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {client.email}
                                            </dd>
                                        </div>
                                        {client.phone && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Phone Number
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {client.phone}
                                                </dd>
                                            </div>
                                        )}
                                        {client.company && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Company
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {client.company}
                                                </dd>
                                            </div>
                                        )}
                                        {client.nationality && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Nationality
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {client.nationality}
                                                </dd>
                                            </div>
                                        )}
                                        {client.country && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Country
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {client.country}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Client Type Specific Information */}
                            {clientType === 'participant' && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            🎓 Training Information
                                        </h3>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Courses Enrolled
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {relatedData.enrollments || 0}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Status
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {client.status || 'Active'}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {clientType === 'company' && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            🚗 Company Information
                                        </h3>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Total Vehicles
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {relatedData.total_vehicles || 0}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Total Revenue
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    ${(relatedData.total_revenue || 0).toLocaleString()}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Verification Status
                                                </dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${client.is_verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                        {client.is_verified ? 'Verified' : 'Not Verified'}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Featured Status
                                                </dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${client.is_featured ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                                                        {client.is_featured ? 'Featured' : 'Regular'}
                                                    </span>
                                                </dd>
                                            </div>
                                            {client.rating && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Rating
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                        ⭐ {client.rating}/5.0
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {clientType === 'user' && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            👤 User Information
                                        </h3>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Role
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                    {relatedData.role || 'User'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Account Status
                                                </dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                        {client.status || 'Active'}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        ⚡ Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        {clientType === 'participant' && (
                                            <Link
                                                href={route('participants.edit', client.id)}
                                                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                            >
                                                ✏️ Edit Participant
                                            </Link>
                                        )}
                                        {clientType === 'company' && (
                                            <>
                                                <Link
                                                    href={route('transportation.companies.edit', client.id)}
                                                    className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                                                >
                                                    ✏️ Edit Company
                                                </Link>
                                                <Link
                                                    href={route('transportation.companies.vehicles', client.id)}
                                                    className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                                                >
                                                    🚗 Manage Vehicles
                                                </Link>
                                            </>
                                        )}
                                        {clientType === 'user' && (
                                            <Link
                                                href={route('users.edit', client.id)}
                                                className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                                            >
                                                ✏️ Edit User
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        📈 Activity Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                    Client created
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(client.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                    Last updated
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(client.updated_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Related Data */}
                            {clientType === 'participant' && relatedData.courses && relatedData.courses.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            🎓 Enrolled Courses
                                        </h3>
                                        <div className="space-y-2">
                                            {relatedData.courses.map((course) => (
                                                <div key={course.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {course.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {course.status || 'Active'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {clientType === 'company' && relatedData.vehicles && relatedData.vehicles.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                            🚗 Company Vehicles
                                        </h3>
                                        <div className="space-y-2">
                                            {relatedData.vehicles.slice(0, 5).map((vehicle) => (
                                                <div key={vehicle.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {vehicle.brand} {vehicle.model}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {vehicle.license_plate} • ${vehicle.revenue_to_date || 0}
                                                    </p>
                                                </div>
                                            ))}
                                            {relatedData.vehicles.length > 5 && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                    +{relatedData.vehicles.length - 5} more vehicles
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
