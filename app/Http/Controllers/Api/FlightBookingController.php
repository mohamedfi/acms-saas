<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FlightBooking;
use App\Models\CourseInstance;
use Illuminate\Http\Request;

class FlightBookingController extends Controller
{
    /**
     * Display a listing of flight bookings for a course instance
     */
    public function index(CourseInstance $instance)
    {
        $flights = $instance->flightBookings()
            ->with('traveler')
            ->orderBy('depart_at')
            ->get();

        return response()->json($flights);
    }

    /**
     * Store a newly created flight booking
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'traveler_user_id' => 'required|exists:users,id',
            'airline' => 'required|string|max:255',
            'flight_no' => 'nullable|string|max:50',
            'depart_airport' => 'required|string|max:10',
            'arrive_airport' => 'required|string|max:10',
            'depart_at' => 'required|date',
            'return_at' => 'nullable|date|after:depart_at',
            'cost' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        $validated['course_instance_id'] = $instance->id;
        $validated['status'] = 'pending';

        $flight = FlightBooking::create($validated);

        return response()->json($flight->load('traveler'), 201);
    }

    /**
     * Display the specified flight booking
     */
    public function show(FlightBooking $flightBooking)
    {
        return response()->json($flightBooking->load('traveler', 'courseInstance'));
    }

    /**
     * Update the specified flight booking
     */
    public function update(Request $request, FlightBooking $flightBooking)
    {
        $validated = $request->validate([
            'traveler_user_id' => 'sometimes|exists:users,id',
            'airline' => 'sometimes|string|max:255',
            'flight_no' => 'nullable|string|max:50',
            'depart_airport' => 'sometimes|string|max:10',
            'arrive_airport' => 'sometimes|string|max:10',
            'depart_at' => 'sometimes|date',
            'return_at' => 'nullable|date|after:depart_at',
            'cost' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'status' => 'sometimes|in:pending,approved,denied',
        ]);

        $flightBooking->update($validated);

        return response()->json($flightBooking->fresh()->load('traveler'));
    }

    /**
     * Remove the specified flight booking
     */
    public function destroy(FlightBooking $flightBooking)
    {
        $flightBooking->delete();

        return response()->json(['message' => 'Flight booking deleted successfully']);
    }
}
