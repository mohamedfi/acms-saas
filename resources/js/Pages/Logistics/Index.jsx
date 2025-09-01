import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Index() {
    const [logistics, setLogistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        // Mock data for now - replace with actual API call
        const mockData = [
            {
                id: 1,
                type: "flight",
                participant_name: "John Doe",
                status: "confirmed",
                details: "NYC → Paris, Flight AF007",
                amount: 850,
                date: "2024-08-20",
            },
            {
                id: 2,
                type: "hotel",
                participant_name: "Jane Smith",
                status: "pending",
                details: "Hotel Marriott, 3 nights",
                amount: 450,
                date: "2024-08-21",
            },
            {
                id: 3,
                type: "visa",
                participant_name: "Mohamed Dawd",
                status: "processing",
                details: "Business Visa Application",
                date: "2024-08-15",
            },
        ];

        setTimeout(() => {
            setLogistics(mockData);
            setLoading(false);
        }, 500);
    }, []);

    const getStatusBadge = (status) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case "confirmed":
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case "pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            case "processing":
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
            case "cancelled":
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "flight":
                return "✈️";
            case "hotel":
                return "🏨";
            case "transport":
                return "🚗";
            case "visa":
                return "📋";
            case "per_diem":
                return "💰";
            default:
                return "📦";
        }
    };

    const filteredLogistics =
        activeTab === "all"
            ? logistics
            : logistics.filter(
                  (item) =>
                      (activeTab === "flights" && item.type === "flight") ||
                      (activeTab === "hotels" && item.type === "hotel") ||
                      (activeTab === "transport" &&
                          item.type === "transport") ||
                      (activeTab === "visas" && item.type === "visa") ||
                      (activeTab === "per_diems" && item.type === "per_diem")
              );

    // Action handlers
    const handleView = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };

    const handleDelete = (item) => {
        // Confirm deletion
        if (
            confirm(
                `Are you sure you want to delete this ${item.type} entry for ${item.participant_name}?\n\nThis action cannot be undone.`
            )
        ) {
            // Remove item from local state
            setLogistics((prevLogistics) =>
                prevLogistics.filter((log) => log.id !== item.id)
            );
            // In a real app, this would make an API call to delete from database
            alert(
                `${item.type} entry for ${item.participant_name} has been deleted.`
            );
        }
    };

    const tabs = [
        { key: "all", label: "All", icon: "📦" },
        { key: "flights", label: "Flights", icon: "✈️" },
        { key: "hotels", label: "Hotels", icon: "🏨" },
        { key: "transport", label: "Transport", icon: "🚗" },
        { key: "visas", label: "Visas", icon: "📋" },
        { key: "per_diems", label: "Per Diems", icon: "💰" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        🚀 Logistics Management
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={route("logistics.bookings.create")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            + New Booking
                        </Link>
                        <Link
                            href={route("logistics.reports")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            📊 Reports
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Logistics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href={route("logistics.bookings")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-3xl">🚌</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Transportation Bookings
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Manage course transportation and
                                        logistics
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("logistics.bookings.create")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-3xl">➕</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        New Booking
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Create new transportation booking
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route("logistics.reports")}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Reports & Analytics
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        View logistics performance reports
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.key
                                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                        }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <span className="ml-2">
                                        Loading logistics...
                                    </span>
                                </div>
                            ) : filteredLogistics.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        🚀
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No logistics items found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Get started by creating your first
                                        logistics item.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Participant
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Details
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {filteredLogistics.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-2xl mr-3">
                                                                {getTypeIcon(
                                                                    item.type
                                                                )}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                                                                {item.type.replace(
                                                                    "_",
                                                                    " "
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {
                                                                item.participant_name
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {item.details}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {new Date(
                                                                item.date
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {item.amount
                                                                ? `$${item.amount}`
                                                                : "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={getStatusBadge(
                                                                item.status
                                                            )}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleView(
                                                                        item
                                                                    )
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                                                            >
                                                                👁️ View
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        item
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:underline"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                View {selectedItem.type} Details
                            </h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Participant:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {selectedItem.participant_name}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Details:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {selectedItem.details}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Date:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {new Date(
                                        selectedItem.date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Status:
                                </span>
                                <span
                                    className={getStatusBadge(
                                        selectedItem.status
                                    )}
                                >
                                    {selectedItem.status}
                                </span>
                            </div>
                            {selectedItem.amount && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Amount:
                                    </span>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        ${selectedItem.amount}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Edit {selectedItem.type} Details
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Participant:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {selectedItem.participant_name}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Details:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {selectedItem.details}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Date:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {new Date(
                                        selectedItem.date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Status:
                                </span>
                                <span
                                    className={getStatusBadge(
                                        selectedItem.status
                                    )}
                                >
                                    {selectedItem.status}
                                </span>
                            </div>
                            {selectedItem.amount && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Amount:
                                    </span>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        ${selectedItem.amount}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // In a real app, this would save changes
                                    alert("Changes would be saved here");
                                    setShowEditModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
