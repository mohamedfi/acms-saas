<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Participant;
use App\Models\ArchivedCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Show attendance management page for a course
     */
    public function index(Request $request, $courseId)
    {
        $course = ArchivedCourse::with(['participants', 'sections'])->findOrFail($courseId);

        // Get attendance summary for the course
        $attendanceSummary = $this->getAttendanceSummary($courseId);

        // If it's an AJAX request, return JSON
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'course' => $course,
                'attendanceSummary' => $attendanceSummary
            ]);
        }

        return Inertia::render('Attendance/Index', [
            'course' => $course,
            'attendanceSummary' => $attendanceSummary
        ]);
    }

    /**
     * Handle QR code scan for attendance
     */
    public function scanQr(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
            'course_id' => 'required|exists:archived_courses,id',
            'status' => 'required|in:present,late',
            'method' => 'required|in:qr,manual'
        ]);

        try {
            // Find participant by QR code
            $participant = Participant::where('qr_code', $request->qr_code)->first();

            if (!$participant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid QR code. Participant not found.'
                ], 404);
            }

            // Check if attendance already recorded for today
            $existingAttendance = AttendanceRecord::where([
                'participant_id' => $participant->id,
                'course_instance_id' => $request->course_id,
                'occurred_at' => now()->startOfDay()
            ])->first();

            if ($existingAttendance) {
                return response()->json([
                    'success' => false,
                    'message' => 'Attendance already recorded for today.'
                ], 409);
            }

            // Record attendance
            $attendance = AttendanceRecord::create([
                'course_instance_id' => $request->course_id,
                'participant_id' => $participant->id,
                'status' => $request->status,
                'occurred_at' => now(),
                'method' => $request->method,
                'geo' => $request->has('geo') ? $request->geo : null,
                'photo_path' => $request->has('photo') ? $request->photo : null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully!',
                'participant' => [
                    'name' => $participant->full_name,
                    'email' => $participant->email,
                    'status' => $request->status,
                    'time' => now()->format('H:i')
                ],
                'attendance' => $attendance
            ]);
        } catch (\Exception $e) {
            Log::error('Attendance recording error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error recording attendance. Please try again.'
            ], 500);
        }
    }

    /**
     * Manual attendance entry
     */
    public function manualEntry(Request $request)
    {
        $request->validate([
            'participant_id' => 'required|exists:participants,id',
            'course_id' => 'required|exists:archived_courses,id',
            'status' => 'required|in:present,absent,late'
        ]);

        try {
            // Check if attendance already recorded for today
            $existingAttendance = AttendanceRecord::where([
                'participant_id' => $request->participant_id,
                'course_instance_id' => $request->course_id,
                'occurred_at' => now()->startOfDay()
            ])->first();

            if ($existingAttendance) {
                // Update existing record
                $existingAttendance->update([
                    'status' => $request->status,
                    'method' => 'manual'
                ]);
            } else {
                // Create new record
                AttendanceRecord::create([
                    'course_instance_id' => $request->course_id,
                    'participant_id' => $request->participant_id,
                    'status' => $request->status,
                    'occurred_at' => now(),
                    'method' => 'manual'
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Attendance updated successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error('Manual attendance error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating attendance. Please try again.'
            ], 500);
        }
    }

    /**
     * Get attendance summary for a course
     */
    public function getAttendanceSummary($courseId)
    {
        try {
            $course = ArchivedCourse::with(['participants'])->findOrFail($courseId);

            $attendanceData = DB::table('attendance_records')
                ->join('participants', 'attendance_records.participant_id', '=', 'participants.id')
                ->where('attendance_records.course_instance_id', $courseId)
                ->selectRaw('
                    participants.id,
                    participants.full_name,
                    participants.qr_code,
                    COUNT(CASE WHEN attendance_records.status = "present" THEN 1 END) as present_count,
                    COUNT(CASE WHEN attendance_records.status = "absent" THEN 1 END) as absent_count,
                    COUNT(CASE WHEN attendance_records.status = "late" THEN 1 END) as late_count,
                    COUNT(*) as total_sessions
                ')
                ->groupBy('participants.id', 'participants.full_name', 'participants.qr_code')
                ->get();

            $summary = [
                'total_participants' => $course->participants->count(),
                'total_sessions' => $attendanceData->max('total_sessions') ?? 0,
                'attendance_rate' => 0,
                'participants' => $attendanceData->map(function ($participant) {
                    $total = $participant->total_sessions;
                    $present = $participant->present_count;
                    $attendanceRate = $total > 0 ? round(($present / $total) * 100, 1) : 0;

                    return [
                        'id' => $participant->id,
                        'name' => $participant->full_name,
                        'qr_code' => $participant->qr_code,
                        'present_count' => $participant->present_count,
                        'absent_count' => $participant->absent_count,
                        'late_count' => $participant->late_count,
                        'total_sessions' => $participant->total_sessions,
                        'attendance_rate' => $attendanceRate,
                        'status' => $this->getAttendanceStatus($participant->present_count, $participant->absent_count, $participant->late_count)
                    ];
                })
            ];

            // Calculate overall attendance rate
            if ($summary['total_participants'] > 0 && $summary['total_sessions'] > 0) {
                $totalPresent = $attendanceData->sum('present_count');
                $totalPossible = $summary['total_participants'] * $summary['total_sessions'];
                $calculatedRate = round(($totalPresent / $totalPossible) * 100, 1);
                
                // Cap the rate at 100% to prevent unrealistic values
                $summary['attendance_rate'] = min($calculatedRate, 100);
                
                // Log the calculation for debugging
                Log::info("Attendance calculation: {$totalPresent} present / {$totalPossible} possible = {$calculatedRate}% (capped at {$summary['attendance_rate']}%)");
            }

            return $summary;
        } catch (\Exception $e) {
            Log::error('Error getting attendance summary: ' . $e->getMessage());
            return [
                'total_participants' => 0,
                'total_sessions' => 0,
                'attendance_rate' => 0,
                'participants' => []
            ];
        }
    }

    /**
     * Get attendance status for a participant
     */
    private function getAttendanceStatus($present, $absent, $late)
    {
        if ($present > 0 && $absent == 0) {
            return 'excellent';
        } elseif ($present > 0 && $absent <= 2) {
            return 'good';
        } elseif ($present > 0 && $absent <= 5) {
            return 'fair';
        } else {
            return 'poor';
        }
    }

    /**
     * Export attendance report
     */
    public function exportReport(Request $request, $courseId)
    {
        try {
            $course = ArchivedCourse::with(['participants'])->findOrFail($courseId);
            $attendanceSummary = $this->getAttendanceSummary($courseId);

            // Generate CSV report
            $filename = "attendance_report_{$course->course_code}_" . now()->format('Y-m-d') . ".csv";

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename={$filename}",
            ];

            $callback = function () use ($attendanceSummary, $course) {
                $file = fopen('php://output', 'w');

                // Add headers
                fputcsv($file, [
                    'Course: ' . $course->course_name,
                    'Course Code: ' . $course->course_code,
                    'Report Date: ' . now()->format('Y-m-d H:i:s')
                ]);
                fputcsv($file, ['']); // Empty row

                // Add participant data
                fputcsv($file, [
                    'Participant Name',
                    'QR Code',
                    'Present Sessions',
                    'Absent Sessions',
                    'Late Sessions',
                    'Total Sessions',
                    'Attendance Rate (%)',
                    'Status'
                ]);

                foreach ($attendanceSummary['participants'] as $participant) {
                    fputcsv($file, [
                        $participant['name'],
                        $participant['qr_code'],
                        $participant['present_count'],
                        $participant['absent_count'],
                        $participant['late_count'],
                        $participant['total_sessions'],
                        $participant['attendance_rate'],
                        $participant['status']
                    ]);
                }

                fputcsv($file, ['']); // Empty row
                fputcsv($file, [
                    'Overall Attendance Rate:',
                    $attendanceSummary['attendance_rate'] . '%'
                ]);

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        } catch (\Exception $e) {
            Log::error('Error exporting attendance report: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to export report'], 500);
        }
    }
}
