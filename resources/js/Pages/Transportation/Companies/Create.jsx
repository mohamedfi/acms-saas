import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CreateCompany({
  serviceOptions,
  paymentMethods,
  coverageAreas,
}) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    logo: null,
    primary_email: "",
    primary_phone: "+20 ",
    website: "",
    address: "",
    city: "",
    country: "Egypt",
    services_offered: [],
    coverage_areas: [],
    minimum_rental_hours: 24,
    offers_insurance: false,
    offers_delivery: false,
    payment_methods: [],
    currency: "EGP",
    is_active: true,
    is_verified: false,
    is_featured: false,
  });

  // Country phone prefixes
  const countryPrefixes = {
    Egypt: "+20 ",
    UAE: "+971 ",
    "Saudi Arabia": "+966 ",
    Kuwait: "+965 ",
    Qatar: "+974 ",
    Bahrain: "+973 ",
    Oman: "+968 ",
  };

  // Handle country change with smart phone prefix
  const handleCountryChange = (country) => {
    setData("country", country);

    // Update phone prefix based on country
    const prefix = countryPrefixes[country] || "";
    const currentPhone = data.primary_phone;

    // Remove existing prefix and add new one
    const phoneWithoutPrefix = currentPhone.replace(/^\+\d+\s*/, "");
    setData("primary_phone", prefix + phoneWithoutPrefix);

    // Update currency based on country
    if (country === "Egypt") {
      setData("currency", "EGP");
    } else if (country === "UAE") {
      setData("currency", "AED");
    } else {
      setData("currency", "USD");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("transportation.companies.store"));
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

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          ➕ Add New Company
        </h2>
      }
    >
      <Head title="Add New Company" />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Add New Rental Company
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Create a new vehicle rental company with all necessary
                  details.
                </p>
              </div>
              <Link
                href={route("transportation.companies.index")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Companies
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                📋 Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setData("logo", e.target.files[0])}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                📞 Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={data.primary_email}
                    onChange={(e) => setData("primary_email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {countryPrefixes[data.country] || "+"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={data.primary_phone.replace(/^\+\d+\s*/, "")}
                      onChange={(e) => {
                        const prefix = countryPrefixes[data.country] || "+";
                        setData("primary_phone", prefix + e.target.value);
                      }}
                      className="w-full pl-16 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="1234567890"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Phone prefix automatically set based on selected country
                  </p>
                  {errors.primary_phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.primary_phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={data.website}
                    onChange={(e) => setData("website", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.website}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={data.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Country</option>
                    <option value="Egypt">🇪🇬 Egypt</option>
                    <option value="UAE">🇦🇪 UAE</option>
                    <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                    <option value="Kuwait">🇰🇼 Kuwait</option>
                    <option value="Qatar">🇶🇦 Qatar</option>
                    <option value="Bahrain">🇧🇭 Bahrain</option>
                    <option value="Oman">🇴🇲 Oman</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.currency}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Auto-set
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Currency automatically set based on selected country
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => setData("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Link
                href={route("transportation.companies.index")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {processing ? "Creating..." : "Create Company"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
