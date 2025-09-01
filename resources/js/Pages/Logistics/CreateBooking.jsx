import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function CreateLogisticsBooking() {
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        course_id: '',
        transport_type: 'bus',
        pickup_date: '',
        pickup_time: '',
        return_date: '',
        return_time: '',
        pickup_location: '',
        dropoff_location: '',
        passenger_count: 1,
        special_requirements: '',
        status: 'pending',
        vehicle_size: 'standard',
        driver_notes: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        estimated_cost: '',
        payment_method: 'company_account',
        is_urgent: false,
        requires_insurance: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('logistics.bookings.store'));
    };

    const handlePickupDateChange = (date) => {
        setData('pickup_date', date);
        // Auto-set return date to same date if not already set
        if (!data.return_date) {
            setData('return_date', date);
        }
    };

    const calculateEstimatedCost = () => {
        let baseCost = 0;
        const passengerCount = parseInt(data.passenger_count) || 1;
        
        switch (data.transport_type) {
            case 'bus':
                baseCost = 500; // Base cost for bus
                break;
            case 'car':
                baseCost = 200; // Base cost for car
                break;
            case 'van':
                baseCost = 300; // Base cost for van
                break;
            case 'other':
                baseCost = 400; // Base cost for other
                break;
        }
        
        // Add cost per passenger
        let totalCost = baseCost + (passengerCount * 50);
        
        // Add urgency fee
        if (data.is_urgent) {
            totalCost += 100;
        }
        
        setData('estimated_cost', totalCost.toFixed(2));
    };

    // Mock courses data - in real app this would come from props
    const courses = [
        { id: 1, course_name: "Advanced Project Management", start_date: "2024-01-15", end_date: "2024-01-19" },
        { id: 2, course_name: "Digital Marketing Fundamentals", start_date: "2024-01-20", end_date: "2024-01-24" },
        { id: 3, course_name: "Leadership Skills Workshop", start_date: "2024-01-25", end_date: "2024-01-26" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🚌 Create Transportation Booking
                </h2>
            }
        >
            <Head title="Create Transportation Booking" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    New Transportation Booking
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Schedule transportation for course participants and events.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('logistics.bookings')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Bookings
                                </Link>
                                <Link
                                    href={route('logistics.index')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Logistics Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Course Selection */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Course Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Course *
                                        </label>
                                        <select
                                            value={data.course_id}
                                            onChange={(e) => setData('course_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.course_name} ({course.start_date} to {course.end_date})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Transport Type *
                                        </label>
                                        <select
                                            value={data.transport_type}
                                            onChange={(e) => {
                                                setData('transport_type', e.target.value);
                                                calculateEstimatedCost();
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="bus">🚌 Bus</option>
                                            <option value="car">🚗 Car</option>
                                            <option value="van">🚐 Van</option>
                                            <option value="other">🚚 Other</option>
                                        </select>
                                        {errors.transport_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.transport_type}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Pickup Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.pickup_date}
                                            onChange={(e) => handlePickupDateChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.pickup_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pickup_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Pickup Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={data.pickup_time}
                                            onChange={(e) => setData('pickup_time', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.pickup_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pickup_time}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Return Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.return_date}
                                            onChange={(e) => setData('return_date', e.target.value)}
                                            min={data.pickup_date}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.return_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.return_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Return Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={data.return_time}
                                            onChange={(e) => setData('return_time', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.return_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.return_time}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Locations */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Pickup & Dropoff Locations
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Pickup Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pickup_location}
                                            onChange={(e) => setData('pickup_location', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Dubai Mall, Main Entrance"
                                            required
                                        />
                                        {errors.pickup_location && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pickup_location}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Dropoff Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.dropoff_location}
                                            onChange={(e) => setData('dropoff_location', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Business Bay, Training Center"
                                            required
                                        />
                                        {errors.dropoff_location && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dropoff_location}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Passenger and Requirements */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Passenger Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Number of Passengers *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.passenger_count}
                                            onChange={(e) => {
                                                setData('passenger_count', e.target.value);
                                                calculateEstimatedCost();
                                            }}
                                            min="1"
                                            max="100"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.passenger_count && (
                                            <p className="mt-1 text-sm text-red-600">{errors.passenger_count}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Vehicle Size
                                        </label>
                                        <select
                                            value={data.vehicle_size}
                                            onChange={(e) => setData('vehicle_size', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="large">Large</option>
                                            <option value="luxury">Luxury</option>
                                            <option value="accessible">Wheelchair Accessible</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Special Requirements
                                    </label>
                                    <textarea
                                        value={data.special_requirements}
                                        onChange={(e) => setData('special_requirements', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Any special requirements, accessibility needs, or instructions..."
                                    />
                                    {errors.special_requirements && (
                                        <p className="mt-1 text-sm text-red-600">{errors.special_requirements}</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Contact Person
                                        </label>
                                        <input
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Full Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Phone Number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Options Toggle */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <span>{showAdvancedOptions ? '▼' : '▶'}</span>
                                    <span className="font-medium">Advanced Options</span>
                                </button>
                            </div>

                            {/* Advanced Options */}
                            {showAdvancedOptions && (
                                <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Payment Method
                                            </label>
                                            <select
                                                value={data.payment_method}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="company_account">Company Account</option>
                                                <option value="credit_card">Credit Card</option>
                                                <option value="cash">Cash</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Estimated Cost
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    value={data.estimated_cost}
                                                    onChange={(e) => setData('estimated_cost', e.target.value)}
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={calculateEstimatedCost}
                                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Calculate Estimated Cost
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Driver Notes
                                            </label>
                                            <textarea
                                                value={data.driver_notes}
                                                onChange={(e) => setData('driver_notes', e.target.value)}
                                                rows="2"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                placeholder="Special instructions for drivers..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_urgent}
                                                onChange={(e) => {
                                                    setData('is_urgent', e.target.checked);
                                                    calculateEstimatedCost();
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Urgent Request</span>
                                        </label>

                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.requires_insurance}
                                                onChange={(e) => setData('requires_insurance', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Requires Insurance</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('logistics.bookings')}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? 'Creating Booking...' : 'Create Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
