import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Services({ services }) {
    const { flash } = usePage().props;
    const mealTypes = [
        { value: "breakfast", label: "Breakfast", icon: "🌅" },
        { value: "lunch", label: "Lunch", icon: "🍽️" },
        { value: "dinner", label: "Dinner", icon: "🌙" },
        { value: "snack", label: "Snack", icon: "🍎" },
        { value: "beverage", label: "Beverage", icon: "☕" },
    ];

    const toggleForm = useForm();

    const handleToggleAvailability = (serviceId) => {
        toggleForm.patch(route("catering.services.toggle", serviceId));
    };

    const getMealTypeIcon = (type) => {
        const mealType = mealTypes.find((mt) => mt.value === type);
        return mealType ? mealType.icon : "🍽️";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    🍽️ Catering Services
                </h2>
            }
        >
            <Head title="Catering Services" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-green-800 dark:text-green-200">
                                {flash.success}
                            </p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Catering Services
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Manage all available catering services and their
                                dietary information.
                            </p>
                        </div>
                        <Link
                            href={route("catering.index")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`bg-white dark:bg-gray-800 shadow rounded-xl border-2 transition-all hover:shadow-lg ${
                                    service.is_available
                                        ? "border-green-200 dark:border-green-800"
                                        : "border-red-200 dark:border-red-800"
                                }`}
                            >
                                {/* Service Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-3xl">
                                            {getMealTypeIcon(service.type)}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                $
                                                {parseFloat(
                                                    service.price_per_person
                                                ).toFixed(2)}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                per person
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {service.name}
                                    </h3>

                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full capitalize">
                                            {service.type}
                                        </span>
                                        {service.cuisine_type && (
                                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                                {service.cuisine_type}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Dietary Information */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Dietary Options
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {service.is_vegetarian && (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded">
                                                🥬 Vegetarian
                                            </span>
                                        )}
                                        {service.is_vegan && (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded">
                                                🌱 Vegan
                                            </span>
                                        )}
                                        {service.is_halal && (
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded">
                                                ☪️ Halal
                                            </span>
                                        )}
                                        {service.is_gluten_free && (
                                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-xs rounded">
                                                🌾 Gluten-Free
                                            </span>
                                        )}
                                        {!service.is_vegetarian &&
                                            !service.is_vegan &&
                                            !service.is_halal &&
                                            !service.is_gluten_free && (
                                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                                    No special dietary options
                                                </span>
                                            )}
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Service Details
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex justify-between">
                                            <span>Prep Time:</span>
                                            <span className="font-medium">
                                                {
                                                    service.preparation_time_minutes
                                                }{" "}
                                                min
                                            </span>
                                        </div>
                                        {service.serving_temperature && (
                                            <div className="flex justify-between">
                                                <span>Serving Temp:</span>
                                                <span className="font-medium">
                                                    {
                                                        service.serving_temperature
                                                    }
                                                    °C
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <span
                                                className={`font-medium ${
                                                    service.is_available
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {service.is_available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dietary Requirements */}
                                {service.dietary_requirements &&
                                    service.dietary_requirements.length > 0 && (
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                                Compatible Requirements
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {service.dietary_requirements.map(
                                                    (requirement) => (
                                                        <span
                                                            key={requirement.id}
                                                            className={`px-2 py-1 text-xs rounded ${
                                                                requirement
                                                                    .pivot
                                                                    .is_compatible
                                                                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                                                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                                            }`}
                                                        >
                                                            {
                                                                requirement.display_icon
                                                            }{" "}
                                                            {requirement.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Assigned Employees */}
                                {service.employees &&
                                    service.employees.length > 0 && (
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                                Assigned Staff
                                            </h4>
                                            <div className="space-y-3">
                                                {service.employees.map(
                                                    (employee) => (
                                                        <div
                                                            key={employee.id}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                                        {(employee.display_name || employee.first_name || 'E').charAt(0)}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            employee.display_name || 
                                                                            (employee.first_name && employee.last_name ? 
                                                                                employee.first_name + ' ' + employee.last_name : 
                                                                                'Unknown Employee'
                                                                            )
                                                                        }
                                                                    </p>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {employee.pivot.role.replace(
                                                                                "_",
                                                                                " "
                                                                            )}
                                                                        </span>
                                                                        {employee
                                                                            .pivot
                                                                            .is_primary && (
                                                                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                                                                                Primary
                                                                            </span>
                                                                        )}
                                                                        {!employee
                                                                            .pivot
                                                                            .is_available && (
                                                                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded">
                                                                                Unavailable
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Additional Information */}
                                {(service.allergen_info ||
                                    service.ingredients ||
                                    service.nutritional_info) && (
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                            Additional Information
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            {service.allergen_info && (
                                                <div>
                                                    <span className="font-medium text-red-600 dark:text-red-400">
                                                        ⚠️ Allergens:
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                        {service.allergen_info}
                                                    </p>
                                                </div>
                                            )}
                                            {service.ingredients && (
                                                <div>
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                                        🥘 Ingredients:
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                        {service.ingredients}
                                                    </p>
                                                </div>
                                            )}
                                            {service.nutritional_info && (
                                                <div>
                                                    <span className="font-medium text-green-600 dark:text-green-400">
                                                        📊 Nutrition:
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                        {
                                                            service.nutritional_info
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="p-6">
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route(
                                                "catering.services.edit",
                                                service.id
                                            )}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            ✏️ Edit Service
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleToggleAvailability(
                                                    service.id
                                                )
                                            }
                                            disabled={toggleForm.processing}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                service.is_available
                                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {toggleForm.processing
                                                ? "..."
                                                : service.is_available
                                                ? "🚫 Disable"
                                                : "✅ Enable"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {services.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🍽️</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No Services Available
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Start by adding your first catering service.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
