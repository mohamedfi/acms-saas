import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function EditService({
    service,
    dietaryRequirements,
    employees,
    cateringRoles,
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: service.name,
        description: service.description || "",
        type: service.type,
        price_per_person: service.price_per_person,
        cuisine_type: service.cuisine_type || "",
        is_vegetarian: service.is_vegetarian,
        is_vegan: service.is_vegan,
        is_halal: service.is_halal,
        is_gluten_free: service.is_gluten_free,
        preparation_time_minutes: service.preparation_time_minutes,
        serving_temperature: service.serving_temperature || "",
        allergen_info: service.allergen_info || "",
        ingredients: service.ingredients || "",
        nutritional_info: service.nutritional_info || "",
        is_available: service.is_available,
        dietary_requirements:
            service.dietary_requirements?.map((dr) => dr.id) || [],
        employees:
            service.employees?.map((emp) => ({
                employee_id: emp.id,
                role: emp.pivot.role,
                notes: emp.pivot.notes,
                is_primary: emp.pivot.is_primary,
                is_available: emp.pivot.is_available,
            })) || [],
    });

    const [selectedDietaryRequirements, setSelectedDietaryRequirements] =
        useState(service.dietary_requirements?.map((dr) => dr.id) || []);

    const [assignedEmployees, setAssignedEmployees] = useState(
        service.employees?.map((emp) => ({
            employee_id: emp.id,
            role: emp.pivot.role,
            notes: emp.pivot.notes,
            is_primary: emp.pivot.is_primary,
            is_available: emp.pivot.is_available,
        })) || []
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("catering.services.update", service.id));
    };

    const toggleDietaryRequirement = (requirementId) => {
        const newSelection = selectedDietaryRequirements.includes(requirementId)
            ? selectedDietaryRequirements.filter((id) => id !== requirementId)
            : [...selectedDietaryRequirements, requirementId];

        setSelectedDietaryRequirements(newSelection);
        setData("dietary_requirements", newSelection);
    };

    const addEmployee = (employeeId) => {
        const employee = employees.find((emp) => emp.id === employeeId);
        if (
            employee &&
            !assignedEmployees.find((ae) => ae.employee_id === employeeId)
        ) {
            const newAssignment = {
                employee_id: employeeId,
                role: "chef",
                notes: "",
                is_primary: assignedEmployees.length === 0, // First employee is primary
                is_available: true,
            };
            const newAssignments = [...assignedEmployees, newAssignment];
            setAssignedEmployees(newAssignments);
            setData("employees", newAssignments);
        }
    };

    const removeEmployee = (employeeId) => {
        const newAssignments = assignedEmployees.filter(
            (ae) => ae.employee_id !== employeeId
        );
        setAssignedEmployees(newAssignments);
        setData("employees", newAssignments);
    };

    const updateEmployeeAssignment = (employeeId, field, value) => {
        const newAssignments = assignedEmployees.map((ae) =>
            ae.employee_id === employeeId ? { ...ae, [field]: value } : ae
        );
        setAssignedEmployees(newAssignments);
        setData("employees", newAssignments);
    };

    const setPrimaryEmployee = (employeeId) => {
        const newAssignments = assignedEmployees.map((ae) => ({
            ...ae,
            is_primary: ae.employee_id === employeeId,
        }));
        setAssignedEmployees(newAssignments);
        setData("employees", newAssignments);
    };

    const mealTypes = [
        { value: "breakfast", label: "Breakfast", icon: "🌅" },
        { value: "lunch", label: "Lunch", icon: "🍽️" },
        { value: "dinner", label: "Dinner", icon: "🌙" },
        { value: "snack", label: "Snack", icon: "🍎" },
        { value: "beverage", label: "Beverage", icon: "☕" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    ✏️ Edit Catering Service
                </h2>
            }
        >
            <Head title={`Edit ${service.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Edit Service: {service.name}
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Update the details and dietary information for
                                this catering service.
                            </p>
                        </div>
                        <Link
                            href={route("catering.services")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            ← Back to Services
                        </Link>
                    </div>

                    {/* Edit Form */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl">
                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Basic Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Service Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Meal Type *
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            {mealTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.icon} {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Price per Person *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.price_per_person}
                                                onChange={(e) =>
                                                    setData(
                                                        "price_per_person",
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                        </div>
                                        {errors.price_per_person && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.price_per_person}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Cuisine Type
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cuisine_type}
                                            onChange={(e) =>
                                                setData(
                                                    "cuisine_type",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Italian, Arabic, International"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.cuisine_type && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.cuisine_type}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Describe the service, ingredients, and preparation..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Dietary Options */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Dietary Options
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_vegetarian}
                                            onChange={(e) =>
                                                setData(
                                                    "is_vegetarian",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            🥬 Vegetarian
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_vegan}
                                            onChange={(e) =>
                                                setData(
                                                    "is_vegan",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            🌱 Vegan
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_halal}
                                            onChange={(e) =>
                                                setData(
                                                    "is_halal",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            ☪️ Halal
                                        </span>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_gluten_free}
                                            onChange={(e) =>
                                                setData(
                                                    "is_gluten_free",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            🌾 Gluten-Free
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Preparation Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Preparation Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Preparation Time (minutes) *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                data.preparation_time_minutes
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "preparation_time_minutes",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.preparation_time_minutes && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors.preparation_time_minutes
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Serving Temperature (°C)
                                        </label>
                                        <input
                                            type="number"
                                            value={
                                                data.serving_temperature || ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "serving_temperature",
                                                    e.target.value
                                                        ? parseInt(
                                                              e.target.value
                                                          )
                                                        : null
                                                )
                                            }
                                            placeholder="e.g., 65, 70, 75"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.serving_temperature && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.serving_temperature}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Additional Information
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Allergen Information
                                        </label>
                                        <input
                                            type="text"
                                            value={data.allergen_info || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "allergen_info",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Contains gluten, dairy, eggs"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.allergen_info && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.allergen_info}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ingredients
                                        </label>
                                        <textarea
                                            value={data.ingredients || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "ingredients",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            placeholder="List main ingredients..."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.ingredients && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.ingredients}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nutritional Information
                                        </label>
                                        <textarea
                                            value={data.nutritional_info || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "nutritional_info",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            placeholder="e.g., Calories: 400-500, Protein: 20g, Carbs: 45g, Fat: 18g"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.nutritional_info && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.nutritional_info}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dietary Requirements */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Compatible Dietary Requirements
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dietaryRequirements.map((requirement) => (
                                        <label
                                            key={requirement.id}
                                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                                selectedDietaryRequirements.includes(
                                                    requirement.id
                                                )
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedDietaryRequirements.includes(
                                                    requirement.id
                                                )}
                                                onChange={() =>
                                                    toggleDietaryRequirement(
                                                        requirement.id
                                                    )
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">
                                                    {requirement.display_icon}
                                                </span>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {requirement.name}
                                                    </span>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {
                                                            requirement.category_label
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Employee Assignments */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Assigned Employees
                                </h3>

                                {/* Add Employee */}
                                <div className="flex space-x-4">
                                    <select
                                        onChange={(e) =>
                                            addEmployee(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select an employee to assign
                                        </option>
                                        {employees
                                            .filter(
                                                (emp) =>
                                                    !assignedEmployees.find(
                                                        (ae) =>
                                                            ae.employee_id ===
                                                            emp.id
                                                    )
                                            )
                                            .map((employee) => (
                                                <option
                                                    key={employee.id}
                                                    value={employee.id}
                                                >
                                                    {employee.display_name} -{" "}
                                                    {employee.position_display}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Assigned Employees List */}
                                {assignedEmployees.length > 0 && (
                                    <div className="space-y-4">
                                        {assignedEmployees.map((assignment) => {
                                            const employee = employees.find(
                                                (emp) =>
                                                    emp.id ===
                                                    assignment.employee_id
                                            );
                                            if (!employee) return null;

                                            return (
                                                <div
                                                    key={assignment.employee_id}
                                                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                                    {(
                                                                        employee.display_name ||
                                                                        employee.first_name ||
                                                                        "E"
                                                                    ).charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        employee.display_name
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        employee.position_display
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeEmployee(
                                                                    assignment.employee_id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Role
                                                            </label>
                                                            <select
                                                                value={
                                                                    assignment.role
                                                                }
                                                                onChange={(e) =>
                                                                    updateEmployeeAssignment(
                                                                        assignment.employee_id,
                                                                        "role",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                                                            >
                                                                {cateringRoles.map(
                                                                    (role) => (
                                                                        <option
                                                                            key={
                                                                                role.id
                                                                            }
                                                                            value={
                                                                                role.name
                                                                            }
                                                                        >
                                                                            {
                                                                                role.display_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Primary Employee
                                                            </label>
                                                            <label className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`primary_${assignment.employee_id}`}
                                                                    checked={
                                                                        assignment.is_primary
                                                                    }
                                                                    onChange={() =>
                                                                        setPrimaryEmployee(
                                                                            assignment.employee_id
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                                />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                    Primary
                                                                </span>
                                                            </label>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Available
                                                            </label>
                                                            <label className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        assignment.is_available
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateEmployeeAssignment(
                                                                            assignment.employee_id,
                                                                            "is_available",
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                                />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                    Available
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Notes
                                                        </label>
                                                        <textarea
                                                            value={
                                                                assignment.notes ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateEmployeeAssignment(
                                                                    assignment.employee_id,
                                                                    "notes",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                                                            placeholder="Special instructions or notes..."
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {assignedEmployees.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <div className="text-4xl mb-2">👥</div>
                                        <p>
                                            No employees assigned to this
                                            service
                                        </p>
                                        <p className="text-sm">
                                            Select an employee from the dropdown
                                            above to assign them
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Service Status */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Service Status
                                </h3>

                                <div>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_available}
                                            onChange={(e) =>
                                                setData(
                                                    "is_available",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Service is available for ordering
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("catering.services")}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Updating..."
                                        : "Update Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
