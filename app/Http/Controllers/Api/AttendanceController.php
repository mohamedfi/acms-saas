<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\CourseInstance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display attendance records for a course instance
     */
    public function index(Request $request, CourseInstance $instance)
    {
        $attendance = $instance->attendanceRecords()
            ->with('participant')
            ->orderBy('occurred_at', 'desc')
            ->paginate(15);

        return response()->json($attendance);
    }

    /**
     * Record attendance for a participant
     */
    public function store(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'participant_id' => 'required|exists:participants,id',
            'status' => 'required|in:present,absent,late',
            'occurred_at' => 'nullable|date',
            'method' => 'required|in:qr,manual',
            'geo' => 'nullable|array',
            'photo_path' => 'nullable|string',
        ]);

        $validated['course_instance_id'] = $instance->id;
        $validated['occurred_at'] = $validated['occurred_at'] ?? Carbon::now();

        // Check if attendance already exists for this participant today
        $existing = AttendanceRecord::where('course_instance_id', $instance->id)
            ->where('participant_id', $validated['participant_id'])
            ->whereDate('occurred_at', Carbon::parse($validated['occurred_at'])->toDateString())
            ->first();

        if ($existing) {
            $existing->update($validated);
            $attendance = $existing;
        } else {
            $attendance = AttendanceRecord::create($validated);
        }

        return response()->json($attendance->load('participant'), 201);
    }

    /**
     * Bulk attendance recording
     */
    public function bulkStore(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.participant_id' => 'required|exists:participants,id',
            'records.*.status' => 'required|in:present,absent,late',
            'records.*.occurred_at' => 'nullable|date',
        ]);

        $records = [];
        $date = Carbon::now()->toDateString();

        foreach ($validated['records'] as $record) {
            $record['course_instance_id'] = $instance->id;
            $record['occurred_at'] = $record['occurred_at'] ?? Carbon::now();
            $record['method'] = 'manual';

            // Check if attendance already exists
            $existing = AttendanceRecord::where('course_instance_id', $instance->id)
                ->where('participant_id', $record['participant_id'])
                ->whereDate('occurred_at', $date)
                ->first();

            if ($existing) {
                $existing->update($record);
                $records[] = $existing;
            } else {
                $records[] = AttendanceRecord::create($record);
            }
        }

        return response()->json($records, 201);
    }

    /**
     * Generate QR code for attendance
     */
    public function generateQR(CourseInstance $instance)
    {
        $qrData = [
            'type' => 'attendance',
            'instance_id' => $instance->id,
            'timestamp' => Carbon::now()->timestamp,
            'hash' => hash('sha256', $instance->id . Carbon::now()->toDateString() . config('app.key'))
        ];

        return response()->json([
            'qr_code' => base64_encode(json_encode($qrData)),
            'expires_at' => Carbon::now()->addHours(24),
        ]);
    }

    /**
     * Check-in via QR code
     */
    public function qrCheckin(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string',
            'participant_id' => 'required|exists:participants,id',
            'geo' => 'nullable|array',
        ]);

        try {
            $qrData = json_decode(base64_decode($validated['qr_code']), true);

            if (!$qrData || $qrData['type'] !== 'attendance') {
                return response()->json(['message' => 'Invalid QR code'], 400);
            }

            $instance = CourseInstance::findOrFail($qrData['instance_id']);

            // Verify QR code hash
            $expectedHash = hash('sha256', $instance->id . Carbon::now()->toDateString() . config('app.key'));
            if ($qrData['hash'] !== $expectedHash) {
                return response()->json(['message' => 'QR code expired or invalid'], 400);
            }

            // Record attendance
            $attendance = AttendanceRecord::updateOrCreate(
                [
                    'course_instance_id' => $instance->id,
                    'participant_id' => $validated['participant_id'],
                    'occurred_at' => Carbon::now()->toDateString(),
                ],
                [
                    'status' => 'present',
                    'method' => 'qr',
                    'geo' => $validated['geo'] ?? null,
                    'occurred_at' => Carbon::now(),
                ]
            );

            return response()->json($attendance->load('participant'), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid QR code format'], 400);
        }
    }

    /**
     * Get attendance summary for an instance
     */
    public function summary(CourseInstance $instance)
    {
        $totalParticipants = $instance->participants()->count();
        $attendance = $instance->attendanceRecords()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return response()->json([
            'total_participants' => $totalParticipants,
            'present' => $attendance['present'] ?? 0,
            'absent' => $attendance['absent'] ?? 0,
            'late' => $attendance['late'] ?? 0,
            'attendance_rate' => $totalParticipants > 0 ? round((($attendance['present'] ?? 0) / $totalParticipants) * 100, 2) : 0,
        ]);
    }

    /**
     * Update attendance record
     */
    public function update(Request $request, AttendanceRecord $attendance)
    {
        $validated = $request->validate([
            'status' => 'required|in:present,absent,late',
            'occurred_at' => 'nullable|date',
            'method' => 'nullable|in:qr,manual',
            'geo' => 'nullable|array',
            'photo_path' => 'nullable|string',
        ]);

        $attendance->update($validated);

        return response()->json($attendance->load('participant'));
    }

    /**
     * Delete attendance record
     */
    public function destroy(AttendanceRecord $attendance)
    {
        $attendance->delete();

        return response()->json(['message' => 'Attendance record deleted successfully'], 204);
    }
}
