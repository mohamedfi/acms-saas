import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function TransportationIndex({ vehicles, stats }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          🚗 Vehicle Rental Management
        </h2>
      }
    >
      <Head title="Vehicle Rental" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Vehicle Rental Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your fleet, track rentals, and monitor maintenance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    {stats.total_vehicles}
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
                    {stats.available_vehicles}
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
                    {stats.rented_vehicles}
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
                    {stats.maintenance_vehicles}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href={route("transportation.companies.index")}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow transition-colors"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🚗</div>
                <h3 className="text-lg font-semibold mb-2">Add New Vehicle</h3>
                <p className="text-blue-100 text-sm">
                  Register a new vehicle to your fleet
                </p>
              </div>
            </Link>

            <Link
              href={route("transportation.bookings.create")}
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow transition-colors"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-semibold mb-2">Create Booking</h3>
                <p className="text-green-100 text-sm">
                  Book a vehicle for a customer
                </p>
              </div>
            </Link>

            <Link
              href={route("transportation.maintenance")}
              className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-lg shadow transition-colors"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold mb-2">
                  Schedule Maintenance
                </h3>
                <p className="text-orange-100 text-sm">
                  Schedule vehicle maintenance
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link
              href={route("transportation.reports")}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  📊
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Reports & Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  View detailed analytics and reports
                </p>
                <div className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view →
                </div>
              </div>
            </Link>

            <Link
              href={route("transportation.vehicles")}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  🚙
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Fleet Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  Manage all vehicles in your fleet
                </p>
                <div className="mt-3 text-green-600 dark:text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to manage →
                </div>
              </div>
            </Link>

            <Link
              href={route("transportation.bookings")}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  📋
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Bookings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  View and manage all rental bookings
                </p>
                <div className="mt-3 text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view →
                </div>
              </div>
            </Link>

            <Link
              href={route("transportation.maintenance")}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  🔧
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Maintenance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  Track vehicle maintenance records
                </p>
                <div className="mt-3 text-orange-600 dark:text-orange-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to track →
                </div>
              </div>
            </Link>

            <Link
              href={route("transportation.companies.index")}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  🏢
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Rental Companies
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  Manage rental company partnerships
                </p>
                <div className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to manage →
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          {vehicles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recent Fleet Activity
              </h2>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.slice(0, 6).map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {vehicle.display_name}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {vehicle.license_plate}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {vehicle.color} • {vehicle.seats} seats
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {vehicle.rate_display}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {vehicle.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back to Operations */}
          <div className="mt-8 text-center">
            <Link
              href={route("catering.index")}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Operations Dashboard
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
