<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\Request;

class TrainerController extends Controller
{
    /**
     * Display a listing of trainers.
     */
    public function index()
    {
        $trainers = Trainer::select('id', 'full_name', 'email', 'position', 'expertise_areas')
            ->where('status', 'active')
            ->orderBy('full_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $trainers
        ]);
    }

    /**
     * Store a newly created trainer in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:trainers,email',
            'phone' => 'required|string|max:20',
            'position' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'expertise_areas' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'notes' => 'nullable|string',
        ]);

        $trainer = Trainer::create($validated);

        return response()->json([
            'success' => true,
            'data' => $trainer,
            'message' => 'Trainer created successfully'
        ], 201);
    }

    /**
     * Display the specified trainer.
     */
    public function show(Trainer $trainer)
    {
        return response()->json([
            'success' => true,
            'data' => $trainer
        ]);
    }

    /**
     * Update the specified trainer in storage.
     */
    public function update(Request $request, Trainer $trainer)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:trainers,email,' . $trainer->id,
            'phone' => 'required|string|max:20',
            'position' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'expertise_areas' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'notes' => 'nullable|string',
        ]);

        $trainer->update($validated);

        return response()->json([
            'success' => true,
            'data' => $trainer,
            'message' => 'Trainer updated successfully'
        ]);
    }

    /**
     * Remove the specified trainer from storage.
     */
    public function destroy(Trainer $trainer)
    {
        $trainer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Trainer deleted successfully'
        ]);
    }
}
