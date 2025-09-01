<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PerDiem;
use App\Models\CourseInstance;
use Illuminate\Http\Request;

class PerDiemController extends Controller
{
    /**
     * Display a listing of per-diems for a course instance
     */
    public function index(CourseInstance $instance)
    {
        $perdiems = $instance->perDiems()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($perdiems);
    }

    /**
     * Store a newly created per-diem
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rate_per_day' => 'required|numeric|min:0',
            'days' => 'required|integer|min:1',
            'currency' => 'required|string|size:3',
        ]);

        $validated['course_instance_id'] = $instance->id;
        // total_amount will be calculated automatically in the model

        $perdiem = PerDiem::create($validated);

        return response()->json($perdiem->load('user'), 201);
    }

    /**
     * Display the specified per-diem
     */
    public function show(PerDiem $perDiem)
    {
        return response()->json($perDiem->load('user', 'courseInstance'));
    }

    /**
     * Update the specified per-diem
     */
    public function update(Request $request, PerDiem $perDiem)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'rate_per_day' => 'sometimes|numeric|min:0',
            'days' => 'sometimes|integer|min:1',
            'currency' => 'sometimes|string|size:3',
        ]);

        $perDiem->update($validated);

        return response()->json($perDiem->fresh()->load('user'));
    }

    /**
     * Remove the specified per-diem
     */
    public function destroy(PerDiem $perDiem)
    {
        $perDiem->delete();

        return response()->json(['message' => 'Per-diem deleted successfully']);
    }
}
