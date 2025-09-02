import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function CompaniesIndex({ companies, stats }) {
  const { flash } = usePage().props;
  const toggleForm = useForm();

  const handleToggleStatus = (companyId) => {
    toggleForm.patch(
      route("transportation.companies.toggle-status", companyId)
    );
  };

  const handleToggleVerification = (companyId) => {
    toggleForm.patch(
      route("transportation.companies.toggle-verification", companyId)
    );
  };

  const handleToggleFeatured = (companyId) => {
    toggleForm.patch(
      route("transportation.companies.toggle-featured", companyId)
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          🏢 Rental Companies
        </h2>
      }
    >
      <Head title="Rental Companies" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Success/Error Messages */}
          {flash.success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200">
                {flash.success}
              </p>
            </div>
          )}
          {flash.error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{flash.error}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Rental Companies Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage vehicle rental companies, their fleets, contacts, and
                partnerships.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={route("transportation.reports")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>📊</span>
                <span>View Reports</span>
              </Link>
              <Link
                href={route("transportation.companies.create")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                ➕ Add New Company
              </Link>
              <Link
                href={route("transportation.index")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                ← Back to Transportation
              </Link>
            </div>
          </div>

          {/* Add Vehicle Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  🚗 Add New Vehicle
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select a company below to add a new vehicle with complete
                  pricing, features, and specifications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full">
                    ✓ Pricing & Rates
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                    ✓ Vehicle Features
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                    ✓ Status Management
                  </span>
                </div>
              </div>
              <div className="text-6xl opacity-20">🚗</div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <span className="text-lg">🏢</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.total_companies}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                  <span className="text-lg">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.active_companies}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                  <span className="text-lg">🎖️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Verified
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.verified_companies}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                  <span className="text-lg">⭐</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Featured
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.featured_companies}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded">
                  <span className="text-lg">🚗</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Vehicles
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.total_vehicles}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded">
                  <span className="text-lg">🟢</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Available
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.available_vehicles}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className={`bg-white dark:bg-gray-800 shadow rounded-xl border-2 transition-all hover:shadow-lg ${
                  company.is_featured
                    ? "border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800"
                    : company.is_active
                    ? "border-green-200 dark:border-green-800"
                    : "border-red-200 dark:border-red-800"
                }`}
              >
                {/* Company Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {company.logo ? (
                        <img
                          src={`/storage/${company.logo}`}
                          alt={company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🏢</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {company.name}
                        </h3>
                        {company.rating && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {company.rating_stars}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${company.status_badge.class}`}
                      >
                        {company.status_badge.text}
                      </span>
                      {company.is_featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {company.description}
                    </p>
                  )}

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {company.city && (
                      <p>
                        <span className="font-medium">📍 Location:</span>{" "}
                        {company.city}
                        {company.state && `, ${company.state}`}
                      </p>
                    )}
                    {company.primary_phone && (
                      <p>
                        <span className="font-medium">📞 Phone:</span>{" "}
                        {company.primary_phone}
                      </p>
                    )}
                    {company.primary_email && (
                      <p>
                        <span className="font-medium">📧 Email:</span>{" "}
                        {company.primary_email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vehicle Statistics */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Fleet Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Vehicles
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {company.vehicles_count || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Available
                      </p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {company.available_vehicles_count || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {company.services_offered &&
                  company.services_offered.length > 0 && (
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Services
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {company.services_offered
                          .slice(0, 3)
                          .map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded"
                            >
                              {service.replace("_", " ")}
                            </span>
                          ))}
                        {company.services_offered.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            +{company.services_offered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="p-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Link
                        href={route(
                          "transportation.companies.show",
                          company.id
                        )}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        👁️ View Details
                      </Link>
                      <Link
                        href={route(
                          "transportation.companies.edit",
                          company.id
                        )}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-center rounded text-sm hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        ✏️ Edit
                      </Link>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={route(
                          "transportation.companies.vehicles.create",
                          company.id
                        )}
                        className="flex-1 px-3 py-2 bg-orange-600 text-white text-center rounded text-sm hover:bg-orange-700 transition-colors font-semibold cursor-pointer"
                      >
                        🚗 Add Vehicle
                      </Link>
                      <Link
                        href={route(
                          "transportation.companies.vehicles",
                          company.id
                        )}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white text-center rounded text-sm hover:bg-purple-700 transition-colors cursor-pointer"
                      >
                        📋 Manage Fleet
                      </Link>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleStatus(company.id)}
                        disabled={toggleForm.processing}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          company.is_active
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {company.is_active ? "🚫 Deactivate" : "✅ Activate"}
                      </button>

                      <button
                        onClick={() => handleToggleVerification(company.id)}
                        disabled={toggleForm.processing}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          company.is_verified
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {company.is_verified ? "🎖️ Verified" : "⏳ Verify"}
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleFeatured(company.id)}
                      disabled={toggleForm.processing}
                      className={`w-full px-3 py-2 rounded text-sm transition-colors ${
                        company.is_featured
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {company.is_featured
                        ? "⭐ Remove Featured"
                        : "⭐ Make Featured"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {companies.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Rental Companies
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start building your rental network by adding your first company
                partner.
              </p>
              <Link
                href={route("transportation.companies.create")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
              >
                ➕ Add First Company
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
