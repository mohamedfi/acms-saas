<?php

namespace App\Http\Controllers;

use App\Models\RentalCompany;
use App\Models\CompanyVehicle;
use App\Models\CompanyContact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class RentalCompanyController extends Controller
{
    /**
     * Display a listing of rental companies.
     */
    public function index()
    {
        try {
            $companies = RentalCompany::with(['vehicles', 'contacts'])
                ->withCount(['vehicles', 'activeVehicles', 'availableVehicles'])
                ->orderBy('is_featured', 'desc')
                ->orderBy('rating', 'desc')
                ->orderBy('name')
                ->get();

            $stats = [
                'total_companies' => $companies->count(),
                'active_companies' => $companies->where('is_active', true)->count(),
                'verified_companies' => $companies->where('is_verified', true)->count(),
                'featured_companies' => $companies->where('is_featured', true)->count(),
                'total_vehicles' => $companies->sum('vehicles_count'),
                'available_vehicles' => $companies->sum('available_vehicles_count'),
            ];

            return Inertia::render('Transportation/Companies/Index', [
                'companies' => $companies,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading rental companies: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new rental company.
     */
    public function create()
    {
        $serviceOptions = [
            'car_rental' => 'Car Rental',
            'bus_rental' => 'Bus Rental',
            'van_rental' => 'Van Rental',
            'luxury_rental' => 'Luxury Vehicle Rental',
            'chauffeur_service' => 'Chauffeur Service',
            'airport_transfer' => 'Airport Transfer',
            'city_tours' => 'City Tours',
            'long_term_rental' => 'Long-term Rental',
        ];

        $paymentMethods = [
            'cash' => 'Cash',
            'card' => 'Credit/Debit Card',
            'bank_transfer' => 'Bank Transfer',
            'mobile_payment' => 'Mobile Payment',
            'corporate_account' => 'Corporate Account',
        ];

        $coverageAreas = [
            'Dubai' => 'Dubai',
            'Abu Dhabi' => 'Abu Dhabi',
            'Sharjah' => 'Sharjah',
            'Ajman' => 'Ajman',
            'Ras Al Khaimah' => 'Ras Al Khaimah',
            'Fujairah' => 'Fujairah',
            'Umm Al Quwain' => 'Umm Al Quwain',
        ];

        return Inertia::render('Transportation/Companies/Create', [
            'serviceOptions' => $serviceOptions,
            'paymentMethods' => $paymentMethods,
            'coverageAreas' => $coverageAreas,
        ]);
    }

    /**
     * Store a newly created rental company.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:rental_companies,name',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'primary_email' => 'nullable|email',
            'primary_phone' => 'nullable|string|max:20',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'registration_number' => 'nullable|string|max:100',
            'tax_id' => 'nullable|string|max:100',
            'license_number' => 'nullable|string|max:100',
            'license_expiry' => 'nullable|date',
            'services_offered' => 'nullable|array',
            'coverage_areas' => 'nullable|array',
            'minimum_rental_hours' => 'nullable|numeric|min:1',
            'offers_insurance' => 'boolean',
            'offers_delivery' => 'boolean',
            'delivery_fee' => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'payment_methods' => 'nullable|array',
            'currency' => 'nullable|string|max:3',
            'cancellation_fee' => 'nullable|numeric|min:0',
            'cancellation_hours' => 'nullable|integer|min:0',
            'terms_and_conditions' => 'nullable|string',
            'cancellation_policy' => 'nullable|string',
            'damage_policy' => 'nullable|string',
            'business_hours' => 'nullable|array',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'internal_notes' => 'nullable|string',
        ]);

        try {
            // Handle logo upload
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('rental-companies/logos', 'public');
                $validated['logo'] = $logoPath;
            }

            $company = RentalCompany::create($validated);

            return redirect()->route('transportation.companies.show', $company)
                ->with('success', 'Rental company created successfully!');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Error creating rental company: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified rental company.
     */
    public function show(RentalCompany $company)
    {
        try {
            $company->load([
                'vehicles' => function ($query) {
                    $query->with('rentalCompany')->orderBy('vehicle_type')->orderBy('brand');
                },
                'contacts' => function ($query) {
                    $query->orderBy('is_primary', 'desc')->orderBy('priority_level')->orderBy('name');
                }
            ]);

            $vehicleStats = [
                'total' => $company->vehicles->count(),
                'available' => $company->vehicles->where('status', 'available')->count(),
                'rented' => $company->vehicles->where('status', 'rented')->count(),
                'maintenance' => $company->vehicles->where('status', 'maintenance')->count(),
                'out_of_service' => $company->vehicles->where('status', 'out_of_service')->count(),
            ];

            $vehicleTypes = $company->vehicles->groupBy('vehicle_type')->map->count();
            $priceRange = $company->vehicles->where('is_active', true)->where('status', 'available');

            $stats = [
                'vehicles' => $vehicleStats,
                'vehicle_types' => $vehicleTypes,
                'price_range' => [
                    'lowest' => $priceRange->min('daily_rate'),
                    'highest' => $priceRange->max('daily_rate'),
                    'average' => $priceRange->avg('daily_rate'),
                ],
                'contacts' => [
                    'total' => $company->contacts->count(),
                    'active' => $company->contacts->where('is_active', true)->count(),
                    'primary' => $company->contacts->where('is_primary', true)->count(),
                    'emergency' => $company->contacts->where('emergency_contact', true)->count(),
                ],
                'performance' => [
                    'total_revenue' => $company->vehicles->sum('revenue_to_date'),
                    'total_bookings' => $company->vehicles->sum('total_bookings'),
                    'total_reviews' => $company->vehicles->sum('total_reviews'),
                ],
            ];

            return Inertia::render('Transportation/Companies/Show', [
                'company' => $company,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading company details: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified rental company.
     */
    public function edit(RentalCompany $company)
    {
        $serviceOptions = [
            'car_rental' => 'Car Rental',
            'bus_rental' => 'Bus Rental',
            'van_rental' => 'Van Rental',
            'luxury_rental' => 'Luxury Vehicle Rental',
            'chauffeur_service' => 'Chauffeur Service',
            'airport_transfer' => 'Airport Transfer',
            'city_tours' => 'City Tours',
            'long_term_rental' => 'Long-term Rental',
        ];

        $paymentMethods = [
            'cash' => 'Cash',
            'card' => 'Credit/Debit Card',
            'bank_transfer' => 'Bank Transfer',
            'mobile_payment' => 'Mobile Payment',
            'corporate_account' => 'Corporate Account',
        ];

        $coverageAreas = [
            'Dubai' => 'Dubai',
            'Abu Dhabi' => 'Abu Dhabi',
            'Sharjah' => 'Sharjah',
            'Ajman' => 'Ajman',
            'Ras Al Khaimah' => 'Ras Al Khaimah',
            'Fujairah' => 'Fujairah',
            'Umm Al Quwain' => 'Umm Al Quwain',
        ];

        return Inertia::render('Transportation/Companies/Edit', [
            'company' => $company,
            'serviceOptions' => $serviceOptions,
            'paymentMethods' => $paymentMethods,
            'coverageAreas' => $coverageAreas,
        ]);
    }

    /**
     * Update the specified rental company.
     */
    public function update(Request $request, RentalCompany $company)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('rental_companies')->ignore($company->id)],
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'primary_email' => 'nullable|email',
            'primary_phone' => 'nullable|string|max:20',
            'website' => 'nullable|url',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'registration_number' => 'nullable|string|max:100',
            'tax_id' => 'nullable|string|max:100',
            'license_number' => 'nullable|string|max:100',
            'license_expiry' => 'nullable|date',
            'services_offered' => 'nullable|array',
            'coverage_areas' => 'nullable|array',
            'minimum_rental_hours' => 'nullable|numeric|min:1',
            'offers_insurance' => 'boolean',
            'offers_delivery' => 'boolean',
            'delivery_fee' => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'payment_methods' => 'nullable|array',
            'currency' => 'nullable|string|max:3',
            'cancellation_fee' => 'nullable|numeric|min:0',
            'cancellation_hours' => 'nullable|integer|min:0',
            'terms_and_conditions' => 'nullable|string',
            'cancellation_policy' => 'nullable|string',
            'damage_policy' => 'nullable|string',
            'business_hours' => 'nullable|array',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'internal_notes' => 'nullable|string',
        ]);

        try {
            // Handle logo upload
            if ($request->hasFile('logo')) {
                // Delete old logo if exists
                if ($company->logo) {
                    Storage::disk('public')->delete($company->logo);
                }
                $logoPath = $request->file('logo')->store('rental-companies/logos', 'public');
                $validated['logo'] = $logoPath;
            }

            $company->update($validated);

            return redirect()->route('transportation.companies.index')
                ->with('success', 'Rental company updated successfully!');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Error updating rental company: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified rental company.
     */
    public function destroy(RentalCompany $company)
    {
        try {
            // Check if company has active bookings or vehicles
            $activeVehicles = $company->vehicles()->where('status', 'rented')->count();

            if ($activeVehicles > 0) {
                return back()->with('error', 'Cannot delete company with active vehicle rentals.');
            }

            // Delete logo if exists
            if ($company->logo) {
                Storage::disk('public')->delete($company->logo);
            }

            $companyName = $company->name;
            $company->delete();

            return redirect()->route('transportation.companies.index')
                ->with('success', "Rental company '{$companyName}' deleted successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting rental company: ' . $e->getMessage());
        }
    }

    /**
     * Toggle the active status of a rental company.
     */
    public function toggleStatus(RentalCompany $company)
    {
        try {
            $company->update(['is_active' => !$company->is_active]);

            $status = $company->is_active ? 'activated' : 'deactivated';
            return back()->with('success', "Company {$status} successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating company status: ' . $e->getMessage());
        }
    }

    /**
     * Toggle verification status of a rental company.
     */
    public function toggleVerification(RentalCompany $company)
    {
        try {
            $company->update(['is_verified' => !$company->is_verified]);

            $status = $company->is_verified ? 'verified' : 'unverified';
            return back()->with('success', "Company {$status} successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating verification status: ' . $e->getMessage());
        }
    }

    /**
     * Toggle featured status of a rental company.
     */
    public function toggleFeatured(RentalCompany $company)
    {
        try {
            $company->update(['is_featured' => !$company->is_featured]);

            $status = $company->is_featured ? 'added to featured' : 'removed from featured';
            return back()->with('success', "Company {$status} successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating featured status: ' . $e->getMessage());
        }
    }

    /**
     * Display vehicles for a specific company.
     */
    public function vehicles(RentalCompany $company)
    {
        try {
            $vehicles = $company->vehicles()
                ->orderBy('vehicle_type')
                ->orderBy('brand')
                ->orderBy('model')
                ->get();

            $stats = [
                'total' => $vehicles->count(),
                'available' => $vehicles->where('status', 'available')->count(),
                'rented' => $vehicles->where('status', 'rented')->count(),
                'maintenance' => $vehicles->where('status', 'maintenance')->count(),
                'out_of_service' => $vehicles->where('status', 'out_of_service')->count(),
            ];

            return Inertia::render('Transportation/Companies/Vehicles', [
                'company' => $company,
                'vehicles' => $vehicles,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading company vehicles: ' . $e->getMessage());
        }
    }

    /**
     * Display contacts for a specific company.
     */
    public function contacts(RentalCompany $company)
    {
        try {
            $contacts = $company->contacts()
                ->orderBy('is_primary', 'desc')
                ->orderBy('priority_level')
                ->orderBy('contact_type')
                ->orderBy('name')
                ->get();

            $stats = [
                'total' => $contacts->count(),
                'active' => $contacts->where('is_active', true)->count(),
                'primary' => $contacts->where('is_primary', true)->count(),
                'emergency' => $contacts->where('emergency_contact', true)->count(),
                'by_type' => $contacts->groupBy('contact_type')->map->count(),
            ];

            return Inertia::render('Transportation/Companies/Contacts', [
                'company' => $company,
                'contacts' => $contacts,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading company contacts: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new vehicle for the company.
     */
    public function createVehicle(RentalCompany $company)
    {
        $vehicleTypes = [
            'Sedan' => 'Sedan',
            'SUV' => 'SUV',
            'Hatchback' => 'Hatchback',
            'Coupe' => 'Coupe',
            'Convertible' => 'Convertible',
            'Wagon' => 'Wagon',
            'Van' => 'Van',
            'Minivan' => 'Minivan',
            'Pickup' => 'Pickup Truck',
            'Bus' => 'Bus',
            'Luxury' => 'Luxury Vehicle',
            'Sports' => 'Sports Car',
        ];

        $fuelTypes = [
            'Gasoline' => 'Gasoline',
            'Diesel' => 'Diesel',
            'Hybrid' => 'Hybrid',
            'Electric' => 'Electric',
            'LPG' => 'LPG',
            'CNG' => 'CNG',
        ];

        $transmissions = [
            'Manual' => 'Manual',
            'Automatic' => 'Automatic',
            'CVT' => 'CVT',
            'Semi-Automatic' => 'Semi-Automatic',
        ];

        $features = [
            'Air Conditioning' => 'Air Conditioning',
            'GPS Navigation' => 'GPS Navigation',
            'Bluetooth' => 'Bluetooth',
            'USB Port' => 'USB Port',
            'Backup Camera' => 'Backup Camera',
            'Parking Sensors' => 'Parking Sensors',
            'Sunroof' => 'Sunroof',
            'Leather Seats' => 'Leather Seats',
            'Heated Seats' => 'Heated Seats',
            'Cruise Control' => 'Cruise Control',
            'ABS' => 'ABS',
            'Airbags' => 'Airbags',
            'Child Safety Seats' => 'Child Safety Seats',
            'WiFi' => 'WiFi',
            'Entertainment System' => 'Entertainment System',
        ];

        // Get existing vehicles to use as templates
        $existingVehicles = CompanyVehicle::where('rental_company_id', '!=', $company->id)
            ->orWhereNull('rental_company_id')
            ->select([
                'id',
                'vehicle_type',
                'brand',
                'model',
                'year',
                'license_plate',
                'color',
                'seats',
                'baggage_capacity',
                'fuel_type',
                'transmission',
                'engine_size',
                'fuel_consumption',
                'mileage',
                'features',
                'description',
                'hourly_rate',
                'daily_rate',
                'weekly_rate',
                'monthly_rate',
                'weekend_rate',
                'holiday_rate',
                'mileage_charge_per_km',
                'included_mileage_per_day',
                'driver_charge_per_hour',
                'fuel_charge',
                'cleaning_fee',
                'insurance_daily_rate',
                'security_deposit',
                'insurance_included',
                'insurance_coverage',
                'requires_special_license',
                'minimum_age_requirement',
                'minimum_driving_experience',
                'current_location',
                'pickup_locations',
                'delivery_available',
                'delivery_charge',
                'delivery_radius_km',
                'last_service_date',
                'next_service_due',
                'insurance_expiry',
                'registration_expiry',
                'minimum_rental_hours',
                'maximum_rental_days',
                'route_pricing'
            ])
            ->limit(10)
            ->get();

        return Inertia::render('Transportation/Companies/CreateVehicle', [
            'company' => $company,
            'vehicleTypes' => $vehicleTypes,
            'fuelTypes' => $fuelTypes,
            'transmissions' => $transmissions,
            'features' => $features,
            'existingVehicles' => $existingVehicles,
        ]);
    }

    /**
     * Store a newly created vehicle for the company.
     */
    public function storeVehicle(Request $request, RentalCompany $company)
    {
        $validated = $request->validate([
            'vehicle_type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'required|string|max:20|unique:company_vehicles,license_plate',
            'color' => 'required|string|max:100',
            'seats' => 'required|integer|min:1|max:50',
            'fuel_type' => 'required|string|max:100',
            'transmission' => 'required|string|max:100',
            'engine_size' => 'nullable|string|max:100',
            'fuel_consumption' => 'nullable|numeric|min:0',
            'mileage' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'hourly_rate' => 'nullable|numeric|min:0',
            'daily_rate' => 'required|numeric|min:0',
            'weekly_rate' => 'nullable|numeric|min:0',
            'monthly_rate' => 'nullable|numeric|min:0',
            'weekend_rate' => 'nullable|numeric|min:0',
            'holiday_rate' => 'nullable|numeric|min:0',
            'mileage_charge_per_km' => 'nullable|numeric|min:0',
            'included_mileage_per_day' => 'nullable|integer|min:0',
            'driver_charge_per_hour' => 'nullable|numeric|min:0',
            'fuel_charge' => 'nullable|numeric|min:0',
            'cleaning_fee' => 'nullable|numeric|min:0',
            'insurance_daily_rate' => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'insurance_included' => 'boolean',
            'insurance_coverage' => 'nullable|string',
            'status' => 'required|in:available,rented,maintenance,out_of_service',
            'is_active' => 'boolean',
            'requires_special_license' => 'boolean',
            'minimum_age_requirement' => 'nullable|integer|min:18|max:100',
            'minimum_driving_experience' => 'nullable|integer|min:0',
            'current_location' => 'nullable|string|max:255',
            'pickup_locations' => 'nullable|array',
            'delivery_available' => 'boolean',
            'delivery_charge' => 'nullable|numeric|min:0',
            'delivery_radius_km' => 'nullable|integer|min:0',
            'last_service_date' => 'nullable|date',
            'next_service_due' => 'nullable|date|after:last_service_date',
            'insurance_expiry' => 'nullable|date',
            'registration_expiry' => 'nullable|date',
            'maintenance_notes' => 'nullable|string',
            'minimum_rental_hours' => 'nullable|integer|min:1',
            'maximum_rental_days' => 'nullable|integer|min:1',
            'blackout_dates' => 'nullable|array',
            'weekend_only' => 'boolean',
            'advance_booking_required' => 'boolean',
            'advance_booking_hours' => 'nullable|integer|min:0',
            'additional_features' => 'nullable|array',
            'special_instructions' => 'nullable|string',
            'admin_notes' => 'nullable|string',
        ]);

        try {
            $validated['rental_company_id'] = $company->id;
            $validated['status'] = $validated['status'] ?? 'available';
            $validated['is_active'] = $validated['is_active'] ?? true;

            $vehicle = CompanyVehicle::create($validated);

            return redirect()->route('transportation.companies.vehicles', $company)
                ->with('success', 'Vehicle added successfully!');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Error creating vehicle: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified vehicle.
     */
    public function editVehicle(RentalCompany $company, CompanyVehicle $vehicle)
    {
        $vehicleTypes = [
            'Sedan' => 'Sedan',
            'SUV' => 'SUV',
            'Hatchback' => 'Hatchback',
            'Coupe' => 'Coupe',
            'Convertible' => 'Convertible',
            'Wagon' => 'Wagon',
            'Van' => 'Van',
            'Minivan' => 'Minivan',
            'Pickup' => 'Pickup Truck',
            'Bus' => 'Bus',
            'Luxury' => 'Luxury Vehicle',
            'Sports' => 'Sports Car',
        ];

        $fuelTypes = [
            'Gasoline' => 'Gasoline',
            'Diesel' => 'Diesel',
            'Hybrid' => 'Hybrid',
            'Electric' => 'Electric',
            'LPG' => 'LPG',
            'CNG' => 'CNG',
        ];

        $transmissions = [
            'Manual' => 'Manual',
            'Automatic' => 'Automatic',
            'CVT' => 'CVT',
            'Semi-Automatic' => 'Semi-Automatic',
        ];

        $features = [
            'Air Conditioning' => 'Air Conditioning',
            'GPS Navigation' => 'GPS Navigation',
            'Bluetooth' => 'Bluetooth',
            'USB Port' => 'USB Port',
            'Backup Camera' => 'Backup Camera',
            'Parking Sensors' => 'Parking Sensors',
            'Sunroof' => 'Sunroof',
            'Leather Seats' => 'Leather Seats',
            'Heated Seats' => 'Heated Seats',
            'Cruise Control' => 'Cruise Control',
            'ABS' => 'ABS',
            'Airbags' => 'Airbags',
            'Child Safety Seats' => 'Child Safety Seats',
            'WiFi' => 'WiFi',
            'Entertainment System' => 'Entertainment System',
        ];

        return Inertia::render('Transportation/Companies/EditVehicle', [
            'company' => $company,
            'vehicle' => $vehicle,
            'vehicleTypes' => $vehicleTypes,
            'fuelTypes' => $fuelTypes,
            'transmissions' => $transmissions,
            'features' => $features,
        ]);
    }

    /**
     * Update the specified vehicle.
     */
    public function updateVehicle(Request $request, RentalCompany $company, CompanyVehicle $vehicle)
    {
        $validated = $request->validate([
            'vehicle_type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'license_plate' => 'required|string|max:20|unique:company_vehicles,license_plate,' . $vehicle->id,
            'color' => 'required|string|max:100',
            'seats' => 'required|integer|min:1|max:50',
            'fuel_type' => 'required|string|max:100',
            'transmission' => 'required|string|max:100',
            'engine_size' => 'nullable|string|max:100',
            'fuel_consumption' => 'nullable|numeric|min:0',
            'mileage' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'hourly_rate' => 'nullable|numeric|min:0',
            'daily_rate' => 'required|numeric|min:0',
            'weekly_rate' => 'nullable|numeric|min:0',
            'monthly_rate' => 'nullable|numeric|min:0',
            'weekend_rate' => 'nullable|numeric|min:0',
            'holiday_rate' => 'nullable|numeric|min:0',
            'mileage_charge_per_km' => 'nullable|numeric|min:0',
            'included_mileage_per_day' => 'nullable|integer|min:0',
            'driver_charge_per_hour' => 'nullable|numeric|min:0',
            'fuel_charge' => 'nullable|numeric|min:0',
            'cleaning_fee' => 'nullable|numeric|min:0',
            'insurance_daily_rate' => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'insurance_included' => 'boolean',
            'insurance_coverage' => 'nullable|string',
            'status' => 'required|in:available,rented,maintenance,out_of_service',
            'is_active' => 'boolean',
            'requires_special_license' => 'boolean',
            'minimum_age_requirement' => 'nullable|integer|min:18|max:100',
            'minimum_driving_experience' => 'nullable|integer|min:0',
            'current_location' => 'nullable|string|max:255',
            'pickup_locations' => 'nullable|array',
            'delivery_available' => 'boolean',
            'delivery_charge' => 'nullable|numeric|min:0',
            'delivery_radius_km' => 'nullable|integer|min:0',
            'last_service_date' => 'nullable|date',
            'next_service_due' => 'nullable|date|after:last_service_date',
            'insurance_expiry' => 'nullable|date',
            'registration_expiry' => 'nullable|date',
            'maintenance_notes' => 'nullable|string',
            'minimum_rental_hours' => 'nullable|integer|min:1',
            'maximum_rental_days' => 'nullable|integer|min:1',
            'blackout_dates' => 'nullable|array',
            'weekend_only' => 'boolean',
            'advance_booking_required' => 'boolean',
            'advance_booking_hours' => 'nullable|integer|min:0',
            'additional_features' => 'nullable|array',
            'special_instructions' => 'nullable|string',
            'admin_notes' => 'nullable|string',
        ]);

        try {
            $vehicle->update($validated);

            return redirect()->route('transportation.companies.vehicles', $company)
                ->with('success', 'Vehicle updated successfully!');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Error updating vehicle: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified vehicle from the company.
     */
    public function destroyVehicle(RentalCompany $company, CompanyVehicle $vehicle)
    {
        try {
            // Check if vehicle has active bookings
            if ($vehicle->status === 'rented') {
                return back()->with('error', 'Cannot delete vehicle that is currently rented.');
            }

            $vehicleName = $vehicle->display_name;
            $vehicle->delete();

            return redirect()->route('transportation.companies.vehicles', $company)
                ->with('success', "Vehicle '{$vehicleName}' deleted successfully!");
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting vehicle: ' . $e->getMessage());
        }
    }

    public function search(Request $request)
    {
        try {
            $query = RentalCompany::query();

            // Basic filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                });
            }

            if ($request->filled('city')) {
                $query->where('city', $request->city);
            }

            if ($request->filled('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            if ($request->filled('is_verified')) {
                $query->where('is_verified', $request->boolean('is_verified'));
            }

            if ($request->filled('is_featured')) {
                $query->where('is_featured', $request->boolean('is_featured'));
            }

            if ($request->filled('min_rating')) {
                $query->where('rating', '>=', $request->min_rating);
            }

            if ($request->filled('services')) {
                foreach ($request->services as $service) {
                    $query->whereJsonContains('services_offered', $service);
                }
            }

            if ($request->filled('coverage_areas')) {
                foreach ($request->coverage_areas as $area) {
                    $query->whereJsonContains('coverage_areas', $area);
                }
            }

            // Load relationships and get results
            $companies = $query->with(['vehicles', 'contacts'])
                ->withCount(['vehicles', 'activeVehicles', 'availableVehicles'])
                ->orderBy('is_featured', 'desc')
                ->orderBy('rating', 'desc')
                ->orderBy('name')
                ->paginate(12)
                ->withQueryString();

            return response()->json($companies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Search failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display transportation reports and analytics.
     */
    public function reports()
    {
        try {
            // Get all vehicles with their companies
            $vehicles = CompanyVehicle::with('rentalCompany')
                ->orderBy('revenue_to_date', 'desc')
                ->get();

            // Calculate statistics
            $stats = [
                'total_revenue' => $vehicles->sum('revenue_to_date'),
                'active_vehicles' => $vehicles->where('is_active', true)->count(),
                'available_vehicles' => $vehicles->where('status', 'available')->count(),
                'rented_vehicles' => $vehicles->where('status', 'rented')->count(),
                'maintenance_vehicles' => $vehicles->where('status', 'maintenance')->count(),
                'out_of_service_vehicles' => $vehicles->where('status', 'out_of_service')->count(),
                'total_bookings' => $vehicles->sum('total_bookings'),
                'average_rating' => $vehicles->avg('average_rating'),
                'total_reviews' => $vehicles->sum('total_reviews'),
                'utilization_rate' => $vehicles->count() > 0 ? round(($vehicles->where('status', 'rented')->count() / $vehicles->count()) * 100, 1) : 0,
                'avg_booking_duration' => 3.5, // This would come from actual booking data
            ];

            // Generate monthly revenue data (mock data for demonstration)
            $monthlyRevenue = [
                ['month' => 'Jan', 'revenue' => 15000],
                ['month' => 'Feb', 'revenue' => 18000],
                ['month' => 'Mar', 'revenue' => 22000],
                ['month' => 'Apr', 'revenue' => 19000],
                ['month' => 'May', 'revenue' => 25000],
                ['month' => 'Jun', 'revenue' => 28000],
                ['month' => 'Jul', 'revenue' => 32000],
                ['month' => 'Aug', 'revenue' => 30000],
                ['month' => 'Sep', 'revenue' => 35000],
                ['month' => 'Oct', 'revenue' => 38000],
                ['month' => 'Nov', 'revenue' => 42000],
                ['month' => 'Dec', 'revenue' => 45000],
            ];

            // Vehicle types distribution
            $vehicleTypes = $vehicles->groupBy('vehicle_type')->map(function ($group, $type) {
                return [
                    'type' => $type,
                    'count' => $group->count(),
                    'revenue' => $group->sum('revenue_to_date')
                ];
            })->values();

            // Top routes (mock data - would come from actual booking data)
            $topRoutes = [
                ['route' => 'Cairo → Giza', 'bookings' => 45, 'revenue' => 2700],
                ['route' => 'Cairo → Alexandria', 'bookings' => 32, 'revenue' => 16000],
                ['route' => 'Cairo → Sharm El Sheikh', 'bookings' => 28, 'revenue' => 22400],
                ['route' => 'Cairo → Luxor', 'bookings' => 22, 'revenue' => 8800],
                ['route' => 'Airport → Downtown', 'bookings' => 67, 'revenue' => 5360],
            ];

            return Inertia::render('Transportation/Reports', [
                'stats' => $stats,
                'vehicles' => $vehicles,
                'companies' => RentalCompany::withCount('vehicles')->get(),
                'monthlyRevenue' => $monthlyRevenue,
                'vehicleTypes' => $vehicleTypes,
                'topRoutes' => $topRoutes,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading reports: ' . $e->getMessage());
        }
    }

    /**
     * Test method to verify controller is working
     */
    public function testMethod()
    {
        return 'Test method works!';
    }
}
