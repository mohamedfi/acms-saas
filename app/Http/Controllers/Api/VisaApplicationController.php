<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisaApplication;
use App\Models\CourseInstance;
use Illuminate\Http\Request;

class VisaApplicationController extends Controller
{
    /**
     * Display a listing of visa applications for a course instance
     */
    public function index(CourseInstance $instance)
    {
        $visas = $instance->visaApplications()
            ->with('traveler')
            ->orderBy('submitted_at', 'desc')
            ->get();

        return response()->json($visas);
    }

    /**
     * Store a newly created visa application
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'traveler_user_id' => 'required|exists:users,id',
            'destination_country' => 'required|string|max:100',
            'application_no' => 'nullable|string|max:100',
            'submitted_at' => 'nullable|date',
            'fee' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        $validated['course_instance_id'] = $instance->id;
        $validated['status'] = 'pending';
        $validated['submitted_at'] = $validated['submitted_at'] ?? now();

        $visa = VisaApplication::create($validated);

        return response()->json($visa->load('traveler'), 201);
    }

    /**
     * Display the specified visa application
     */
    public function show(VisaApplication $visaApplication)
    {
        return response()->json($visaApplication->load('traveler', 'courseInstance'));
    }

    /**
     * Update the specified visa application
     */
    public function update(Request $request, VisaApplication $visaApplication)
    {
        $validated = $request->validate([
            'traveler_user_id' => 'sometimes|exists:users,id',
            'destination_country' => 'sometimes|string|max:100',
            'application_no' => 'nullable|string|max:100',
            'submitted_at' => 'sometimes|date',
            'fee' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'status' => 'sometimes|in:pending,approved,denied',
        ]);

        $visaApplication->update($validated);

        return response()->json($visaApplication->fresh()->load('traveler'));
    }

    /**
     * Remove the specified visa application
     */
    public function destroy(VisaApplication $visaApplication)
    {
        $visaApplication->delete();

        return response()->json(['message' => 'Visa application deleted successfully']);
    }
}
