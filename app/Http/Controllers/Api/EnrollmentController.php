<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseInstance;
use App\Models\Enrollment;
use App\Models\Participant;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Enroll participant in a course instance
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'participant_id' => 'required|exists:participants,id',
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('course_instance_id', $instance->id)
            ->where('participant_id', $validated['participant_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Participant already enrolled'], 409);
        }

        $enrollment = Enrollment::create([
            'course_instance_id' => $instance->id,
            'participant_id' => $validated['participant_id'],
            'status' => 'registered',
        ]);

        return response()->json($enrollment->load('participant'), 201);
    }

    /**
     * Update enrollment status
     */
    public function update(Request $request, CourseInstance $instance, Participant $participant)
    {
        $validated = $request->validate([
            'status' => 'required|in:registered,confirmed,canceled,completed',
        ]);

        $enrollment = Enrollment::where('course_instance_id', $instance->id)
            ->where('participant_id', $participant->id)
            ->firstOrFail();

        $enrollment->update($validated);

        return response()->json($enrollment->load('participant'));
    }

    /**
     * Remove participant from course instance
     */
    public function destroy(CourseInstance $instance, Participant $participant)
    {
        $enrollment = Enrollment::where('course_instance_id', $instance->id)
            ->where('participant_id', $participant->id)
            ->firstOrFail();

        $enrollment->delete();

        return response()->json(['message' => 'Participant unenrolled successfully'], 204);
    }

    /**
     * Get participants for a course instance
     */
    public function participants(CourseInstance $instance)
    {
        $participants = $instance->participants()
            ->withPivot('status', 'created_at')
            ->orderBy('enrollments.created_at', 'desc')
            ->get();

        return response()->json($participants);
    }
}
