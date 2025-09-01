import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function CreateOrder({ services, courses }) {
    const { data, setData, post, processing, errors } = useForm({
        event_name: "",
        event_date: "",
        expected_attendees: 1,
        course_id: "",
        special_requirements: "",
        services: [],
    });

    const [selectedServices, setSelectedServices] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("catering.orders.store"));
    };

    const toggleService = (serviceId) => {
        const newSelection = selectedServices.includes(serviceId)
            ? selectedServices.filter(id => id !== serviceId)
            : [...selectedServices, serviceId];
        
        setSelectedServices(newSelection);
        setData('services', newSelection);
    };

    const calculateTotal = () => {
        return selectedServices.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return total + (service ? service.price_per_person * data.expected_attendees : 0);
        }, 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🆕 Create Catering Order
                </h2>
            }
        >
            <Head title="Create Catering Order" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Create New Order
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Set up a new catering order for your event.
                            </p>
                        </div>
                        <Link
                            href={route("catering.orders")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            ← Back to Orders
                        </Link>
                    </div>

                    {/* Order Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl">
                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Event Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Event Details
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Event Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.event_name}
                                            onChange={(e) => setData('event_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.event_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.event_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Event Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.event_date}
                                            onChange={(e) => setData('event_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.event_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Expected Attendees *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.expected_attendees}
                                            onChange={(e) => setData('expected_attendees', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.expected_attendees && (
                                            <p className="mt-1 text-sm text-red-600">{errors.expected_attendees}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Course (Optional)
                                        </label>
                                        <select
                                            value={data.course_id}
                                            onChange={(e) => setData('course_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select a course</option>
                                            {courses && courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.course_name} ({course.start_date} - {course.end_date})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Special Requirements
                                    </label>
                                    <textarea
                                        value={data.special_requirements}
                                        onChange={(e) => setData('special_requirements', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Any special dietary requirements, setup needs, or other requests..."
                                    />
                                    {errors.special_requirements && (
                                        <p className="mt-1 text-sm text-red-600">{errors.special_requirements}</p>
                                        )}
                                </div>
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Select Services
                                </h3>
                                
                                {services && services.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map((service) => (
                                            <label
                                                key={service.id}
                                                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                                    selectedServices.includes(service.id)
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedServices.includes(service.id)}
                                                    onChange={() => toggleService(service.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                            {service.name}
                                                        </h4>
                                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                            ${service.price_per_person}/person
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {service.description}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>Type: {service.type}</span>
                                                        <span>•</span>
                                                        <span>Prep: {service.preparation_time_minutes}min</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No services available. Please add services first.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            {selectedServices.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                        Order Summary
                                    </h3>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <div className="space-y-3">
                                            {selectedServices.map((serviceId) => {
                                                const service = services.find(s => s.id === serviceId);
                                                if (!service) return null;
                                                
                                                return (
                                                    <div key={serviceId} className="flex justify-between items-center">
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {service.name} × {data.expected_attendees}
                                                        </span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                            ${(service.price_per_person * data.expected_attendees).toFixed(2)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                                                <div className="flex justify-between items-center font-bold text-lg">
                                                    <span>Total:</span>
                                                    <span className="text-green-600 dark:text-green-400">
                                                        ${calculateTotal().toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("catering.orders")}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || selectedServices.length === 0}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
