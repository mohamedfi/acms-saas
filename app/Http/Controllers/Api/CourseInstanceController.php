<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseInstance;
use Illuminate\Http\Request;

class CourseInstanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Course $course)
    {
        $instances = $course->instances()
            ->with(['course', 'enrollments.participant'])
            ->orderBy('start_date', 'desc')
            ->paginate(15);

        return response()->json($instances);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'venue_name' => 'nullable|string|max:255',
            'venue_address' => 'nullable|string',
            'needs_visa' => 'boolean',
        ]);

        $validated['course_id'] = $course->id;
        $validated['status'] = 'draft';
        $validated['logistics_cost'] = 0;

        $instance = CourseInstance::create($validated);

        return response()->json($instance->load('course'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseInstance $instance)
    {
        return response()->json($instance->load([
            'course.trainer',
            'course.coordinator',
            'enrollments.participant',
            'flightBookings',
            'hotelBookings',
            'transportBookings',
            'visaApplications',
            'perDiems'
        ]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'venue_name' => 'nullable|string|max:255',
            'venue_address' => 'nullable|string',
            'needs_visa' => 'boolean',
            'status' => 'in:draft,scheduled,completed,canceled',
        ]);

        $instance->update($validated);

        return response()->json($instance->load('course'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseInstance $instance)
    {
        $instance->delete();

        return response()->json(['message' => 'Course instance deleted successfully'], 204);
    }
}
