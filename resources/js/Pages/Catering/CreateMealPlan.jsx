import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function CreateMealPlan({ cateringServices }) {
    const [items, setItems] = useState([]);
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        duration: 'daily',
        duration_value: 1,
        total_price: '',
        price_per_day: '',
        includes_breakfast: false,
        includes_lunch: false,
        includes_dinner: false,
        includes_snacks: false,
        includes_beverages: false,
        special_notes: '',
        is_active: true,
        items: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('catering.meal-plans.store'));
    };

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            catering_service_id: '',
            quantity: 1,
            notes: '',
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculatePrices = () => {
        let totalPrice = 0;
        let totalDays = parseInt(data.duration_value) || 1;
        
        items.forEach(item => {
            const service = cateringServices.find(s => s.id == item.catering_service_id);
            if (service) {
                totalPrice += (service.price_per_person * item.quantity * totalDays);
            }
        });
        
        const pricePerDay = totalDays > 0 ? totalPrice / totalDays : 0;
        
        setData({
            ...data,
            total_price: totalPrice.toFixed(2),
            price_per_day: pricePerDay.toFixed(2),
            items: items
        });
    };

    const handleDurationChange = (duration) => {
        setData('duration', duration);
        if (duration === 'daily') {
            setData('duration_value', 1);
        } else if (duration === 'weekly') {
            setData('duration_value', 7);
        } else if (duration === 'monthly') {
            setData('duration_value', 30);
        }
        calculatePrices();
    };

    const handleDurationValueChange = (value) => {
        setData('duration_value', value);
        calculatePrices();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    📋 Create Meal Plan
                </h2>
            }
        >
            <Head title="Create Meal Plan" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Create New Meal Plan
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Design a comprehensive meal plan package with multiple services.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('catering.meal-plans')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    ← Back to Meal Plans
                                </Link>
                                <Link
                                    href={route('catering.index')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Catering Dashboard
                                </Link>
                            </div>
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
                                            Plan Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="e.g., Premium Weekly Package"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Duration Type *
                                        </label>
                                        <select
                                            value={data.duration}
                                            onChange={(e) => handleDurationChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                        {errors.duration && (
                                            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Duration Value *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.duration_value}
                                            onChange={(e) => handleDurationValueChange(e.target.value)}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="1"
                                            required
                                        />
                                        {errors.duration_value && (
                                            <p className="mt-1 text-sm text-red-600">{errors.duration_value}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Total Price *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.total_price}
                                            onChange={(e) => setData('total_price', e.target.value)}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.total_price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.total_price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Price Per Day *
                                        </label>
                                        <input
                                            type="number"
                                            value={data.price_per_day}
                                            onChange={(e) => setData('price_per_day', e.target.value)}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.price_per_day && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price_per_day}</p>
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
                                        placeholder="Describe what this meal plan includes..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Meal Types Included */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    Meals Included
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.includes_breakfast}
                                            onChange={(e) => setData('includes_breakfast', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Breakfast</span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.includes_lunch}
                                            onChange={(e) => setData('includes_lunch', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Lunch</span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.includes_dinner}
                                            onChange={(e) => setData('includes_dinner', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Dinner</span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.includes_snacks}
                                            onChange={(e) => setData('includes_snacks', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Snacks</span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.includes_beverages}
                                            onChange={(e) => setData('includes_beverages', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Beverages</span>
                                    </label>
                                </div>
                            </div>

                            {/* Meal Plan Items */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Meal Plan Items
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        ➕ Add Item
                                    </button>
                                </div>

                                {items.length > 0 ? (
                                    <div className="space-y-4">
                                        {items.map((item, index) => (
                                            <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Service *
                                                        </label>
                                                        <select
                                                            value={item.catering_service_id}
                                                            onChange={(e) => updateItem(item.id, 'catering_service_id', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            required
                                                        >
                                                            <option value="">Select Service</option>
                                                            {cateringServices.map((service) => (
                                                                <option key={service.id} value={service.id}>
                                                                    {service.name} - ${service.price_per_person}/person
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Quantity *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                            min="1"
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Notes
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.notes}
                                                            onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            placeholder="Special instructions..."
                                                        />
                                                    </div>

                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                        <div className="text-4xl mb-2">🍽️</div>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No items added yet. Click "Add Item" to start building your meal plan.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Special Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Special Notes
                                </label>
                                <textarea
                                    value={data.special_notes}
                                    onChange={(e) => setData('special_notes', e.target.value)}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Any special instructions, dietary requirements, or notes..."
                                />
                                {errors.special_notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.special_notes}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Active Meal Plan
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('catering.meal-plans')}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? 'Creating Meal Plan...' : 'Create Meal Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
