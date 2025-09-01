import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ShowCompany({ company, stats }) {
    const formatCurrency = (amount) => {
        if (!amount) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: company.currency || "AED",
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

    const getContactTypeBadge = (type) => {
        const badges = {
            primary:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            sales: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            support:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            emergency:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            general:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        };
        return (
            badges[type] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🏢 Company Details
                </h2>
            }
        >
            <Head title={company.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {company.name}
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    {company.description ||
                                        "No description available"}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route(
                                        "transportation.companies.index"
                                    )}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Companies
                                </Link>
                                <Link
                                    href={route(
                                        "transportation.companies.edit",
                                        company.id
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    ✏️ Edit Company
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Company Status Badges */}
                    <div className="mb-8 flex flex-wrap gap-3">
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                company.is_active
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                        >
                            {company.is_active ? "✅ Active" : "❌ Inactive"}
                        </span>
                        {company.is_verified && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                ✓ Verified Partner
                            </span>
                        )}
                        {company.is_featured && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                ⭐ Featured Company
                            </span>
                        )}
                        {company.rating && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                ⭐ {company.rating}/5 ({company.total_reviews}{" "}
                                reviews)
                            </span>
                        )}
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
                                        {stats.vehicles.total}
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
                                        {stats.vehicles.available}
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
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Contacts
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.contacts.total}
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
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Revenue
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(
                                            stats.performance.total_revenue
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Company Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Company Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Registration Number
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.registration_number ||
                                                "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Tax ID
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.tax_id || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            License Number
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.license_number || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            License Expiry
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.license_expiry
                                                ? new Date(
                                                      company.license_expiry
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Primary Email
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.primary_email ? (
                                                <a
                                                    href={`mailto:${company.primary_email}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.primary_email}
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Primary Phone
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.primary_phone ? (
                                                <a
                                                    href={`tel:${company.primary_phone}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.primary_phone}
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Website
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.website ? (
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.website}
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Address
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {company.address
                                                ? `${company.address}, ${company.city}, ${company.state} ${company.postal_code}, ${company.country}`
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Services & Coverage */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Services & Coverage
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                            Services Offered
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {company.services_offered &&
                                            company.services_offered.length >
                                                0 ? (
                                                company.services_offered.map(
                                                    (service) => (
                                                        <span
                                                            key={service}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full"
                                                        >
                                                            {service
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (l) =>
                                                                        l.toUpperCase()
                                                                )}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    No services specified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                            Coverage Areas
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {company.coverage_areas &&
                                            company.coverage_areas.length >
                                                0 ? (
                                                company.coverage_areas.map(
                                                    (area) => (
                                                        <span
                                                            key={area}
                                                            className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full"
                                                        >
                                                            {area}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    No coverage areas specified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Business Hours
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {company.business_hours &&
                                        Object.entries(
                                            company.business_hours
                                        ).map(([day, hours]) => (
                                            <div
                                                key={day}
                                                className="text-center"
                                            >
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                                    {day}
                                                </div>
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {hours === "closed"
                                                        ? "Closed"
                                                        : hours}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route(
                                            "transportation.companies.vehicles",
                                            company.id
                                        )}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        🚗 View Vehicles
                                    </Link>
                                    <Link
                                        href={route(
                                            "transportation.companies.contacts",
                                            company.id
                                        )}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        👥 View Contacts
                                    </Link>
                                    <Link
                                        href={route(
                                            "transportation.companies.edit",
                                            company.id
                                        )}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        ✏️ Edit Company
                                    </Link>
                                </div>
                            </div>

                            {/* Company Stats */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Company Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Minimum Rental Hours
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {company.minimum_rental_hours ||
                                                "N/A"}{" "}
                                            hours
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Security Deposit
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(
                                                company.security_deposit
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Cancellation Fee
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(
                                                company.cancellation_fee
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Total Bookings
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {stats.performance.total_bookings}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Features
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span
                                            className={`w-3 h-3 rounded-full mr-2 ${
                                                company.offers_insurance
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Insurance Coverage
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span
                                            className={`w-3 h-3 rounded-full mr-2 ${
                                                company.offers_delivery
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Delivery Service
                                        </span>
                                    </div>
                                    {company.offers_delivery &&
                                        company.delivery_fee && (
                                            <div className="ml-5 text-sm text-gray-500 dark:text-gray-400">
                                                Delivery Fee:{" "}
                                                {formatCurrency(
                                                    company.delivery_fee
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
