<?php

namespace App\Http\Controllers;

use App\Models\CourseLocation;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CourseLocationController extends Controller
{
    /**
     * Display a listing of course locations.
     */
    public function index()
    {
        $locations = CourseLocation::withCount('courses')
            ->ordered()
            ->get();

        $stats = [
            'total_locations' => CourseLocation::count(),
            'active_locations' => CourseLocation::active()->count(),
            'total_courses' => Course::count(),
            'locations_by_type' => CourseLocation::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->get()
                ->pluck('count', 'type')
                ->toArray(),
        ];

        return Inertia::render('CourseLocationManagement/Index', [
            'locations' => $locations,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new course location.
     */
    public function create()
    {
        return Inertia::render('CourseLocationManagement/Create');
    }

    /**
     * Store a newly created course location in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:training_center,office,conference_room,hotel,client_site',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'facilities' => 'nullable|array',
            'contact_person' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        CourseLocation::create($validated);

        return redirect()->route('course-location-management.index')
            ->with('success', 'Course location created successfully.');
    }

    /**
     * Display the specified course location.
     */
    public function show(CourseLocation $location)
    {
        $location->load('courses');

        return Inertia::render('CourseLocationManagement/Show', [
            'location' => $location,
        ]);
    }

    /**
     * Show the form for editing the specified course location.
     */
    public function edit(CourseLocation $location)
    {
        return Inertia::render('CourseLocationManagement/Edit', [
            'location' => $location,
        ]);
    }

    /**
     * Update the specified course location in storage.
     */
    public function update(Request $request, CourseLocation $location)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:training_center,office,conference_room,hotel,client_site,other',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'facilities' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $location->update($validated);

        return redirect()->route('course-location-management.index')
            ->with('success', 'Course location updated successfully.');
    }

    /**
     * Remove the specified course location from storage.
     */
    public function destroy(CourseLocation $location)
    {
        // Check if location has courses
        if ($location->courses()->count() > 0) {
            return back()->with('error', 'Cannot delete location with assigned courses.');
        }

        $location->delete();

        return redirect()->route('course-location-management.index')
            ->with('success', 'Course location deleted successfully.');
    }

    /**
     * Toggle location active status.
     */
    public function toggleStatus(CourseLocation $location)
    {
        $location->update(['is_active' => !$location->is_active]);

        $status = $location->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Course location {$status} successfully.");
    }

    /**
     * Get locations for API/select dropdowns.
     */
    public function api()
    {
        $locations = CourseLocation::active()
            ->ordered()
            ->select('id', 'name', 'type', 'city', 'country')
            ->get();

        return response()->json(['data' => $locations]);
    }
}
