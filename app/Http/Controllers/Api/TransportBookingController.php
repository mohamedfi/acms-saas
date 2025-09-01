<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransportBooking;
use App\Models\CourseInstance;
use Illuminate\Http\Request;

class TransportBookingController extends Controller
{
    /**
     * Display a listing of transport bookings for a course instance
     */
    public function index(CourseInstance $instance)
    {
        $transport = $instance->transportBookings()
            ->orderBy('pickup_at')
            ->get();

        return response()->json($transport);
    }

    /**
     * Store a newly created transport booking
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:taxi,bus,car_rental,train,other',
            'provider' => 'required|string|max:255',
            'pickup_at' => 'nullable|string|max:255',
            'dropoff_at' => 'nullable|string|max:255',
            'cost' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        $validated['course_instance_id'] = $instance->id;
        $validated['status'] = 'pending';

        $transport = TransportBooking::create($validated);

        return response()->json($transport, 201);
    }

    /**
     * Display the specified transport booking
     */
    public function show(TransportBooking $transportBooking)
    {
        return response()->json($transportBooking->load('courseInstance'));
    }

    /**
     * Update the specified transport booking
     */
    public function update(Request $request, TransportBooking $transportBooking)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|in:taxi,bus,car_rental,train,other',
            'provider' => 'sometimes|string|max:255',
            'pickup_at' => 'nullable|string|max:255',
            'dropoff_at' => 'nullable|string|max:255',
            'cost' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'status' => 'sometimes|in:pending,approved,denied',
        ]);

        $transportBooking->update($validated);

        return response()->json($transportBooking->fresh());
    }

    /**
     * Remove the specified transport booking
     */
    public function destroy(TransportBooking $transportBooking)
    {
        $transportBooking->delete();

        return response()->json(['message' => 'Transport booking deleted successfully']);
    }
}
