import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function CompanyContacts({ company, contacts, stats }) {
    const getContactTypeBadge = (type) => {
        const badges = {
            primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            sales: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            support: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            emergency: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };
        return badges[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            1: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            2: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            4: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            5: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };
        return badges[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            1: 'Critical',
            2: 'High',
            3: 'Medium',
            4: 'Low',
            5: 'Minimal',
        };
        return labels[priority] || 'Unknown';
    };

    const formatTime = (time) => {
        if (!time) return 'N/A';
        return time;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    👥 Company Contacts
                </h2>
            }
        >
            <Head title={`${company.name} - Contacts`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {company.name} - Contact Team
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage and view all company contacts and personnel
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('transportation.companies.show', company.id)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Company
                                </Link>
                                <Link
                                    href={route('transportation.companies.index')}
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
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.active}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.primary}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <span className="text-2xl">🚨</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.emergency}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Type Breakdown */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Contacts by Type
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(stats.by_type).map(([type, count]) => (
                                <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{count}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {type.replace('_', ' ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contacts Grid */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Contact Team ({contacts.length} contacts)
                            </h3>
                        </div>
                        
                        {contacts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {contacts.map((contact) => (
                                    <div key={contact.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                        {/* Contact Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                    <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                                        {contact.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {contact.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {contact.title || 'No Title'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContactTypeBadge(contact.contact_type)}`}>
                                                    {contact.contact_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(contact.priority_level)}`}>
                                                    {getPriorityLabel(contact.priority_level)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="space-y-3 mb-4">
                                            {contact.email && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-400">📧</span>
                                                    <a 
                                                        href={`mailto:${contact.email}`}
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        {contact.email}
                                                    </a>
                                                </div>
                                            )}

                                            {contact.phone && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-400">📞</span>
                                                    <a 
                                                        href={`tel:${contact.phone}`}
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        {contact.phone}
                                                    </a>
                                                </div>
                                            )}

                                            {contact.mobile && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-400">📱</span>
                                                    <a 
                                                        href={`tel:${contact.mobile}`}
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        {contact.mobile}
                                                    </a>
                                                </div>
                                            )}

                                            {contact.whatsapp && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-400">💬</span>
                                                    <a 
                                                        href={`https://wa.me/${contact.whatsapp}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:underline text-sm"
                                                    >
                                                        WhatsApp
                                                    </a>
                                                </div>
                                            )}

                                            {contact.direct_line && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-400">☎️</span>
                                                    <a 
                                                        href={`tel:${contact.direct_line}`}
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        Direct: {contact.direct_line}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional Information */}
                                        <div className="space-y-3 mb-4">
                                            {contact.languages_spoken && contact.languages_spoken.length > 0 && (
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">Languages:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {contact.languages_spoken.map((language, index) => (
                                                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs rounded-full">
                                                                {language}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {contact.notes && (
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">Notes:</span>
                                                    <p className="text-gray-900 dark:text-gray-100 text-sm mt-1">{contact.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Indicators */}
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`w-3 h-3 rounded-full ${contact.is_primary ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                                    <span className="text-gray-600 dark:text-gray-400">Primary Contact</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`w-3 h-3 rounded-full ${contact.emergency_contact ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                                    <span className="text-gray-600 dark:text-gray-400">Emergency</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`w-3 h-3 rounded-full ${contact.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {contact.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Available Hours */}
                                        {contact.available_hours && Object.keys(contact.available_hours).length > 0 && (
                                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
                                                <span className="text-gray-500 dark:text-gray-400 text-sm block mb-2">Available Hours:</span>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(contact.available_hours).slice(0, 4).map(([day, hours]) => (
                                                        <div key={day} className="text-center">
                                                            <div className="text-gray-500 dark:text-gray-400 capitalize">{day}</div>
                                                            <div className="text-gray-900 dark:text-gray-100">{formatTime(hours)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                            <div className="flex space-x-2">
                                                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                                    ✏️ Edit
                                                </button>
                                                <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                                                    📞 Call
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No Contacts Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    This company doesn't have any contacts added yet.
                                </p>
                                <Link
                                    href={route('transportation.companies.show', company.id)}
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
