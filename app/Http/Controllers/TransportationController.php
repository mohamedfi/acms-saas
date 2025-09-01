<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TransportationVehicle;
use App\Models\TransportationBooking;
use App\Models\TransportationMaintenance;
use Illuminate\Support\Facades\DB;

class TransportationController extends Controller
{
    public function index()
    {
        $vehicles = TransportationVehicle::with(['bookings', 'maintenanceRecords'])
            ->active()
            ->orderBy('brand')
            ->orderBy('model')
            ->get();

        $stats = [
            'total_vehicles' => TransportationVehicle::active()->count(),
            'available_vehicles' => TransportationVehicle::active()->available()->count(),
            'rented_vehicles' => TransportationVehicle::active()->where('status', 'rented')->count(),
            'maintenance_vehicles' => TransportationVehicle::active()->where('status', 'maintenance')->count(),
            'total_bookings_today' => TransportationBooking::whereDate('pickup_datetime', today())->count(),
            'active_bookings' => TransportationBooking::where('booking_status', 'active')->count(),
            'pending_payments' => TransportationBooking::where('payment_status', 'pending')->count(),
        ];

        return Inertia::render('Transportation/Index', [
            'vehicles' => $vehicles,
            'stats' => $stats,
        ]);
    }

    public function vehicles()
    {
        $vehicles = TransportationVehicle::with(['bookings', 'maintenanceRecords'])
            ->active()
            ->orderBy('brand')
            ->orderBy('model')
            ->get();

        return Inertia::render('Transportation/Vehicles', [
            'vehicles' => $vehicles,
        ]);
    }

    public function createVehicle()
    {
        return Inertia::render('Transportation/CreateVehicle');
    }

    public function storeVehicle(Request $request)
    {
        $validated = $request->validate([
            'vehicle_type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'license_plate' => 'required|string|max:20|unique:transportation_vehicles',
            'color' => 'required|string|max:100',
            'seats' => 'required|integer|min:1|max:50',
            'fuel_type' => 'required|string|max:100',
            'transmission' => 'required|string|max:100',
            'features' => 'nullable|array',
            'description' => 'nullable|string',
            'daily_rate' => 'required|numeric|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'weekly_rate' => 'nullable|numeric|min:0',
            'monthly_rate' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'insurance_info' => 'nullable|string',
        ]);

        $validated['status'] = 'available';
        $validated['is_active'] = true;

        TransportationVehicle::create($validated);

        return redirect()->route('transportation.vehicles')->with('success', 'Vehicle added successfully!');
    }

    public function editVehicle(TransportationVehicle $vehicle)
    {
        $vehicle->load(['bookings', 'maintenanceRecords']);
        
        return Inertia::render('Transportation/EditVehicle', [
            'vehicle' => $vehicle,
        ]);
    }

    public function updateVehicle(Request $request, TransportationVehicle $vehicle)
    {
        $validated = $request->validate([
            'vehicle_type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'license_plate' => 'required|string|max:20|unique:transportation_vehicles,license_plate,' . $vehicle->id,
            'color' => 'required|string|max:100',
            'seats' => 'required|integer|min:1|max:50',
            'fuel_type' => 'required|string|max:100',
            'transmission' => 'required|string|max:100',
            'features' => 'nullable|array',
            'description' => 'nullable|string',
            'daily_rate' => 'required|numeric|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'weekly_rate' => 'nullable|numeric|min:0',
            'monthly_rate' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'insurance_info' => 'nullable|string',
            'status' => 'required|in:available,rented,maintenance,out_of_service',
            'is_active' => 'boolean',
        ]);

        $vehicle->update($validated);

        return redirect()->route('transportation.vehicles')->with('success', 'Vehicle updated successfully!');
    }

    public function toggleVehicleStatus(TransportationVehicle $vehicle)
    {
        $vehicle->update(['is_active' => !$vehicle->is_active]);
        
        $status = $vehicle->is_active ? 'activated' : 'deactivated';
        return redirect()->route('transportation.vehicles')->with('success', "Vehicle {$status} successfully!");
    }

    public function bookings()
    {
        $bookings = TransportationBooking::with(['vehicle'])
            ->orderBy('pickup_datetime', 'desc')
            ->get();

        return Inertia::render('Transportation/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    public function createBooking()
    {
        $vehicles = TransportationVehicle::active()->available()->get();
        
        return Inertia::render('Transportation/CreateBooking', [
            'vehicles' => $vehicles,
        ]);
    }

    public function storeBooking(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:transportation_vehicles,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_id_type' => 'nullable|string|max:100',
            'customer_id_number' => 'nullable|string|max:100',
            'customer_address' => 'nullable|string',
            'pickup_location' => 'required|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'pickup_datetime' => 'required|date|after:now',
            'dropoff_datetime' => 'required|date|after:pickup_datetime',
            'special_requests' => 'nullable|string',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:20',
            'driver_license' => 'nullable|string|max:100',
        ]);

        // Calculate duration and cost
        $pickup = \Carbon\Carbon::parse($validated['pickup_datetime']);
        $dropoff = \Carbon\Carbon::parse($validated['dropoff_datetime']);
        
        $durationHours = $pickup->diffInHours($dropoff);
        $durationDays = $pickup->diffInDays($dropoff);
        
        $vehicle = TransportationVehicle::find($validated['vehicle_id']);
        $totalAmount = $vehicle->calculateRentalCost($durationDays, $durationHours);

        $validated['duration_hours'] = $durationHours;
        $validated['duration_days'] = $durationDays;
        $validated['total_amount'] = $totalAmount;
        $validated['payment_status'] = 'pending';
        $validated['booking_status'] = 'confirmed';

        $booking = TransportationBooking::create($validated);

        // Update vehicle status
        $vehicle->update(['status' => 'rented']);

        return redirect()->route('transportation.bookings')->with('success', 'Booking created successfully!');
    }

    public function editBooking(TransportationBooking $booking)
    {
        $booking->load('vehicle');
        $vehicles = TransportationVehicle::active()->get();
        
        return Inertia::render('Transportation/EditBooking', [
            'booking' => $booking,
            'vehicles' => $vehicles,
        ]);
    }

    public function updateBooking(Request $request, TransportationBooking $booking)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:transportation_vehicles,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_id_type' => 'nullable|string|max:100',
            'customer_id_number' => 'nullable|string|max:100',
            'customer_address' => 'nullable|string',
            'pickup_location' => 'required|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'pickup_datetime' => 'required|date',
            'dropoff_datetime' => 'required|date|after:pickup_datetime',
            'special_requests' => 'nullable|string',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:20',
            'driver_license' => 'nullable|string|max:100',
            'payment_status' => 'required|in:pending,paid,refunded',
            'booking_status' => 'required|in:confirmed,active,completed,cancelled',
            'fuel_charge' => 'nullable|numeric|min:0',
            'insurance_charge' => 'nullable|numeric|min:0',
            'additional_charges' => 'nullable|numeric|min:0',
            'damage_charges' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        return redirect()->route('transportation.bookings')->with('success', 'Booking updated successfully!');
    }

    public function markAsPickedUp(TransportationBooking $booking)
    {
        $booking->markAsPickedUp();
        
        return redirect()->route('transportation.bookings')->with('success', 'Vehicle marked as picked up!');
    }

    public function markAsReturned(Request $request, TransportationBooking $booking)
    {
        $validated = $request->validate([
            'actual_mileage' => 'nullable|integer|min:0',
            'damage_report' => 'nullable|string',
            'damage_charges' => 'nullable|numeric|min:0',
        ]);

        $booking->update($validated);
        $booking->markAsReturned($validated['actual_mileage'] ?? null);

        // Update vehicle status and mileage
        $vehicle = $booking->vehicle;
        $vehicle->update([
            'status' => 'available',
            'mileage' => $vehicle->mileage + ($validated['actual_mileage'] ?? 0)
        ]);

        return redirect()->route('transportation.bookings')->with('success', 'Vehicle marked as returned!');
    }

    public function maintenance()
    {
        $maintenanceRecords = TransportationMaintenance::with(['vehicle'])
            ->orderBy('maintenance_date', 'desc')
            ->get();

        $vehicles = TransportationVehicle::active()->get();

        return Inertia::render('Transportation/Maintenance', [
            'maintenanceRecords' => $maintenanceRecords,
            'vehicles' => $vehicles,
        ]);
    }

    public function storeMaintenance(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:transportation_vehicles,id',
            'maintenance_type' => 'required|in:routine,repair,inspection,emergency',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'maintenance_date' => 'required|date',
            'next_maintenance_date' => 'nullable|date|after:maintenance_date',
            'cost' => 'required|numeric|min:0',
            'mechanic_name' => 'nullable|string|max:255',
            'mechanic_phone' => 'nullable|string|max:20',
            'garage_name' => 'nullable|string|max:255',
            'garage_address' => 'nullable|string',
            'work_performed' => 'nullable|string',
            'parts_replaced' => 'nullable|string',
            'mileage_at_service' => 'required|integer|min:0',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
            'invoice_number' => 'nullable|string|max:255',
            'warranty_info' => 'nullable|string',
        ]);

        TransportationMaintenance::create($validated);

        return redirect()->route('transportation.maintenance')->with('success', 'Maintenance record created successfully!');
    }

    public function updateMaintenance(Request $request, TransportationMaintenance $maintenance)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:transportation_vehicles,id',
            'maintenance_type' => 'required|in:routine,repair,inspection,emergency',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'maintenance_date' => 'required|date',
            'next_maintenance_date' => 'nullable|date|after:maintenance_date',
            'cost' => 'required|numeric|min:0',
            'mechanic_name' => 'nullable|string|max:255',
            'mechanic_phone' => 'nullable|string|max:20',
            'garage_name' => 'nullable|string|max:255',
            'garage_address' => 'nullable|string',
            'work_performed' => 'nullable|string',
            'parts_replaced' => 'nullable|string',
            'mileage_at_service' => 'required|integer|min:0',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
            'invoice_number' => 'nullable|string|max:255',
            'warranty_info' => 'nullable|string',
        ]);

        $maintenance->update($validated);

        return redirect()->route('transportation.maintenance')->with('success', 'Maintenance record updated successfully!');
    }

    public function dashboard()
    {
        $stats = [
            'total_vehicles' => TransportationVehicle::active()->count(),
            'available_vehicles' => TransportationVehicle::active()->available()->count(),
            'rented_vehicles' => TransportationVehicle::active()->where('status', 'rented')->count(),
            'maintenance_vehicles' => TransportationVehicle::active()->where('status', 'maintenance')->count(),
            'total_bookings_today' => TransportationBooking::whereDate('pickup_datetime', today())->count(),
            'active_bookings' => TransportationBooking::where('booking_status', 'active')->count(),
            'pending_payments' => TransportationBooking::where('payment_status', 'pending')->count(),
            'upcoming_maintenance' => TransportationMaintenance::upcoming()->count(),
            'overdue_maintenance' => TransportationMaintenance::overdue()->count(),
        ];

        $recentBookings = TransportationBooking::with(['vehicle'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $upcomingMaintenance = TransportationMaintenance::with(['vehicle'])
            ->upcoming()
            ->orderBy('next_maintenance_date')
            ->limit(5)
            ->get();

        $revenueStats = $this->getRevenueStats();

        return Inertia::render('Transportation/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'upcomingMaintenance' => $upcomingMaintenance,
            'revenueStats' => $revenueStats,
        ]);
    }

    private function getRevenueStats()
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $currentMonthRevenue = TransportationBooking::where('payment_status', 'paid')
            ->whereMonth('created_at', $currentMonth->month)
            ->whereYear('created_at', $currentMonth->year)
            ->sum('total_amount');

        $lastMonthRevenue = TransportationBooking::where('payment_status', 'paid')
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->sum('total_amount');

        $totalRevenue = TransportationBooking::where('payment_status', 'paid')->sum('total_amount');

        return [
            'current_month' => $currentMonthRevenue,
            'last_month' => $lastMonthRevenue,
            'total' => $totalRevenue,
            'growth' => $lastMonthRevenue > 0 ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0,
        ];
    }
}
