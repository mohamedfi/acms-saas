<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Participant::query();

        if ($request->has('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->q . '%')
                    ->orWhere('email', 'like', '%' . $request->q . '%')
                    ->orWhere('organization', 'like', '%' . $request->q . '%');
            });
        }

        $participants = $query->with('enrollments.courseInstance.course')
            ->orderBy('full_name')
            ->paginate(15);

        return response()->json($participants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'passport_no' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $participant = Participant::create($validated);

        return response()->json($participant, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Participant $participant)
    {
        return response()->json($participant->load([
            'enrollments.courseInstance.course',
            'attendanceRecords.courseInstance.course',
            'evaluations.courseInstance.course'
        ]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Participant $participant)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'passport_no' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $participant->update($validated);

        return response()->json($participant);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant)
    {
        $participant->delete();

        return response()->json(['message' => 'Participant deleted successfully'], 204);
    }
}
