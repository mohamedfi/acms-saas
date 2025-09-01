<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Course::with(['trainer', 'coordinator', 'instances']);

        // Filter by delivery type
        if ($request->has('delivery_type')) {
            $query->where('delivery_type', $request->delivery_type);
        }

        // Search by name or code
        if ($request->has('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->q . '%')
                    ->orWhere('code', 'like', '%' . $request->q . '%');
            });
        }

        // Role-based filtering
        $user = $request->user();
        if ($user->role->name === 'coordinator') {
            $query->where('coordinator_id', $user->id);
        } elseif ($user->role->name === 'trainer') {
            $query->where('trainer_id', $user->id);
        }

        $courses = $query->paginate(15);

        return response()->json($courses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:courses',
            'description' => 'nullable|string',
            'delivery_type' => 'required|in:office,offsite,abroad',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'trainer_id' => 'nullable|exists:users,id',
            'coordinator_id' => 'nullable|exists:users,id',
        ]);

        $course = Course::create($validated);

        return response()->json($course->load(['trainer', 'coordinator']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        return response()->json($course->load(['trainer', 'coordinator', 'instances.enrollments.participant']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:courses,code,' . $course->id,
            'description' => 'nullable|string',
            'delivery_type' => 'required|in:office,offsite,abroad',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'trainer_id' => 'nullable|exists:users,id',
            'coordinator_id' => 'nullable|exists:users,id',
        ]);

        $course->update($validated);

        return response()->json($course->load(['trainer', 'coordinator']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully'], 204);
    }
}
