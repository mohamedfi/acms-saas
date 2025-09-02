import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Vehicles({ vehicles }) {
    const { flash } = usePage().props;
    const toggleForm = useForm();

    const handleToggleStatus = (vehicleId) => {
        toggleForm.patch(route('transportation.vehicles.toggle', vehicleId));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
            case 'rented':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
            case 'out_of_service':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🚙 Fleet Management
                </h2>
            }
        >
            <Head title="Fleet Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Success/Error Messages */}
                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-green-800 dark:text-green-200">{flash.success}</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Vehicle Fleet
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Manage your vehicle fleet, track status, and monitor availability.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('transportation.companies.index')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ➕ Add New Vehicle
                            </Link>
                            <Link
                                href={route('transportation.index')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Fleet Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-2xl">🚗</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Vehicles
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {vehicles.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Available
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {vehicles.filter(v => v.status === 'available').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <span className="text-2xl">🔴</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Currently Rented
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {vehicles.filter(v => v.status === 'rented').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                    <span className="text-2xl">🛠️</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        In Maintenance
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {vehicles.filter(v => v.status === 'maintenance').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className={`bg-white dark:bg-gray-800 shadow rounded-xl border-2 transition-all hover:shadow-lg ${
                                    vehicle.is_active
                                        ? 'border-green-200 dark:border-green-800'
                                        : 'border-red-200 dark:border-red-800'
                                }`}
                            >
                                {/* Vehicle Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-3xl">🚗</div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                                                {vehicle.status.replace('_', ' ')}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {vehicle.is_active ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {vehicle.display_name}
                                    </h3>
                                    
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                            {vehicle.license_plate}
                                        </span>
                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                            {vehicle.vehicle_type}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p><span className="font-medium">Color:</span> {vehicle.color}</p>
                                        <p><span className="font-medium">Seats:</span> {vehicle.seats}</p>
                                        <p><span className="font-medium">Fuel:</span> {vehicle.fuel_type}</p>
                                        <p><span className="font-medium">Transmission:</span> {vehicle.transmission}</p>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Rental Rates
                                    </h4>
                                    <div className="space-y-2">
                                        {vehicle.daily_rate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Daily:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    ${vehicle.daily_rate}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.hourly_rate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Hourly:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    ${vehicle.hourly_rate}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.weekly_rate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    ${vehicle.weekly_rate}
                                                </span>
                                            </div>
                                        )}
                                        {vehicle.monthly_rate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    ${vehicle.monthly_rate}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                {vehicle.features && vehicle.features.length > 0 && (
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                            Features
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {vehicle.features.slice(0, 4).map((feature, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                            {vehicle.features.length > 4 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                                    +{vehicle.features.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="p-6">
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('transportation.vehicles.edit', vehicle.id)}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            ✏️ Edit Vehicle
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(vehicle.id)}
                                            disabled={toggleForm.processing}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                vehicle.is_active
                                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {toggleForm.processing ? "..." : (vehicle.is_active ? "🚫 Deactivate" : "✅ Activate")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {vehicles.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🚗</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No Vehicles in Fleet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Start building your fleet by adding your first vehicle.
                            </p>
                            <Link
                                href={route('transportation.companies.index')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                ➕ Add New Vehicle
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
