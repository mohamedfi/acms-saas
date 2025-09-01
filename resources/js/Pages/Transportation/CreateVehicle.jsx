import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function CreateVehicle() {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_type: '',
        brand: '',
        model: '',
        year: '',
        license_plate: '',
        color: '',
        seats: '',
        fuel_type: '',
        transmission: '',
        features: [],
        description: '',
        daily_rate: '',
        hourly_rate: '',
        weekly_rate: '',
        monthly_rate: '',
        location: '',
        insurance_info: '',
    });

    const vehicleTypes = [
        'Sedan', 'SUV', 'Van', 'Bus', 'Luxury', 'Sports Car', 'Truck', 'Motorcycle'
    ];

    const fuelTypes = [
        'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'Hydrogen'
    ];

    const transmissionTypes = [
        'Automatic', 'Manual', 'CVT', 'Semi-Automatic'
    ];

    const commonFeatures = [
        'GPS Navigation', 'Bluetooth', 'USB Ports', 'Leather Seats', 'Sunroof',
        'Backup Camera', 'Parking Sensors', 'Cruise Control', 'Climate Control',
        'Heated Seats', 'Ventilated Seats', 'Wireless Charging', 'Apple CarPlay',
        'Android Auto', 'Premium Sound System', 'All-Wheel Drive', '4-Wheel Drive'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transportation.vehicles.store'));
    };

    const toggleFeature = (feature) => {
        const newFeatures = data.features.includes(feature)
            ? data.features.filter(f => f !== feature)
            : [...data.features, feature];
        setData('features', newFeatures);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🚗 Add New Vehicle
                </h2>
            }
        >
            <Head title="Add New Vehicle" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Add New Vehicle to Fleet
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Register a new vehicle with complete specifications and pricing.
                                </p>
                            </div>
                            <Link
                                href={route('transportation.vehicles')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ← Back to Fleet
                            </Link>
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
                                            Vehicle Type *
                                        </label>
                                        <select
                                            value={data.vehicle_type}
                                            onChange={(e) => setData('vehicle_type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Select Vehicle Type</option>
                                            {vehicleTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.vehicle_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.vehicle_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Brand *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Toyota, Mercedes, BMW"
                                            required
                                        />
                                        {errors.brand && (
                                            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Model *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Camry, S-Class, X5"
                                            required
                                        />
                                        {errors.model && (
                                            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Year *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., 2023, 2024"
                                            maxLength="4"
                                            required
                                        />
                                        {errors.year && (
                                            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            License Plate *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.license_plate}
                                            onChange={(e) => setData('license_plate', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., ABC-123"
                                            required
                                        />
                                        {errors.license_plate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.license_plate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Color *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Red, Blue, Silver"
                                            required
                                        />
                                        {errors.color && (
                                            <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Number of Seats *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.seats}
                                            onChange={(e) => setData('seats', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            min="1"
                                            max="50"
                                            required
                                        />
                                        {errors.seats && (
                                            <p className="mt-1 text-sm text-red-600">{errors.seats}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fuel Type *
                                        </label>
                                        <select
                                            value={data.fuel_type}
                                            onChange={(e) => setData('fuel_type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Select Fuel Type</option>
                                            {fuelTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.fuel_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fuel_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Transmission *
                                        </label>
                                        <select
                                            value={data.transmission}
                                            onChange={(e) => setData('transmission', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Select Transmission</option>
                                            {transmissionTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.transmission && (
                                            <p className="mt-1 text-sm text-red-600">{errors.transmission}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Pricing Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Daily Rate * ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_rate}
                                            onChange={(e) => setData('daily_rate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.daily_rate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.daily_rate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Hourly Rate ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.hourly_rate}
                                            onChange={(e) => setData('hourly_rate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                        {errors.hourly_rate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Weekly Rate ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.weekly_rate}
                                            onChange={(e) => setData('weekly_rate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                        {errors.weekly_rate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.weekly_rate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Monthly Rate ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.monthly_rate}
                                            onChange={(e) => setData('monthly_rate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                        {errors.monthly_rate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.monthly_rate}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Main Garage, Downtown Office"
                                        />
                                        {errors.location && (
                                            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Insurance Information
                                        </label>
                                        <input
                                            type="text"
                                            value={data.insurance_info}
                                            onChange={(e) => setData('insurance_info', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Policy #12345, Expires 12/31/2024"
                                        />
                                        {errors.insurance_info && (
                                            <p className="mt-1 text-sm text-red-600">{errors.insurance_info}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Additional details about the vehicle..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Vehicle Features
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {commonFeatures.map(feature => (
                                        <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.features.includes(feature)}
                                                onChange={() => toggleFeature(feature)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {feature}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.features && (
                                    <p className="mt-1 text-sm text-red-600">{errors.features}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('transportation.vehicles')}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? 'Adding Vehicle...' : 'Add Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
