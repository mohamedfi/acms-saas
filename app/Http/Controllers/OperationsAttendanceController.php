<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ArchivedCourse;
use App\Models\AttendanceRecord;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OperationsAttendanceController extends Controller
{
    public function index(Request $request)
    {
        // Get course ID from query parameter (if coming from course archive)
        $selectedCourseId = $request->query('course');
        
        // Get all archived courses for the dropdown
        try {
            $courses = ArchivedCourse::select('id', 'course_name', 'start_date', 'end_date')
                ->orderBy('start_date', 'desc')
                ->get();
            
            // Ensure courses have the required fields
            $courses = $courses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'course_name' => $course->course_name ?? 'Unnamed Course',
                    'start_date' => $course->start_date ?? 'No date',
                    'end_date' => $course->end_date ?? 'No date',
                ];
            });
        } catch (\Exception $e) {
            \Log::error('Error fetching archived courses: ' . $e->getMessage());
            $courses = collect([]); // Empty collection if error
        }
        
        // If no course is selected but there's only one course, auto-select it
        if (!$selectedCourseId && $courses->count() === 1) {
            $selectedCourseId = $courses->first()['id'];
        }
        
        // If a specific course is selected, get its attendance data
        $selectedCourse = null;
        $attendanceSummary = null;
        $participants = null;
        
        if ($selectedCourseId) {
            $selectedCourse = ArchivedCourse::with(['participants', 'sections'])->find($selectedCourseId);
            if ($selectedCourse) {
                $attendanceSummary = $this->getAttendanceSummary($selectedCourseId);
                $participants = $this->getCourseParticipants($selectedCourseId);
            }
        }
        
        // Get global attendance statistics
        $globalStats = $this->getGlobalAttendanceStats();
        
        return Inertia::render('Operations/Attendance', [
            'courses' => $courses,
            'selectedCourse' => $selectedCourse,
            'selectedCourseId' => $selectedCourseId,
            'attendanceSummary' => $attendanceSummary,
            'participants' => $participants,
            'globalStats' => $globalStats,
        ]);
    }
    
    public function getCourseAttendance($courseId)
    {
        $course = ArchivedCourse::with(['participants', 'sections'])->findOrFail($courseId);
        $attendanceSummary = $this->getAttendanceSummary($courseId);
        $participants = $this->getCourseParticipants($courseId);
        
        return response()->json([
            'course' => $course,
            'attendanceSummary' => $attendanceSummary,
            'participants' => $participants,
        ]);
    }
    
    private function getAttendanceSummary($courseId)
    {
        $course = ArchivedCourse::find($courseId);
        if (!$course) {
            return null;
        }
        
        // Get participants for this course
        $participants = DB::table('archived_course_participants')
            ->where('archived_course_id', $courseId)
            ->get();
        
        $totalParticipants = $participants->count();
        
        if ($totalParticipants === 0) {
            return [
                'total_participants' => 0,
                'present_count' => 0,
                'absent_count' => 0,
                'attendance_rate' => 0,
                'total_sessions' => 0,
            ];
        }
        
        // Get attendance records for this course
        $attendanceData = DB::table('attendance_records')
            ->where('course_instance_id', $courseId)
            ->get();
        
        $totalSessions = $attendanceData->count();
        
        // Calculate attendance statistics
        $presentCount = $attendanceData->where('status', 'present')->count();
        $absentCount = $attendanceData->where('status', 'absent')->count();
        
        $attendanceRate = $totalSessions > 0 ? round(($presentCount / $totalSessions) * 100, 1) : 0;
        
        return [
            'total_participants' => $totalParticipants,
            'present_count' => $presentCount,
            'absent_count' => $absentCount,
            'attendance_rate' => min($attendanceRate, 100), // Cap at 100%
            'total_sessions' => $totalSessions,
        ];
    }
    
    private function getCourseParticipants($courseId)
    {
        $participants = DB::table('archived_course_participants')
            ->where('archived_course_id', $courseId)
            ->get();
        
        // Get attendance status for each participant
        $participantsWithAttendance = $participants->map(function ($participant) use ($courseId) {
            $attendanceRecord = DB::table('attendance_records')
                ->where('course_instance_id', $courseId)
                ->where('participant_id', $participant->id)
                ->first();
            
            return [
                'id' => $participant->id,
                'name' => $participant->participant_name,
                'email' => $participant->participant_email,
                'attendance_status' => $attendanceRecord ? $attendanceRecord->status : 'not_recorded',
                'last_attendance' => $attendanceRecord ? $attendanceRecord->occurred_at : null,
            ];
        });
        
        return $participantsWithAttendance;
    }
    
    private function getGlobalAttendanceStats()
    {
        $totalCourses = ArchivedCourse::count();
        $totalParticipants = DB::table('archived_course_participants')->count();
        $totalAttendanceRecords = AttendanceRecord::count();
        
        // Calculate overall attendance rate across all courses
        $overallRate = 0;
        if ($totalAttendanceRecords > 0) {
            $presentRecords = AttendanceRecord::where('status', 'present')->count();
            $overallRate = round(($presentRecords / $totalAttendanceRecords) * 100, 1);
        }
        
        return [
            'total_courses' => $totalCourses,
            'total_participants' => $totalParticipants,
            'total_attendance_records' => $totalAttendanceRecords,
            'overall_attendance_rate' => $overallRate,
        ];
    }
    
    public function scanQr(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
            'course_id' => 'required|exists:archived_courses,id',
        ]);
        
        $qrCode = $request->input('qr_code');
        $courseId = $request->input('course_id');
        
        // Find participant by QR code
        $participant = Participant::where('qr_code', $qrCode)->first();
        
        if (!$participant) {
            return response()->json([
                'success' => false,
                'message' => 'QR code not recognized'
            ], 404);
        }
        
        // Check if participant is enrolled in this course
        $enrollment = DB::table('archived_course_participants')
            ->where('archived_course_id', $courseId)
            ->where('participant_name', $participant->full_name)
            ->first();
        
        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'Participant not enrolled in this course'
            ], 404);
        }
        
        // Record attendance
        $attendanceRecord = AttendanceRecord::create([
            'course_instance_id' => $courseId,
            'participant_id' => $participant->id,
            'status' => 'present',
            'occurred_at' => now(),
            'method' => 'qr_scan',
            'geo' => $request->input('geo', null),
            'photo_path' => $request->input('photo_path', null),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'participant' => $participant->full_name,
            'attendance_id' => $attendanceRecord->id,
        ]);
    }
    
    public function exportReport($courseId = null)
    {
        if ($courseId) {
            // Export specific course
            $course = ArchivedCourse::findOrFail($courseId);
            $attendanceSummary = $this->getAttendanceSummary($courseId);
            $participants = $this->getCourseParticipants($courseId);
            
            // Generate CSV for specific course
            $filename = "attendance_report_{$course->course_name}_" . date('Y-m-d') . ".csv";
            
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"$filename\"",
            ];
            
            $callback = function() use ($course, $attendanceSummary, $participants) {
                $file = fopen('php://output', 'w');
                
                // Course header
                fputcsv($file, ['Course Attendance Report']);
                fputcsv($file, ['Course:', $course->course_name]);
                fputcsv($file, ['Date:', date('Y-m-d H:i:s')]);
                fputcsv($file, []);
                
                // Summary
                fputcsv($file, ['Summary']);
                fputcsv($file, ['Total Participants', $attendanceSummary['total_participants']]);
                fputcsv($file, ['Present', $attendanceSummary['present_count']]);
                fputcsv($file, ['Absent', $attendanceSummary['absent_count']]);
                fputcsv($file, ['Attendance Rate', $attendanceSummary['attendance_rate'] . '%']);
                fputcsv($file, []);
                
                // Participants
                fputcsv($file, ['Participants']);
                fputcsv($file, ['Name', 'Email', 'Status', 'Last Attendance']);
                
                foreach ($participants as $participant) {
                    fputcsv($file, [
                        $participant['name'],
                        $participant['email'],
                        $participant['attendance_status'],
                        $participant['last_attendance'] ?: 'Not recorded'
                    ]);
                }
                
                fclose($file);
            };
            
            return response()->stream($callback, 200, $headers);
        } else {
            // Export global report
            $globalStats = $this->getGlobalAttendanceStats();
            $courses = ArchivedCourse::all();
            
            $filename = "global_attendance_report_" . date('Y-m-d') . ".csv";
            
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"$filename\"",
            ];
            
            $callback = function() use ($globalStats, $courses) {
                $file = fopen('php://output', 'w');
                
                // Global header
                fputcsv($file, ['Global Attendance Report']);
                fputcsv($file, ['Date:', date('Y-m-d H:i:s')]);
                fputcsv($file, []);
                
                // Global summary
                fputcsv($file, ['Global Summary']);
                fputcsv($file, ['Total Courses', $globalStats['total_courses']]);
                fputcsv($file, ['Total Participants', $globalStats['total_participants']]);
                fputcsv($file, ['Total Attendance Records', $globalStats['total_attendance_records']]);
                fputcsv($file, ['Overall Rate', $globalStats['overall_attendance_rate'] . '%']);
                fputcsv($file, []);
                
                // Course breakdown
                fputcsv($file, ['Course Breakdown']);
                fputcsv($file, ['Course', 'Participants', 'Attendance Rate']);
                
                foreach ($courses as $course) {
                    $summary = $this->getAttendanceSummary($course->id);
                    fputcsv($file, [
                        $course->course_name,
                        $summary['total_participants'],
                        $summary['attendance_rate'] . '%'
                    ]);
                }
                
                fclose($file);
            };
            
            return response()->stream($callback, 200, $headers);
        }
    }
}
