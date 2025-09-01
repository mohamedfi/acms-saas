import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function LogisticsBookings() {
    // Mock data for demonstration - in real app this would come from props
    const bookings = [
        {
            id: 1,
            course_name: "Advanced Project Management",
            transport_type: "Bus",
            pickup_date: "2024-01-15",
            pickup_time: "08:00",
            return_date: "2024-01-15",
            return_time: "17:00",
            pickup_location: "Dubai Mall",
            dropoff_location: "Business Bay",
            passenger_count: 25,
            status: "confirmed",
            special_requirements: "Wheelchair accessible",
        },
        {
            id: 2,
            course_name: "Digital Marketing Fundamentals",
            transport_type: "Van",
            pickup_date: "2024-01-16",
            pickup_time: "09:00",
            return_date: "2024-01-16",
            return_time: "16:00",
            pickup_location: "Abu Dhabi Airport",
            dropoff_location: "Yas Island",
            passenger_count: 8,
            status: "pending",
            special_requirements: null,
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            pending:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            confirmed:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            cancelled:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            completed:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
        return (
            badges[status] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        );
    };

    const getTransportIcon = (type) => {
        const icons = {
            bus: "🚌",
            car: "🚗",
            van: "🚐",
            other: "🚚",
        };
        return icons[type] || "🚚";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🚌 Logistics Bookings
                </h2>
            }
        >
            <Head title="Logistics Bookings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Transportation Bookings
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage course transportation and logistics
                                    bookings.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route("logistics.bookings.create")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    ➕ New Booking
                                </Link>
                                <Link
                                    href={route("logistics.index")}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Logistics
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Bookings
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {bookings.length}
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
                                        Confirmed
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {
                                            bookings.filter(
                                                (b) => b.status === "confirmed"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <span className="text-2xl">⏳</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Pending
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {
                                            bookings.filter(
                                                (b) => b.status === "pending"
                                            ).length
                                        }
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
                                        Total Passengers
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {bookings.reduce(
                                            (sum, b) => sum + b.passenger_count,
                                            0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Recent Bookings
                            </h3>
                        </div>

                        {bookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Transport
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Locations
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Passengers
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
                                        {bookings.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {booking.course_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className="text-2xl mr-2">
                                                            {getTransportIcon(
                                                                booking.transport_type
                                                            )}
                                                        </span>
                                                        <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                                                            {
                                                                booking.transport_type
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        <div>
                                                            {new Date(
                                                                booking.pickup_date
                                                            ).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400">
                                                            {
                                                                booking.pickup_time
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                booking.return_time
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        <div className="font-medium">
                                                            From:
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400">
                                                            {
                                                                booking.pickup_location
                                                            }
                                                        </div>
                                                        <div className="font-medium mt-1">
                                                            To:
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400">
                                                            {
                                                                booking.dropoff_location
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {
                                                                booking.passenger_count
                                                            }{" "}
                                                            people
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            booking.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                            👁️ View
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                                            ✏️ Edit
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🚌</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No Bookings Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Transportation bookings will appear here
                                    once they are created.
                                </p>
                                <Link
                                    href={route("logistics.bookings.create")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Create First Booking
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
