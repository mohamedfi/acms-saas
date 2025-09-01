<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\CourseInstance;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role->name;

        $data = [];

        // Upcoming courses
        $upcomingCourses = CourseInstance::query()
            ->when($role === 'coordinator', function ($query) use ($user) {
                $query->whereHas('course', function ($q) use ($user) {
                    $q->where('coordinator_id', $user->id);
                });
            })
            ->when($role === 'trainer', function ($query) use ($user) {
                $query->whereHas('course', function ($q) use ($user) {
                    $q->where('trainer_id', $user->id);
                });
            })
            ->where('start_date', '>=', Carbon::today())
            ->where('status', 'scheduled')
            ->with('course')
            ->orderBy('start_date')
            ->limit(5)
            ->get();

        $data['courses'] = $upcomingCourses;

        // Tasks
        $tasks = Task::query()
            ->when($role !== 'admin', function ($query) use ($user, $role) {
                $query->where(function ($q) use ($user, $role) {
                    $q->where('assigned_user_id', $user->id)
                        ->orWhere('assigned_role', $role);
                });
            })
            ->where('status', '!=', 'done')
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        $data['tasks'] = $tasks;

        // Recent attendance for coordinators and trainers
        if (in_array($role, ['coordinator', 'trainer', 'admin'])) {
            $attendanceRecords = AttendanceRecord::query()
                ->with(['participant', 'courseInstance.course'])
                ->when($role === 'coordinator', function ($query) use ($user) {
                    $query->whereHas('courseInstance.course', function ($q) use ($user) {
                        $q->where('coordinator_id', $user->id);
                    });
                })
                ->when($role === 'trainer', function ($query) use ($user) {
                    $query->whereHas('courseInstance.course', function ($q) use ($user) {
                        $q->where('trainer_id', $user->id);
                    });
                })
                ->orderBy('occurred_at', 'desc')
                ->limit(10)
                ->get();

            $data['attendance'] = $attendanceRecords;
        }

        // Statistics
        $stats = [
            'total_courses' => CourseInstance::count(),
            'active_courses' => CourseInstance::where('status', 'scheduled')->count(),
            'total_participants' => CourseInstance::withCount('participants')->get()->sum('participants_count'),
            'pending_tasks' => Task::where('status', 'pending')->count(),
        ];

        $data['stats'] = $stats;

        return response()->json($data);
    }
}
