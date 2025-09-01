import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function EditCompany({
    company,
    serviceOptions,
    paymentMethods,
    coverageAreas,
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || "",
        description: company.description || "",
        logo: null,
        primary_email: company.primary_email || "",
        primary_phone: company.primary_phone || "",
        website: company.website || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        postal_code: company.postal_code || "",
        country: company.country || "",
        registration_number: company.registration_number || "",
        tax_id: company.tax_id || "",
        license_number: company.license_number || "",
        license_expiry: company.license_expiry || "",
        services_offered: company.services_offered || [],
        coverage_areas: company.coverage_areas || [],
        minimum_rental_hours: company.minimum_rental_hours || 24,
        offers_insurance: company.offers_insurance || false,
        offers_delivery: company.offers_delivery || false,
        delivery_fee: company.delivery_fee || "",
        security_deposit: company.security_deposit || "",
        payment_methods: company.payment_methods || [],
        currency: company.currency || "AED",
        cancellation_fee: company.cancellation_fee || "",
        cancellation_hours: company.cancellation_hours || "",
        terms_and_conditions: company.terms_and_conditions || "",
        cancellation_policy: company.cancellation_policy || "",
        damage_policy: company.damage_policy || "",
        business_hours: company.business_hours || {
            monday: "08:00-18:00",
            tuesday: "08:00-18:00",
            wednesday: "08:00-18:00",
            thursday: "08:00-18:00",
            friday: "08:00-18:00",
            saturday: "09:00-17:00",
            sunday: "09:00-17:00",
        },
        is_active: company.is_active || true,
        is_verified: company.is_verified || false,
        is_featured: company.is_featured || false,
        internal_notes: company.internal_notes || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("transportation.companies.update", company.id));
    };

    const toggleService = (service) => {
        const newServices = data.services_offered.includes(service)
            ? data.services_offered.filter((s) => s !== service)
            : [...data.services_offered, service];
        setData("services_offered", newServices);
    };

    const toggleCoverageArea = (area) => {
        const newAreas = data.coverage_areas.includes(area)
            ? data.coverage_areas.filter((a) => a !== area)
            : [...data.coverage_areas, area];
        setData("coverage_areas", newAreas);
    };

    const togglePaymentMethod = (method) => {
        const newMethods = data.payment_methods.includes(method)
            ? data.payment_methods.filter((m) => m !== method)
            : [...data.payment_methods, method];
        setData("payment_methods", newMethods);
    };

    const updateBusinessHours = (day, hours) => {
        setData("business_hours", {
            ...data.business_hours,
            [day]: hours,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    ✏️ Edit Company
                </h2>
            }
        >
            <Head title={`Edit ${company.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Edit Rental Company
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Update company information, services, and
                                    policies.
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
                                        "transportation.companies.index"
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    All Companies
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Logo
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setData(
                                                    "logo",
                                                    e.target.files[0]
                                                )
                                            }
                                            accept="image/*"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {company.logo && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Current logo: {company.logo}
                                            </p>
                                        )}
                                        {errors.logo && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.logo}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Describe your company and services..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Primary Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.primary_email}
                                            onChange={(e) =>
                                                setData(
                                                    "primary_email",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.primary_email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.primary_email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Primary Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={data.primary_phone}
                                            onChange={(e) =>
                                                setData(
                                                    "primary_phone",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.primary_phone && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.primary_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData(
                                                    "website",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="https://example.com"
                                        />
                                        {errors.website && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.website}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Address Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            State/Province
                                        </label>
                                        <input
                                            type="text"
                                            value={data.state}
                                            onChange={(e) =>
                                                setData("state", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) =>
                                                setData(
                                                    "postal_code",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.postal_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.postal_code}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={data.country}
                                            onChange={(e) =>
                                                setData(
                                                    "country",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.country && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Business Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Business Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            value={data.registration_number}
                                            onChange={(e) =>
                                                setData(
                                                    "registration_number",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.registration_number && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.registration_number}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tax ID
                                        </label>
                                        <input
                                            type="text"
                                            value={data.tax_id}
                                            onChange={(e) =>
                                                setData(
                                                    "tax_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.tax_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.tax_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            value={data.license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "license_number",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.license_number && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.license_number}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            License Expiry
                                        </label>
                                        <input
                                            type="date"
                                            value={data.license_expiry}
                                            onChange={(e) =>
                                                setData(
                                                    "license_expiry",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.license_expiry && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.license_expiry}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Services and Coverage */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Services & Coverage
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Services Offered
                                        </label>
                                        <div className="space-y-2">
                                            {Object.entries(serviceOptions).map(
                                                ([key, label]) => (
                                                    <label
                                                        key={key}
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.services_offered.includes(
                                                                key
                                                            )}
                                                            onChange={() =>
                                                                toggleService(
                                                                    key
                                                                )
                                                            }
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {label}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                        {errors.services_offered && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.services_offered}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Coverage Areas
                                        </label>
                                        <div className="space-y-2">
                                            {Object.entries(coverageAreas).map(
                                                ([key, label]) => (
                                                    <label
                                                        key={key}
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.coverage_areas.includes(
                                                                key
                                                            )}
                                                            onChange={() =>
                                                                toggleCoverageArea(
                                                                    key
                                                                )
                                                            }
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {label}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                        {errors.coverage_areas && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.coverage_areas}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Business Hours
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(data.business_hours).map(
                                        ([day, hours]) => (
                                            <div key={day}>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                                    {day}
                                                </label>
                                                <select
                                                    value={hours}
                                                    onChange={(e) =>
                                                        updateBusinessHours(
                                                            day,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="closed">
                                                        Closed
                                                    </option>
                                                    <option value="08:00-18:00">
                                                        08:00-18:00
                                                    </option>
                                                    <option value="09:00-17:00">
                                                        09:00-17:00
                                                    </option>
                                                    <option value="10:00-19:00">
                                                        10:00-19:00
                                                    </option>
                                                    <option value="24/7">
                                                        24/7
                                                    </option>
                                                </select>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Status and Settings */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Status & Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    "is_active",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Active Company
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_verified}
                                            onChange={(e) =>
                                                setData(
                                                    "is_verified",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Verified Partner
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData(
                                                    "is_featured",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Featured Company
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route(
                                        "transportation.companies.show",
                                        company.id
                                    )}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing
                                        ? "Updating Company..."
                                        : "Update Company"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
