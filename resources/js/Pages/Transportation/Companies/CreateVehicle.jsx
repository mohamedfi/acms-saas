import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function CreateVehicle({
  company,
  vehicleTypes,
  fuelTypes,
  transmissions,
  features,
  existingVehicles = [],
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  // Function to load template data
  const loadTemplate = (template) => {
    setData({
      vehicle_type: template.vehicle_type || "",
      brand: template.brand || "",
      model: template.model || "",
      year: template.year || new Date().getFullYear(),
      license_plate: "", // Don't copy license plate
      color: template.color || "",
      seats: template.seats || 4,
      baggage_capacity: template.baggage_capacity || 2,
      fuel_type: template.fuel_type || "",
      transmission: template.transmission || "",
      engine_size: template.engine_size || "",
      fuel_consumption: template.fuel_consumption || "",
      mileage: template.mileage || "",
      features: template.features || [],
      description: template.description || "",
      images: [],
      hourly_rate: template.hourly_rate || "",
      daily_rate: template.daily_rate || "",
      weekly_rate: template.weekly_rate || "",
      monthly_rate: template.monthly_rate || "",
      weekend_rate: template.weekend_rate || "",
      holiday_rate: template.holiday_rate || "",
      mileage_charge_per_km: template.mileage_charge_per_km || "",
      included_mileage_per_day: template.included_mileage_per_day || "",
      driver_charge_per_hour: template.driver_charge_per_hour || "",
      fuel_charge: template.fuel_charge || "",
      cleaning_fee: template.cleaning_fee || "",
      insurance_daily_rate: template.insurance_daily_rate || "",
      security_deposit: template.security_deposit || "",
      insurance_included: template.insurance_included || false,
      insurance_coverage: template.insurance_coverage || "",
      status: "available",
      is_active: true,
      requires_special_license: template.requires_special_license || false,
      minimum_age_requirement: template.minimum_age_requirement || "",
      minimum_driving_experience: template.minimum_driving_experience || "",
      current_location: template.current_location || "",
      pickup_locations: template.pickup_locations || [],
      delivery_available: template.delivery_available || false,
      delivery_charge: template.delivery_charge || "",
      delivery_radius_km: template.delivery_radius_km || "",
      last_service_date: template.last_service_date || "",
      next_service_due: template.next_service_due || "",
      insurance_expiry: template.insurance_expiry || "",
      registration_expiry: template.registration_expiry || "",
      minimum_rental_hours: template.minimum_rental_hours || "",
      maximum_rental_days: template.maximum_rental_days || "",
      route_pricing: template.route_pricing || [],
    });
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  // Function to start from scratch
  const startFromScratch = () => {
    setSelectedTemplate(null);
    setShowTemplateSelector(false);
  };

  const { data, setData, post, processing, errors } = useForm({
    vehicle_type: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    color: "",
    seats: 4,
    baggage_capacity: 2,
    fuel_type: "",
    transmission: "",
    engine_size: "",
    fuel_consumption: "",
    mileage: "",
    features: [],
    description: "",
    images: [],
    hourly_rate: "",
    daily_rate: "",
    weekly_rate: "",
    monthly_rate: "",
    weekend_rate: "",
    holiday_rate: "",
    mileage_charge_per_km: "",
    included_mileage_per_day: "",
    driver_charge_per_hour: "",
    fuel_charge: "",
    cleaning_fee: "",
    insurance_daily_rate: "",
    security_deposit: "",
    insurance_included: false,
    insurance_coverage: "",
    status: "available",
    is_active: true,
    requires_special_license: false,
    minimum_age_requirement: "",
    minimum_driving_experience: "",
    current_location: "",
    pickup_locations: [],
    delivery_available: false,
    delivery_charge: "",
    delivery_radius_km: "",
    last_service_date: "",
    next_service_due: "",
    insurance_expiry: "",
    registration_expiry: "",
    maintenance_notes: "",
    minimum_rental_hours: "",
    maximum_rental_days: "",
    blackout_dates: [],
    weekend_only: false,
    advance_booking_required: false,
    advance_booking_hours: "",
    additional_features: [],
    special_instructions: "",
    admin_notes: "",
    // Route-based pricing
    route_pricing: [
      {
        from_location: "",
        to_location: "",
        distance_km: "",
        base_price: "",
        price_per_km: "",
        minimum_price: "",
        maximum_price: "",
        estimated_duration_hours: "",
        is_active: true,
      },
    ],
  });

  const handleFeatureChange = (feature, checked) => {
    if (checked) {
      setData("features", [...data.features, feature]);
    } else {
      setData(
        "features",
        data.features.filter((f) => f !== feature)
      );
    }
  };

  const addRoutePricing = () => {
    setData("route_pricing", [
      ...data.route_pricing,
      {
        from_location: "",
        to_location: "",
        distance_km: "",
        base_price: "",
        price_per_km: "",
        minimum_price: "",
        maximum_price: "",
        estimated_duration_hours: "",
        is_active: true,
      },
    ]);
  };

  const removeRoutePricing = (index) => {
    const newRoutePricing = data.route_pricing.filter((_, i) => i !== index);
    setData("route_pricing", newRoutePricing);
  };

  const updateRoutePricing = (index, field, value) => {
    const newRoutePricing = [...data.route_pricing];
    newRoutePricing[index][field] = value;
    setData("route_pricing", newRoutePricing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("transportation.companies.vehicles.store", company.id));
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          ➕ Add Vehicle to {company.name}
        </h2>
      }
    >
      <Head title={`Add Vehicle - ${company.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Add New Vehicle
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Add a new vehicle to {company.name}'s fleet
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={route("transportation.companies.vehicles", company.id)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ← Back to Vehicles
                </Link>
              </div>
            </div>
          </div>

          {/* Template Selector */}
          {showTemplateSelector && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  🚗 Choose How to Add Your Vehicle
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start with a template from existing vehicles or create from
                  scratch
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Use Template Option */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    📋 Use Existing Vehicle as Template
                  </h3>
                  <div className="space-y-3">
                    {existingVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => loadTemplate(vehicle)}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {vehicle.brand} {vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {vehicle.vehicle_type} • {vehicle.seats} seats •
                              EGP {vehicle.daily_rate}/day
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              License: {vehicle.license_plate}
                            </p>
                          </div>
                          <div className="text-blue-600 dark:text-blue-400">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start from Scratch Option */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ✨ Create from Scratch
                  </h3>
                  <div
                    onClick={startFromScratch}
                    className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 cursor-pointer transition-all duration-200 hover:shadow-md text-center"
                  >
                    <div className="text-4xl mb-3">🆕</div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Start Fresh
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a completely new vehicle with custom specifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Template Info */}
          {selectedTemplate && !showTemplateSelector && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-green-600 dark:text-green-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Using template: {selectedTemplate.brand}{" "}
                      {selectedTemplate.model}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      You can modify any field below
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplateSelector(true)}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  Change Template
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {!showTemplateSelector && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    🚗 Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        value={data.vehicle_type}
                        onChange={(e) =>
                          setData("vehicle_type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Vehicle Type</option>
                        {Object.entries(vehicleTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                      {errors.vehicle_type && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.vehicle_type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand *
                      </label>
                      <input
                        type="text"
                        value={data.brand}
                        onChange={(e) => setData("brand", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Toyota"
                        required
                      />
                      {errors.brand && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.brand}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model *
                      </label>
                      <input
                        type="text"
                        value={data.model}
                        onChange={(e) => setData("model", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Corolla"
                        required
                      />
                      {errors.model && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.model}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year *
                      </label>
                      <input
                        type="number"
                        value={data.year}
                        onChange={(e) =>
                          setData("year", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                      {errors.year && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.year}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Plate *
                      </label>
                      <input
                        type="text"
                        value={data.license_plate}
                        onChange={(e) =>
                          setData("license_plate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., ABC-123"
                        required
                      />
                      {errors.license_plate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.license_plate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color *
                      </label>
                      <input
                        type="text"
                        value={data.color}
                        onChange={(e) => setData("color", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., White"
                        required
                      />
                      {errors.color && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.color}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Seats *
                      </label>
                      <input
                        type="number"
                        value={data.seats}
                        onChange={(e) =>
                          setData("seats", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="1"
                        max="50"
                        required
                      />
                      {errors.seats && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.seats}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Baggage Capacity *
                      </label>
                      <input
                        type="number"
                        value={data.baggage_capacity}
                        onChange={(e) =>
                          setData("baggage_capacity", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="0"
                        max="20"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Number of bags/luggage pieces the vehicle can carry
                      </p>
                      {errors.baggage_capacity && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.baggage_capacity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fuel Type *
                      </label>
                      <select
                        value={data.fuel_type}
                        onChange={(e) => setData("fuel_type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Fuel Type</option>
                        {Object.entries(fuelTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                      {errors.fuel_type && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.fuel_type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Transmission *
                      </label>
                      <select
                        value={data.transmission}
                        onChange={(e) =>
                          setData("transmission", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Transmission</option>
                        {Object.entries(transmissions).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                      {errors.transmission && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.transmission}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    💰 Pricing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Daily Rate (AED) *
                      </label>
                      <input
                        type="number"
                        value={data.daily_rate}
                        onChange={(e) =>
                          setData("daily_rate", parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                      {errors.daily_rate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.daily_rate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hourly Rate (AED)
                      </label>
                      <input
                        type="number"
                        value={data.hourly_rate}
                        onChange={(e) =>
                          setData("hourly_rate", parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      {errors.hourly_rate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.hourly_rate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Weekly Rate (AED)
                      </label>
                      <input
                        type="number"
                        value={data.weekly_rate}
                        onChange={(e) =>
                          setData("weekly_rate", parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      {errors.weekly_rate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.weekly_rate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Security Deposit (AED)
                      </label>
                      <input
                        type="number"
                        value={data.security_deposit}
                        onChange={(e) =>
                          setData(
                            "security_deposit",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      {errors.security_deposit && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.security_deposit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Route-Based Pricing */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    🗺️ Route-Based Pricing
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Set specific pricing for popular routes (from place to
                    place)
                  </p>

                  {data.route_pricing.map((route, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                          Route #{index + 1}
                        </h4>
                        {data.route_pricing.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoutePricing(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ Remove Route
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            From Location *
                          </label>
                          <input
                            type="text"
                            value={route.from_location}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "from_location",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Airport, City Center"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            To Location *
                          </label>
                          <input
                            type="text"
                            value={route.to_location}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "to_location",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Hotel, Tourist Attraction"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Distance (km)
                          </label>
                          <input
                            type="number"
                            value={route.distance_km}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "distance_km",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Base Price ($)
                          </label>
                          <input
                            type="number"
                            value={route.base_price}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "base_price",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Price per km ($)
                          </label>
                          <input
                            type="number"
                            value={route.price_per_km}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "price_per_km",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Estimated Duration (hours)
                          </label>
                          <input
                            type="number"
                            value={route.estimated_duration_hours}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "estimated_duration_hours",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Minimum Price ($)
                          </label>
                          <input
                            type="number"
                            value={route.minimum_price}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "minimum_price",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Maximum Price ($)
                          </label>
                          <input
                            type="number"
                            value={route.maximum_price}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "maximum_price",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={route.is_active}
                            onChange={(e) =>
                              updateRoutePricing(
                                index,
                                "is_active",
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            This route is active
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addRoutePricing}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border-2 border-dashed border-green-300 hover:border-green-400"
                  >
                    ➕ Add Another Route
                  </button>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    ✨ Vehicle Features
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(features).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={data.features.includes(key)}
                          onChange={(e) =>
                            handleFeatureChange(key, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.features && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.features}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the vehicle..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    📊 Status & Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status *
                      </label>
                      <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="available">Available</option>
                        <option value="rented">Currently Rented</option>
                        <option value="maintenance">In Maintenance</option>
                        <option value="out_of_service">Out of Service</option>
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.status}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={data.is_active}
                          onChange={(e) =>
                            setData("is_active", e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Active
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={route(
                      "transportation.companies.vehicles",
                      company.id
                    )}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {processing ? "Adding..." : "Add Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
