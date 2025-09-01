<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HotelBooking;
use App\Models\CourseInstance;
use Illuminate\Http\Request;

class HotelBookingController extends Controller
{
    /**
     * Display a listing of hotel bookings for a course instance
     */
    public function index(CourseInstance $instance)
    {
        $hotels = $instance->hotelBookings()
            ->with('guest')
            ->orderBy('checkin')
            ->get();

        return response()->json($hotels);
    }

    /**
     * Store a newly created hotel booking
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'guest_user_id' => 'required|exists:users,id',
            'hotel_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'checkin' => 'required|date',
            'checkout' => 'required|date|after:checkin',
            'nightly_rate' => 'required|numeric|min:0',
            'taxes' => 'nullable|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        $validated['course_instance_id'] = $instance->id;
        $validated['status'] = 'pending';
        $validated['taxes'] = $validated['taxes'] ?? 0;

        $hotel = HotelBooking::create($validated);

        return response()->json($hotel->load('guest'), 201);
    }

    /**
     * Display the specified hotel booking
     */
    public function show(HotelBooking $hotelBooking)
    {
        return response()->json($hotelBooking->load('guest', 'courseInstance'));
    }

    /**
     * Update the specified hotel booking
     */
    public function update(Request $request, HotelBooking $hotelBooking)
    {
        $validated = $request->validate([
            'guest_user_id' => 'sometimes|exists:users,id',
            'hotel_name' => 'sometimes|string|max:255',
            'address' => 'nullable|string',
            'checkin' => 'sometimes|date',
            'checkout' => 'sometimes|date|after:checkin',
            'nightly_rate' => 'sometimes|numeric|min:0',
            'taxes' => 'nullable|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'status' => 'sometimes|in:pending,approved,denied',
        ]);

        $hotelBooking->update($validated);

        return response()->json($hotelBooking->fresh()->load('guest'));
    }

    /**
     * Remove the specified hotel booking
     */
    public function destroy(HotelBooking $hotelBooking)
    {
        $hotelBooking->delete();

        return response()->json(['message' => 'Hotel booking deleted successfully']);
    }
}
