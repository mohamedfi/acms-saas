import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({
    messages = { data: [] },
    templates = [],
    stats = {},
}) {
    // Debug logging
    console.log("Messages Index Props:", { messages, templates, stats });
    const getStatusBadge = (status) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case "sent":
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case "delivered":
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
            case "pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            case "failed":
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        }
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "email":
                return "📧";
            case "sms":
                return "💬";
            case "whatsapp":
                return "📱";
            case "in_app":
                return "🔔";
            default:
                return "📨";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "course":
                return "📚";
            case "task":
                return "📋";
            case "announcement":
                return "📢";
            case "reminder":
                return "⏰";
            case "welcome":
                return "👋";
            case "confirmation":
                return "✅";
            default:
                return "📝";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📨 Messages Dashboard
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("messages.create")}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ✉️ New Message
                        </Link>
                        <Link
                            href={route("message-templates.create")}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            📝 New Template
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Messages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats?.total || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Messages
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {stats?.pending || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Pending
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats?.sent || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Sent
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {stats?.delivered || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Delivered
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {stats?.failed || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Failed
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Recent Messages
                                </h3>
                                <Link
                                    href={route("messages.create")}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>

                            {messages.data && messages.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Recipient
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Channel
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Sent
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {messages.data.map((message) => (
                                                <tr
                                                    key={message.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {message.recipient_name ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {
                                                                    message.recipient_value
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-lg mr-2">
                                                                {getChannelIcon(
                                                                    message.channel
                                                                )}
                                                            </span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                                {
                                                                    message.channel
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-lg mr-2">
                                                                {getCategoryIcon(
                                                                    message.category
                                                                )}
                                                            </span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                                {
                                                                    message.category
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={getStatusBadge(
                                                                message.status
                                                            )}
                                                        >
                                                            {message.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(
                                                            message.sent_at ||
                                                                message.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "messages.show",
                                                                message.id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                                        >
                                                            👁️ View
                                                        </Link>
                                                        {message.status ===
                                                            "failed" && (
                                                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                                                🔄 Resend
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📨</div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No messages yet
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Start communicating with your team and
                                        participants by sending your first
                                        message.
                                    </p>
                                    <Link
                                        href={route("messages.create")}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ✉️ Send Your First Message
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Templates Section */}
                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Message Templates
                                </h3>
                                <Link
                                    href={route("message-templates.create")}
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>

                            {templates && templates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-2">
                                                        {template.category_icon ||
                                                            getCategoryIcon(
                                                                template.category
                                                            )}
                                                    </span>
                                                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                        {template.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                    {template.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {template.description ||
                                                    "No description available"}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {template.channel_icon ||
                                                        getChannelIcon(
                                                            template.channel
                                                        )}{" "}
                                                    {template.channel}
                                                </span>
                                                <Link
                                                    href={route(
                                                        "messages.create",
                                                        {
                                                            template:
                                                                template.id,
                                                        }
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                                >
                                                    Use Template →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">📝</div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        No message templates available yet.
                                    </p>
                                    <Link
                                        href={route("message-templates.create")}
                                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                                    >
                                        📝 Create Your First Template
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
