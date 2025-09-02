import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function PricingIndex({
    prices,
    companies,
    vehicleTypes,
    capacities,
    fromLocations,
    toLocations,
    priceTypes,
    stats,
    filters,
}) {
    const { data, setData, get } = useForm({
        company_id: filters.company_id || "",
        vehicle_type: filters.vehicle_type || "",
        capacity: filters.capacity || "",
        from_location: filters.from_location || "",
        to_location: filters.to_location || "",
        price_type: filters.price_type || "",
        is_active: filters.is_active || "",
        min_price: filters.min_price || "",
        max_price: filters.max_price || "",
    });

    const handleFilter = () => {
        get(route("transportation.pricing.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setData({
            company_id: "",
            vehicle_type: "",
            capacity: "",
            from_location: "",
            to_location: "",
            price_type: "",
            is_active: "",
            min_price: "",
            max_price: "",
        });
        get(route("transportation.pricing.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (amount, currency = "AED") => {
        if (!amount) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    const getStatusBadge = (price) => {
        if (!price.is_active) {
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200";
        }
        if (!price.is_available) {
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200";
        }
        if (!price.is_currently_valid) {
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200";
        }
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200";
    };

    const getStatusText = (price) => {
        if (!price.is_active) return "Inactive";
        if (!price.is_available) return "Unavailable";
        if (!price.is_currently_valid) return "Not Valid Now";
        return "Active";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    💰 Rental Car Pricing Management
                </h2>
            }
        >
            <Head title="Rental Car Pricing" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Rental Car Pricing
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage route-based pricing for rental car
                                    companies
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route(
                                        "transportation.pricing.create"
                                    )}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    ➕ Add Pricing Rule
                                </Link>
                                <Link
                                    href={route(
                                        "transportation.companies.index"
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    🏢 Companies
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Pricing Rules
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.total_prices}
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
                                        Active Rules
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.active_prices}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-2xl">🏢</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Companies with Pricing
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {stats.companies_with_pricing}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Average Price
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(stats.average_price)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                🔍 Filter Pricing Rules
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Company
                                    </label>
                                    <select
                                        value={data.company_id}
                                        onChange={(e) =>
                                            setData(
                                                "company_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">All Companies</option>
                                        {companies.map((company) => (
                                            <option
                                                key={company.id}
                                                value={company.id}
                                            >
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vehicle Type
                                    </label>
                                    <select
                                        value={data.vehicle_type}
                                        onChange={(e) =>
                                            setData(
                                                "vehicle_type",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">All Types</option>
                                        {vehicleTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Capacity
                                    </label>
                                    <select
                                        value={data.capacity}
                                        onChange={(e) =>
                                            setData("capacity", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">All Capacities</option>
                                        {capacities.map((capacity) => (
                                            <option
                                                key={capacity}
                                                value={capacity}
                                            >
                                                {capacity} seats
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Location
                                    </label>
                                    <input
                                        type="text"
                                        value={data.from_location}
                                        onChange={(e) =>
                                            setData(
                                                "from_location",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Airport"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        To Location
                                    </label>
                                    <input
                                        type="text"
                                        value={data.to_location}
                                        onChange={(e) =>
                                            setData(
                                                "to_location",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Dokki"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price Type
                                    </label>
                                    <select
                                        value={data.price_type}
                                        onChange={(e) =>
                                            setData(
                                                "price_type",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">All Types</option>
                                        {priceTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type
                                                    .replace("_", " ")
                                                    .toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Min Price (AED)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.min_price}
                                        onChange={(e) =>
                                            setData("min_price", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Max Price (AED)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.max_price}
                                        onChange={(e) =>
                                            setData("max_price", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="1000"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleFilter}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    🔍 Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    🗑️ Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Rules Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Pricing Rules ({prices.total} total)
                            </h3>
                        </div>

                        {prices.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Company & Vehicle
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Route
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Price
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
                                        {prices.data.map((price) => (
                                            <tr
                                                key={price.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {
                                                                price
                                                                    .rental_company
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {price.vehicle_type}{" "}
                                                            ({price.capacity}{" "}
                                                            seats)
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {price.route_display}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(
                                                            price.price,
                                                            price.currency
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {price.price_type.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                                            price
                                                        )}`}
                                                    >
                                                        {getStatusText(price)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route(
                                                                "transportation.pricing.show",
                                                                price.id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "transportation.pricing.edit",
                                                                price.id
                                                            )}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">💰</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No Pricing Rules Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {Object.values(filters).some((f) => f)
                                        ? "No pricing rules match your current filters."
                                        : "No pricing rules have been created yet."}
                                </p>
                                <Link
                                    href={route(
                                        "transportation.pricing.create"
                                    )}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    ➕ Create First Pricing Rule
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {prices.data.length > 0 && prices.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {prices.from} to {prices.to} of{" "}
                                        {prices.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {prices.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
