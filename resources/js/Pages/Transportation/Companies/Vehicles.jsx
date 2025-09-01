import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function CompanyVehicles({ company, vehicles, stats }) {
    const formatCurrency = (amount) => {
        if (!amount) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AED",
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const badges = {
            available:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            rented: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            maintenance:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            out_of_service:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return (
            badges[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    const getVehicleTypeIcon = (type) => {
        const icons = {
            Sedan: "🚗",
            SUV: "🚙",
            Luxury: "🏎️",
            Van: "🚐",
            Bus: "🚌",
            Truck: "🚛",
            Motorcycle: "🏍️",
        };
        return icons[type] || "🚗";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🚗 Company Vehicles
                </h2>
            }
        >
            <Head title={`${company.name} - Vehicles`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {company.name} - Vehicle Fleet
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage and view all vehicles in the company
                                    fleet
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route(
                                        "transportation.companies.show",
                                        company.id
                                    )}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Company
                                </Link>
                                <Link
                                    href={route(
                                        "transportation.companies.index"
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    All Companies
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">🚗</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Vehicles
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.total}
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
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Available
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.available}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Currently Rented
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.rented}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <span className="text-2xl">🔧</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        In Maintenance
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.maintenance}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Grid */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Vehicle Fleet ({vehicles.length} vehicles)
                            </h3>
                        </div>

                        {vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {vehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                                    >
                                        {/* Vehicle Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-3xl">
                                                    {getVehicleTypeIcon(
                                                        vehicle.vehicle_type
                                                    )}
                                                </span>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {vehicle.brand}{" "}
                                                        {vehicle.model}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {vehicle.year} •{" "}
                                                        {vehicle.vehicle_type}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                                    vehicle.status
                                                )}`}
                                            >
                                                {vehicle.status
                                                    .replace("_", " ")
                                                    .replace(/\b\w/g, (l) =>
                                                        l.toUpperCase()
                                                    )}
                                            </span>
                                        </div>

                                        {/* Vehicle Details */}
                                        <div className="space-y-3 mb-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Color:
                                                    </span>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {vehicle.color || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Seats:
                                                    </span>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {vehicle.seats || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Fuel:
                                                    </span>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {vehicle.fuel_type ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Transmission:
                                                    </span>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {vehicle.transmission ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            {vehicle.description && (
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                        Description:
                                                    </span>
                                                    <p className="text-gray-900 dark:text-gray-100 text-sm mt-1">
                                                        {vehicle.description}
                                                    </p>
                                                </div>
                                            )}

                                            {vehicle.features &&
                                                vehicle.features.length > 0 && (
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                            Features:
                                                        </span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {vehicle.features.map(
                                                                (
                                                                    feature,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full"
                                                                    >
                                                                        {
                                                                            feature
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        {/* Pricing */}
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Daily Rate:
                                                    </span>
                                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                        {formatCurrency(
                                                            vehicle.daily_rate
                                                        )}
                                                    </p>
                                                </div>
                                                {vehicle.hourly_rate && (
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            Hourly Rate:
                                                        </span>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(
                                                                vehicle.hourly_rate
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            {vehicle.security_deposit && (
                                                <div className="mt-2">
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                        Security Deposit:
                                                    </span>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(
                                                            vehicle.security_deposit
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Performance Stats */}
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                            <div className="grid grid-cols-3 gap-4 text-xs text-center">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">
                                                        Bookings
                                                    </span>
                                                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                        {vehicle.total_bookings}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">
                                                        Revenue
                                                    </span>
                                                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                        {formatCurrency(
                                                            vehicle.revenue_to_date
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">
                                                        Rating
                                                    </span>
                                                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                        {vehicle.rating
                                                            ? `${vehicle.rating}/5`
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                            <div className="flex space-x-2">
                                                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                                    📋 View Details
                                                </button>
                                                <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                                                    📅 Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🚗</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No Vehicles Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    This company doesn't have any vehicles in
                                    their fleet yet.
                                </p>
                                <Link
                                    href={route(
                                        "transportation.companies.show",
                                        company.id
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Back to Company
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
