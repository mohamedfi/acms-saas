<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CateringController;
use App\Http\Controllers\CateringRoleController;
use App\Http\Controllers\TransportationController;
use App\Http\Controllers\RentalCompanyController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\MealBreakPlanController;
use App\Http\Controllers\FoodItemController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // If user is authenticated, redirect to dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'canLogin'        => Route::has('login'),
        'canRegister'     => Route::has('register'),
        'laravelVersion'  => Application::VERSION,
        'phpVersion'      => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
|
| These routes require authentication.
|
*/
Route::middleware(['auth'])->group(function () {
    // Email functionality for logistics reports (global) - MUST be before ALL other routes
    Route::post('/send-report-email', [MailController::class, 'sendReport'])->middleware(['auth'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->name('send-report-email');

    // Dashboard (named route for route('dashboard'))
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Core Management Pages
    Route::get('/courses', function () {
        return Inertia::render('Courses/Index');
    })->name('courses.index');

    Route::get('/courses/create', function () {
        return Inertia::render('Courses/Create');
    })->name('courses.create');

    Route::post('/courses', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'delivery_type' => 'required|in:office,offsite,abroad',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'trainer_id' => 'nullable|exists:trainers,id',
            'coordinator_id' => 'nullable|exists:trainers,id',
            'location_id' => 'nullable|exists:course_locations,id',
            'location_details' => 'nullable|string|max:500',
        ]);

        // Create the course with all validated data
        \App\Models\Course::create($validated);

        return redirect()->route('courses.index')->with('success', 'Course created successfully!');
    })->name('courses.store');

    Route::get('/courses/{course}', function (\App\Models\Course $course) {
        $course->load(['trainer', 'coordinator', 'location']);
        return Inertia::render('Courses/Show', [
            'course' => $course
        ]);
    })->name('courses.show');

    Route::get('/courses/{course}/edit', function (\App\Models\Course $course) {
        $course->load(['trainer', 'coordinator', 'location']);
        return Inertia::render('Courses/Edit', [
            'course' => $course
        ]);
    })->name('courses.edit');

    Route::put('/courses/{course}', function (\App\Models\Course $course, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'delivery_type' => 'required|in:office,offsite,abroad',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'trainer_id' => 'nullable|exists:trainers,id',
            'coordinator_id' => 'nullable|exists:trainers,id',
            'location_id' => 'nullable|exists:course_locations,id',
            'location_details' => 'nullable|string|max:500',
        ]);

        $course->update($validated);

        return redirect()->route('courses.index')->with('success', 'Course updated successfully!');
    })->name('courses.update');

    Route::delete('/courses/{course}', function (\App\Models\Course $course) {
        $course->delete();
        return redirect()->route('courses.index')->with('success', 'Course deleted successfully!');
    })->name('courses.destroy');

    // Archive course
    Route::post('/courses/{course}/archive', function (\App\Models\Course $course) {
        try {
            // Load course relationships
            $course->load(['trainer', 'coordinator', 'participants']);

            // Get course data and participants
            $participants = $course->participants;
            $totalParticipants = $participants->count();
            $successfulParticipants = $participants->where('pivot.status', 'completed')->count();
            $completionRate = $totalParticipants > 0 ? ($successfulParticipants / $totalParticipants) * 100 : 0;

            // Create archived course
            $archivedCourse = \App\Models\ArchivedCourse::create([
                'course_name' => $course->name,
                'course_code' => $course->code,
                'description' => $course->description,
                'trainer_name' => $course->trainer?->full_name ?? 'Unknown Trainer',
                'coordinator_name' => $course->coordinator?->full_name ?? 'Unknown Coordinator',
                'start_date' => $course->start_date ?? now(),
                'end_date' => $course->end_date ?? now(),
                'duration_hours' => $course->duration_hours ?? 0,
                'delivery_type' => $course->delivery_type ?? 'office',
                'location_details' => $course->location_details ?? ($course->city && $course->country ? $course->city . ', ' . $course->country : null),
                'total_participants' => $totalParticipants,
                'successful_participants' => $successfulParticipants,
                'completion_rate' => $completionRate,
                'archived_date' => now(),
            ]);

            // Archive participants
            foreach ($participants as $participant) {
                \App\Models\ArchivedCourseParticipant::create([
                    'archived_course_id' => $archivedCourse->id,
                    'participant_name' => $participant->full_name,
                    'participant_email' => $participant->email,
                    'participant_phone' => $participant->phone,
                    'organization' => $participant->organization,
                    'nationality' => $participant->nationality,
                    'passport_no' => $participant->passport_no,
                    'attendance_status' => 'present', // Default, can be updated later
                    'evaluation_score' => null, // Can be updated later
                    'certificate_issued' => false,
                ]);
            }

            // Copy course sections from seeder
            $sections = \App\Models\ArchivedCourseSection::where('archived_course_id', null)->get();
            foreach ($sections as $section) {
                \App\Models\ArchivedCourseSection::create([
                    'archived_course_id' => $archivedCourse->id,
                    'section_name_en' => $section->section_name_en,
                    'section_name_ar' => $section->section_name_ar,
                    'type' => $section->type,
                    'description' => $section->description,
                    'order' => $section->order,
                    'is_required' => $section->is_required,
                    'is_completed' => false,
                ]);
            }

            // Delete the original course (this will cascade delete enrollments)
            $course->delete();

            return redirect()->route('courses.index')->with('success', 'Course archived successfully!');
        } catch (\Exception $e) {
            \Log::error('Course archive failed: ' . $e->getMessage());
            return redirect()->route('courses.index')->with('error', 'Failed to archive course: ' . $e->getMessage());
        }
    })->name('courses.archive');

    // Archived courses
    Route::get('/archived-courses', function () {
        return Inertia::render('ArchivedCourses/Index', [
            'archivedCourses' => \App\Models\ArchivedCourse::with(['sections', 'participants', 'finances'])
                ->orderBy('archived_date', 'desc')
                ->get()
        ]);
    })->name('archived-courses.index');

    Route::get('/archived-courses/{archivedCourse}', function (\App\Models\ArchivedCourse $archivedCourse) {
        try {
            $archivedCourse->load(['sections.files', 'participants', 'finances']);

            // Calculate real-time statistics
            $totalParticipants = $archivedCourse->participants()->count();
            $successfulParticipants = $archivedCourse->participants()
                ->where('certificate_issued', true)
                ->count();

            // Calculate real completion rate
            $completionRate = $totalParticipants > 0
                ? round(($successfulParticipants / $totalParticipants) * 100, 1)
                : 0.0;

            // Calculate real duration from dates
            $realDuration = 0;
            if ($archivedCourse->start_date && $archivedCourse->end_date) {
                $startDate = \Carbon\Carbon::parse($archivedCourse->start_date);
                $endDate = \Carbon\Carbon::parse($archivedCourse->end_date);
                $realDuration = $startDate->diffInHours($endDate);
            }

            // Section statistics
            $totalSections = $archivedCourse->sections()->count();
            $completedSections = $archivedCourse->sections()
                ->where('is_completed', true)
                ->count();
            $sectionCompletionRate = $totalSections > 0
                ? round(($completedSections / $totalSections) * 100, 1)
                : 0.0;

            // Attendance statistics
            $attendanceStats = $archivedCourse->participants()
                ->selectRaw('
                    COUNT(*) as total_participants,
                    SUM(CASE WHEN attendance_status = "present" THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN attendance_status = "absent" THEN 1 ELSE 0 END) as absent_count,
                    SUM(CASE WHEN attendance_status = "late" THEN 1 ELSE 0 END) as late_count
                ')
                ->first();

            // Evaluation statistics
            $evaluationStats = $archivedCourse->participants()
                ->whereNotNull('evaluation_score')
                ->selectRaw('
                    COUNT(*) as evaluated_count,
                    AVG(evaluation_score) as average_score,
                    MIN(evaluation_score) as min_score,
                    MAX(evaluation_score) as max_score
                ')
                ->first();

            // Certificate statistics
            $certificateStats = $archivedCourse->participants()
                ->selectRaw('
                    COUNT(*) as total_participants,
                    SUM(CASE WHEN certificate_issued = 1 THEN 1 ELSE 0 END) as certificates_issued,
                    SUM(CASE WHEN certificate_issued = 0 THEN 1 ELSE 0 END) as certificates_pending
                ')
                ->first();

            // Enhanced archived course data
            $enhancedArchivedCourse = array_merge($archivedCourse->toArray(), [
                'real_time_stats' => [
                    'total_participants' => $totalParticipants,
                    'successful_participants' => $successfulParticipants,
                    'completion_rate' => $completionRate,
                    'real_duration_hours' => $realDuration,
                    'total_sections' => $totalSections,
                    'completed_sections' => $completedSections,
                    'section_completion_rate' => $sectionCompletionRate,
                    'attendance' => [
                        'total' => $attendanceStats->total_participants ?? 0,
                        'present' => $attendanceStats->present_count ?? 0,
                        'absent' => $attendanceStats->absent_count ?? 0,
                        'late' => $attendanceStats->late_count ?? 0,
                        'attendance_rate' => $attendanceStats->total_participants > 0
                            ? round((($attendanceStats->present_count ?? 0) / $attendanceStats->total_participants) * 100, 1)
                            : 0.0
                    ],
                    'evaluations' => [
                        'evaluated_count' => $evaluationStats->evaluated_count ?? 0,
                        'average_score' => round($evaluationStats->average_score ?? 0, 1),
                        'min_score' => $evaluationStats->min_score ?? 0,
                        'max_score' => $evaluationStats->max_score ?? 0
                    ],
                    'certificates' => [
                        'total' => $certificateStats->total_participants ?? 0,
                        'issued' => $certificateStats->certificates_issued ?? 0,
                        'pending' => $certificateStats->certificates_pending ?? 0,
                        'issuance_rate' => $certificateStats->total_participants > 0
                            ? round((($certificateStats->certificates_issued ?? 0) / $certificateStats->total_participants) * 100, 1)
                            : 0.0
                    ]
                ]
            ]);

            return Inertia::render('ShowNew', [
                'archivedCourse' => $enhancedArchivedCourse
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in archived-courses.show route: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    })->name('archived-courses.show');

    // File upload routes for archived course sections
    Route::post('/archived-course-sections/{section}/files', [\App\Http\Controllers\ArchivedCourseSectionFileController::class, 'store'])->name('archived-course-sections.files.store');
    Route::delete('/archived-course-section-files/{file}', [\App\Http\Controllers\ArchivedCourseSectionFileController::class, 'destroy'])->name('archived-course-section-files.destroy');
    Route::get('/archived-course-section-files/{file}/download', [\App\Http\Controllers\ArchivedCourseSectionFileController::class, 'download'])->name('archived-course-section-files.download');

    // Attendance Management Routes
    Route::prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/course/{courseId}', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('index');
        Route::post('/scan-qr', [\App\Http\Controllers\AttendanceController::class, 'scanQr'])->name('scan-qr');
        Route::post('/manual-entry', [\App\Http\Controllers\AttendanceController::class, 'manualEntry'])->name('manual-entry');
        Route::get('/export/{courseId}', [\App\Http\Controllers\AttendanceController::class, 'exportReport'])->name('export');
    });

    // Operations Attendance Management Routes (Smart Routing)
    Route::prefix('operations')->name('operations.')->group(function () {
        Route::get('/attendance', [\App\Http\Controllers\OperationsAttendanceController::class, 'index'])->name('attendance');
        Route::get('/attendance/course/{courseId}', [\App\Http\Controllers\OperationsAttendanceController::class, 'getCourseAttendance'])->name('attendance.course');
        Route::post('/attendance/scan-qr', [\App\Http\Controllers\OperationsAttendanceController::class, 'scanQr'])->name('attendance.scan-qr');
        Route::get('/attendance/export/{courseId?}', [\App\Http\Controllers\OperationsAttendanceController::class, 'exportReport'])->name('attendance.export');
    });

    // Employee Management Routes
    Route::resource('employees', \App\Http\Controllers\EmployeeController::class);

    // Task Management Routes
    Route::resource('tasks', \App\Http\Controllers\TaskController::class);

    // Role Management Routes - Moved to enhanced role-management system

    // Communication Routes
    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [\App\Http\Controllers\MessagesController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\MessagesController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\MessagesController::class, 'store'])->name('store');
        Route::post('/template', [\App\Http\Controllers\MessagesController::class, 'sendWithTemplate'])->name('template');
        Route::post('/course', [\App\Http\Controllers\MessagesController::class, 'sendCourseMessage'])->name('course');
        Route::get('/{message}', [\App\Http\Controllers\MessagesController::class, 'show'])->name('show');
        Route::get('/stats', [\App\Http\Controllers\MessagesController::class, 'stats'])->name('stats');
    });

    // Message Template Routes
    Route::resource('message-templates', \App\Http\Controllers\MessageTemplateController::class);
    Route::post('/message-templates/{messageTemplate}/toggle-status', [\App\Http\Controllers\MessageTemplateController::class, 'toggleStatus'])->name('message-templates.toggle-status');

    Route::get('/participants', function () {
        return Inertia::render('Participants/Index');
    })->name('participants.index');

    Route::get('/participants/create', function () {
        return Inertia::render('Participants/Create');
    })->name('participants.create');

    Route::post('/participants', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'nationality' => 'required|string|max:100',
            'passport_no' => 'required|string|max:50',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'passport_id_document' => 'required|file|mimes:pdf,jpg,jpeg,png,gif,doc,docx|max:10240', // 10MB max
            'course_ids' => 'nullable|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        // Automatically set visa status based on nationality
        $validated['visa_status'] = strtolower($validated['nationality']) === 'egyptian' ? 'not_required' : 'required';

        // Generate unique QR code for participant
        $validated['qr_code'] = \App\Models\Participant::generateQrCode();

        // Handle profile image upload and generate thumbnail
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('participants', 'public');
            $validated['profile_image'] = $imagePath;

            // Generate thumbnail (you can implement image resizing here)
            $validated['thumbnail'] = $imagePath; // For now, use same image as thumbnail
        }

        // Handle passport/ID document upload
        if ($request->hasFile('passport_id_document')) {
            $documentPath = $request->file('passport_id_document')->store('participants/documents', 'public');
            $validated['passport_id_document'] = $documentPath;
        }

        // Create participant
        $participant = \App\Models\Participant::create($validated);

        // Handle course enrollments
        if ($request->has('course_ids') && is_array($request->course_ids)) {
            foreach ($request->course_ids as $courseId) {
                \App\Models\CourseEnrollment::create([
                    'participant_id' => $participant->id,
                    'course_id' => $courseId,
                    'status' => 'enrolled',
                    'enrollment_date' => now(),
                ]);
            }
        }

        return redirect()->route('participants.index')->with('success', 'Participant created successfully!');
    })->name('participants.store');

    Route::get('/participants/{participant}', function (\App\Models\Participant $participant) {
        return Inertia::render('Participants/Show', [
            'participant' => $participant
        ]);
    })->name('participants.show');

    Route::get('/participants/{participant}/edit', function (\App\Models\Participant $participant) {
        return Inertia::render('Participants/Edit', [
            'participant' => $participant
        ]);
    })->name('participants.edit');

    Route::put('/participants/{participant}', function (\App\Models\Participant $participant, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'nationality' => 'required|string|max:100',
            'passport_no' => 'required|string|max:50',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'passport_id_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif,doc,docx|max:10240', // 10MB max
        ]);

        // Automatically set visa status based on nationality
        $validated['visa_status'] = strtolower($validated['nationality']) === 'egyptian' ? 'not_required' : 'required';

        // Handle profile image upload and generate thumbnail
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($participant->profile_image) {
                Storage::disk('public')->delete($participant->profile_image);
            }
            if ($participant->thumbnail) {
                Storage::disk('public')->delete($participant->thumbnail);
            }

            $imagePath = $request->file('profile_image')->store('participants', 'public');
            $validated['profile_image'] = $imagePath;

            // Generate thumbnail (you can implement image resizing here)
            $validated['thumbnail'] = $imagePath; // For now, use same image as thumbnail
        }

        // Handle passport/ID document upload
        if ($request->hasFile('passport_id_document')) {
            // Delete old document if exists
            if ($participant->passport_id_document) {
                Storage::disk('public')->delete($participant->passport_id_document);
            }
            $documentPath = $request->file('passport_id_document')->store('participants/documents', 'public');
            $validated['passport_id_document'] = $documentPath;
        }

        $participant->update($validated);

        return redirect()->route('participants.index')->with('success', 'Participant updated successfully!');
    })->name('participants.update');

    Route::delete('/participants/{participant}', function (\App\Models\Participant $participant) {
        // Delete associated files before deleting the participant
        if ($participant->profile_image) {
            Storage::disk('public')->delete($participant->profile_image);
        }
        if ($participant->thumbnail) {
            Storage::disk('public')->delete($participant->thumbnail);
        }
        if ($participant->passport_id_document) {
            Storage::disk('public')->delete($participant->passport_id_document);
        }

        // Delete the participant
        $participant->delete();

        return redirect()->route('participants.index')->with('success', 'Participant deleted successfully!');
    })->name('participants.destroy');

    // Generate QR code for participant
    Route::get('/participants/{participant}/qr-code', function (\App\Models\Participant $participant) {
        if (!$participant->qr_code) {
            $participant->update(['qr_code' => \App\Models\Participant::generateQrCode()]);
        }

        $qrCode = \QrCode::size(300)->generate($participant->qr_code);

        return response($qrCode)
            ->header('Content-Type', 'image/svg+xml');
    })->name('participants.qr-code');

    // Course enrollment management
    Route::post('/participants/{participant}/enroll', function (\App\Models\Participant $participant, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'course_instance_id' => 'nullable|exists:course_instances,id',
            'status' => 'required|in:enrolled,attending,completed,dropped',
            'notes' => 'nullable|string',
        ]);

        $validated['participant_id'] = $participant->id;
        $validated['enrollment_date'] = now();

        \App\Models\CourseEnrollment::create($validated);

        return redirect()->back()->with('success', 'Participant enrolled successfully!');
    })->name('participants.enroll');

    Route::put('/enrollments/{enrollment}', function (\App\Models\CourseEnrollment $enrollment, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'status' => 'required|in:enrolled,attending,completed,dropped',
            'notes' => 'nullable|string',
            'completion_date' => 'nullable|date',
        ]);

        if ($validated['status'] === 'completed' && !isset($validated['completion_date'])) {
            $validated['completion_date'] = now();
        }

        $enrollment->update($validated);

        return redirect()->back()->with('success', 'Enrollment updated successfully!');
    })->name('enrollments.update');

    Route::get('/tasks', [\App\Http\Controllers\TaskController::class, 'index'])->name('tasks.index');

    Route::get('/messages', function () {
        return Inertia::render('Messages/Index');
    })->name('messages.index');

    Route::get('/logistics', function () {
        return Inertia::render('Logistics/Index');
    })->name('logistics.index');

    // Logistics Management Routes
    Route::prefix('logistics')->name('logistics.')->group(function () {
        Route::get('/bookings', function () {
            return Inertia::render('Logistics/Bookings');
        })->name('bookings');

        Route::get('/bookings/create', function () {
            return Inertia::render('Logistics/CreateBooking');
        })->name('bookings.create');

        Route::post('/bookings', function (\Illuminate\Http\Request $request) {
            // Basic validation for now
            $validated = $request->validate([
                'course_id' => 'required|exists:archived_courses,id',
                'transport_type' => 'required|in:bus,car,van,other',
                'pickup_date' => 'required|date',
                'pickup_time' => 'required',
                'return_date' => 'required|date|after_or_equal:pickup_date',
                'return_time' => 'required',
                'pickup_location' => 'required|string|max:255',
                'dropoff_location' => 'required|string|max:255',
                'passenger_count' => 'required|integer|min:1',
                'special_requirements' => 'nullable|string',
                'status' => 'required|in:pending,confirmed,cancelled,completed',
            ]);

            // For now, just redirect with success message
            // In a real implementation, you'd save to database
            return redirect()->route('logistics.bookings')->with('success', 'Transportation booking created successfully!');
        })->name('bookings.store');

        Route::get('/reports', function () {
            return Inertia::render('Logistics/Reports');
        })->name('reports');

        Route::get('/reports/transport', function () {
            return Inertia::render('Logistics/TransportReports');
        })->name('reports.transport');

        Route::get('/reports/courses', function () {
            return Inertia::render('Logistics/CourseReports');
        })->name('reports.courses');
    });

    // User Management
    Route::prefix('user-management')->name('user-management.')->group(function () {
        Route::get('/', [\App\Http\Controllers\UserManagementController::class, 'index'])->name('index');
        Route::get('/users', [\App\Http\Controllers\UserManagementController::class, 'users'])->name('users');
        Route::get('/roles', [\App\Http\Controllers\UserManagementController::class, 'roles'])->name('roles');
        Route::get('/users/create', [\App\Http\Controllers\UserManagementController::class, 'createUser'])->name('users.create');
        Route::post('/users', [\App\Http\Controllers\UserManagementController::class, 'storeUser'])->name('users.store');
        Route::get('/users/{user}/edit', [\App\Http\Controllers\UserManagementController::class, 'editUser'])->name('users.edit');
        Route::put('/users/{user}', [\App\Http\Controllers\UserManagementController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [\App\Http\Controllers\UserManagementController::class, 'destroyUser'])->name('users.destroy');
        Route::post('/users/{user}/password', [\App\Http\Controllers\UserManagementController::class, 'changePassword'])->name('users.password');
        Route::post('/users/{user}/toggle-status', [\App\Http\Controllers\UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::get('/roles/create', [\App\Http\Controllers\UserManagementController::class, 'createRole'])->name('roles.create');
        Route::post('/roles', [\App\Http\Controllers\UserManagementController::class, 'storeRole'])->name('roles.store');
        Route::get('/roles/{role}/edit', [\App\Http\Controllers\UserManagementController::class, 'editRole'])->name('roles.edit');
        Route::put('/roles/{role}', [\App\Http\Controllers\UserManagementController::class, 'updateRole'])->name('roles.update');
        Route::delete('/roles/{role}', [\App\Http\Controllers\UserManagementController::class, 'destroyRole'])->name('roles.destroy');
    });

    // Asset Management
    Route::prefix('asset-management')->name('asset-management.')->group(function () {
        Route::get('/', [\App\Http\Controllers\AssetManagementController::class, 'index'])->name('index');
        Route::get('/assets', [\App\Http\Controllers\AssetManagementController::class, 'assets'])->name('assets');
        Route::get('/categories', [\App\Http\Controllers\AssetManagementController::class, 'categories'])->name('categories');
        Route::get('/locations', [\App\Http\Controllers\AssetManagementController::class, 'locations'])->name('locations');
        Route::get('/assets/create', [\App\Http\Controllers\AssetManagementController::class, 'create'])->name('assets.create');
        Route::post('/assets', [\App\Http\Controllers\AssetManagementController::class, 'store'])->name('assets.store');
        Route::get('/assets/{asset}', [\App\Http\Controllers\AssetManagementController::class, 'show'])->name('assets.show');
        Route::get('/assets/{asset}/edit', [\App\Http\Controllers\AssetManagementController::class, 'edit'])->name('assets.edit');
        Route::put('/assets/{asset}', [\App\Http\Controllers\AssetManagementController::class, 'update'])->name('assets.update');
        Route::delete('/assets/{asset}', [\App\Http\Controllers\AssetManagementController::class, 'destroy'])->name('assets.destroy');
        Route::post('/assets/{asset}/qr', [\App\Http\Controllers\AssetManagementController::class, 'generateQR'])->name('assets.qr');
        Route::get('/stats', [\App\Http\Controllers\AssetManagementController::class, 'stats'])->name('stats');
    });





    // Financial Management
    Route::prefix('financial-management')->name('financial-management.')->group(function () {
        Route::get('/', [\App\Http\Controllers\FinancialManagementController::class, 'index'])->name('index');
        Route::get('/accounts', [\App\Http\Controllers\FinancialManagementController::class, 'accounts'])->name('accounts');
        Route::get('/accounts/create', [\App\Http\Controllers\FinancialManagementController::class, 'createAccount'])->name('accounts.create');
        Route::post('/accounts', [\App\Http\Controllers\FinancialManagementController::class, 'storeAccount'])->name('accounts.store');
        Route::get('/accounts/{account}/edit', [\App\Http\Controllers\FinancialManagementController::class, 'editAccount'])->name('accounts.edit');
        Route::put('/accounts/{account}', [\App\Http\Controllers\FinancialManagementController::class, 'updateAccount'])->name('accounts.update');
        Route::get('/transactions', [\App\Http\Controllers\FinancialManagementController::class, 'transactions'])->name('transactions');
        Route::get('/transactions/create', [\App\Http\Controllers\FinancialManagementController::class, 'createTransaction'])->name('transactions.create');
        Route::post('/transactions', [\App\Http\Controllers\FinancialManagementController::class, 'storeTransaction'])->name('transactions.store');
        Route::get('/transactions/{transaction}', [\App\Http\Controllers\FinancialManagementController::class, 'showTransaction'])->name('transactions.show');
        Route::get('/transactions/{transaction}/edit', [\App\Http\Controllers\FinancialManagementController::class, 'editTransaction'])->name('transactions.edit');
        Route::put('/transactions/{transaction}', [\App\Http\Controllers\FinancialManagementController::class, 'updateTransaction'])->name('transactions.update');
        Route::delete('/transactions/{transaction}', [\App\Http\Controllers\FinancialManagementController::class, 'destroyTransaction'])->name('transactions.destroy');
        Route::get('/categories', [\App\Http\Controllers\FinancialManagementController::class, 'categories'])->name('categories');
        Route::get('/categories/create', [\App\Http\Controllers\FinancialManagementController::class, 'createCategory'])->name('categories.create');
        Route::post('/categories', [\App\Http\Controllers\FinancialManagementController::class, 'storeCategory'])->name('categories.store');
        Route::get('/budgets', [\App\Http\Controllers\FinancialManagementController::class, 'budgets'])->name('budgets');
        Route::get('/budgets/create', [\App\Http\Controllers\FinancialManagementController::class, 'createBudget'])->name('budgets.create');
        Route::post('/budgets', [\App\Http\Controllers\FinancialManagementController::class, 'storeBudget'])->name('budgets.store');
        Route::get('/reports', [\App\Http\Controllers\FinancialManagementController::class, 'reports'])->name('reports');
    });

    // Transportation Management
    Route::middleware(['auth'])->group(function () {
        Route::get('/transportation', [TransportationController::class, 'index'])->name('transportation.index');
        Route::get('/transportation/dashboard', [TransportationController::class, 'dashboard'])->name('transportation.dashboard');
        Route::get('/transportation/vehicles', [TransportationController::class, 'vehicles'])->name('transportation.vehicles');
        Route::get('/transportation/vehicles/create', [TransportationController::class, 'createVehicle'])->name('transportation.vehicles.create');
        Route::post('/transportation/vehicles', [TransportationController::class, 'storeVehicle'])->name('transportation.vehicles.store');
        Route::get('/transportation/vehicles/{vehicle}/edit', [TransportationController::class, 'editVehicle'])->name('transportation.vehicles.edit');
        Route::put('/transportation/vehicles/{vehicle}', [TransportationController::class, 'updateVehicle'])->name('transportation.vehicles.update');
        Route::patch('/transportation/vehicles/{vehicle}/toggle', [TransportationController::class, 'toggleVehicleStatus'])->name('transportation.vehicles.toggle');
        Route::get('/transportation/bookings', [TransportationController::class, 'bookings'])->name('transportation.bookings');
        Route::get('/transportation/bookings/create', [TransportationController::class, 'createBooking'])->name('transportation.bookings.create');
        Route::post('/transportation/bookings', [TransportationController::class, 'storeBooking'])->name('transportation.bookings.store');
        Route::get('/transportation/bookings/{booking}/edit', [TransportationController::class, 'editBooking'])->name('transportation.bookings.edit');
        Route::put('/transportation/bookings/{booking}', [TransportationController::class, 'updateBooking'])->name('transportation.bookings.update');
        Route::patch('/transportation/bookings/{booking}/pickup', [TransportationController::class, 'markAsPickedUp'])->name('transportation.bookings.pickup');
        Route::patch('/transportation/bookings/{booking}/return', [TransportationController::class, 'markAsReturned'])->name('transportation.bookings.return');
        Route::get('/transportation/maintenance', [TransportationController::class, 'maintenance'])->name('transportation.maintenance');
        Route::post('/transportation/maintenance', [TransportationController::class, 'storeMaintenance'])->name('transportation.maintenance.store');
        Route::put('/transportation/maintenance/{maintenance}', [TransportationController::class, 'updateMaintenance'])->name('transportation.maintenance.update');



        // Rental Companies Management
        Route::prefix('transportation/companies')->name('transportation.companies.')->group(function () {
            Route::get('/', [RentalCompanyController::class, 'index'])->name('index');
            Route::get('/create', [RentalCompanyController::class, 'create'])->name('create');
            Route::post('/', [RentalCompanyController::class, 'store'])->name('store');
            Route::get('/{company}', [RentalCompanyController::class, 'show'])->name('show');
            Route::get('/{company}/edit', [RentalCompanyController::class, 'edit'])->name('edit');
            Route::put('/{company}', [RentalCompanyController::class, 'update'])->name('update');
            Route::delete('/{company}', [RentalCompanyController::class, 'destroy'])->name('destroy');
            Route::patch('/{company}/toggle-status', [RentalCompanyController::class, 'toggleStatus'])->name('toggle-status');
            Route::patch('/{company}/toggle-verification', [RentalCompanyController::class, 'toggleVerification'])->name('toggle-verification');
            Route::patch('/{company}/toggle-featured', [RentalCompanyController::class, 'toggleFeatured'])->name('toggle-featured');
            Route::get('/{company}/vehicles', [RentalCompanyController::class, 'vehicles'])->name('vehicles');
            Route::get('/{company}/contacts', [RentalCompanyController::class, 'contacts'])->name('contacts');
        });

        // Catering Management Routes
        Route::prefix('catering')->name('catering.')->group(function () {
            Route::get('/', [CateringController::class, 'index'])->name('index');
            Route::get('/services', [CateringController::class, 'services'])->name('services');
            Route::get('/services/{service}/edit', [CateringController::class, 'editService'])->name('services.edit');
            Route::put('/services/{service}', [CateringController::class, 'updateService'])->name('services.update');
            Route::patch('/services/{service}/toggle', [CateringController::class, 'toggleAvailability'])->name('services.toggle');

            // Catering Roles Management
            Route::resource('roles', CateringRoleController::class)->names('roles');
            Route::patch('/roles/{role}/toggle', [CateringRoleController::class, 'toggleStatus'])->name('roles.toggle');

            Route::get('/meal-plans', [CateringController::class, 'mealPlans'])->name('meal-plans');
            Route::get('/meal-plans/create', [CateringController::class, 'createMealPlan'])->name('meal-plans.create');
            Route::post('/meal-plans', [CateringController::class, 'storeMealPlan'])->name('meal-plans.store');
            Route::get('/meal-plans/{mealPlan}/edit', [CateringController::class, 'editMealPlan'])->name('meal-plans.edit');
            Route::put('/meal-plans/{mealPlan}', [CateringController::class, 'updateMealPlan'])->name('meal-plans.update');
            Route::delete('/meal-plans/{mealPlan}', [CateringController::class, 'destroyMealPlan'])->name('meal-plans.destroy');
            Route::patch('/meal-plans/{mealPlan}/toggle', [CateringController::class, 'toggleMealPlanStatus'])->name('meal-plans.toggle');
            Route::get('/orders', [CateringController::class, 'orders'])->name('orders');
            Route::get('/create-order', [CateringController::class, 'createOrder'])->name('create-order');

            // Meal Break Plan Management
            // Route::resource('meal-break-plans', MealBreakPlanController::class)->names('meal-break-plans');
            Route::get('/meal-break-plans', [MealBreakPlanController::class, 'index'])->name('meal-break-plans.index');
            Route::get('/meal-break-plans/create', [MealBreakPlanController::class, 'create'])->name('meal-break-plans.create');
            Route::post('/meal-break-plans', [MealBreakPlanController::class, 'store'])->name('meal-break-plans.store');
            Route::get('/meal-break-plans/{meal_break_plan}', [MealBreakPlanController::class, 'show'])->name('meal-break-plans.show');
            Route::get('/meal-break-plans/{meal_break_plan}/edit', [MealBreakPlanController::class, 'edit'])->name('meal-break-plans.edit');
            Route::put('/meal-break-plans/{meal_break_plan}', [MealBreakPlanController::class, 'update'])->name('meal-break-plans.update');
            Route::delete('/meal-break-plans/{meal_break_plan}', [MealBreakPlanController::class, 'destroy'])->name('meal-break-plans.destroy');

            // Daily Meal Orders
            Route::get('/meal-break-plans/{meal_break_plan}/daily-orders', [MealBreakPlanController::class, 'dailyOrders'])->name('meal-break-plans.daily-orders');
            Route::get('/meal-break-plans/{meal_break_plan}/daily-orders/create', [MealBreakPlanController::class, 'createDailyOrder'])->name('meal-break-plans.daily-orders.create');
            Route::post('/meal-break-plans/{meal_break_plan}/daily-orders', [MealBreakPlanController::class, 'storeDailyOrder'])->name('meal-break-plans.daily-orders.store');
            Route::get('/daily-orders/{dailyOrder}/edit', [MealBreakPlanController::class, 'editDailyOrder'])->name('daily-orders.edit');
            Route::put('/daily-orders/{dailyOrder}', [MealBreakPlanController::class, 'updateDailyOrder'])->name('daily-orders.update');
            Route::delete('/daily-orders/{dailyOrder}', [MealBreakPlanController::class, 'destroyDailyOrder'])->name('daily-orders.destroy');

            // Individual Food Orders
            Route::get('/daily-orders/{dailyOrder}/food-orders', [MealBreakPlanController::class, 'foodOrders'])->name('daily-orders.food-orders');
            Route::get('/daily-orders/{dailyOrder}/food-orders/create', [MealBreakPlanController::class, 'createFoodOrder'])->name('daily-orders.food-orders.create');
            Route::post('/daily-orders/{dailyOrder}/food-orders', [MealBreakPlanController::class, 'storeFoodOrder'])->name('daily-orders.food-orders.store');
            Route::get('/food-orders/{foodOrder}/edit', [MealBreakPlanController::class, 'editFoodOrder'])->name('food-orders.edit');
            Route::put('/food-orders/{foodOrder}', [MealBreakPlanController::class, 'updateFoodOrder'])->name('food-orders.update');
            Route::delete('/food-orders/{foodOrder}', [MealBreakPlanController::class, 'destroyFoodOrder'])->name('food-orders.destroy');

            // Food Items Management
            Route::resource('food-items', FoodItemController::class)->names('food-items');
            Route::patch('/food-items/{foodItem}/toggle', [FoodItemController::class, 'toggleAvailability'])->name('food-items.toggle');
        });
    });

    // Trainers Management
    Route::get('/trainers', function () {
        return Inertia::render('Trainers/Index', [
            'trainers' => \App\Models\Trainer::all()
        ]);
    })->name('trainers.index');

    Route::get('/trainers/create', function () {
        return Inertia::render('Trainers/Create');
    })->name('trainers.create');

    Route::post('/trainers', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:trainers,email',
            'phone' => 'nullable|string|max:20',
            'position' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'expertise_areas' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cv_document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'status' => 'required|in:active,inactive,on_leave',
            'hourly_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_image')) {
            $validated['profile_image'] = $request->file('profile_image')->store('trainers/profile', 'public');
        }

        if ($request->hasFile('cv_document')) {
            $validated['cv_document'] = $request->file('cv_document')->store('trainers/cv', 'public');
        }

        \App\Models\Trainer::create($validated);

        return redirect()->route('trainers.index')->with('success', 'Trainer created successfully!');
    })->name('trainers.store');

    Route::get('/trainers/{trainer}', function (\App\Models\Trainer $trainer) {
        $trainer->load(['coursesAsTrainer', 'coursesAsCoordinator']);
        return Inertia::render('Trainers/Show', [
            'trainer' => $trainer
        ]);
    })->name('trainers.show');

    Route::get('/trainers/{trainer}/edit', function (\App\Models\Trainer $trainer) {
        return Inertia::render('Trainers/Edit', [
            'trainer' => $trainer
        ]);
    })->name('trainers.edit');

    Route::put('/trainers/{trainer}', function (\App\Models\Trainer $trainer, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:trainers,email,' . $trainer->id,
            'phone' => 'nullable|string|max:20',
            'position' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'expertise_areas' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cv_document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'status' => 'required|in:active,inactive,on_leave',
            'hourly_rate' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_image')) {
            if ($trainer->profile_image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($trainer->profile_image);
            }
            $validated['profile_image'] = $request->file('profile_image')->store('trainers/profile', 'public');
        }

        if ($request->hasFile('cv_document')) {
            if ($trainer->cv_document) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($trainer->cv_document);
            }
            $validated['cv_document'] = $request->file('cv_document')->store('trainers/cv', 'public');
        }

        $trainer->update($validated);

        return redirect()->route('trainers.index')->with('success', 'Trainer updated successfully!');
    })->name('trainers.update');

    Route::delete('/trainers/{trainer}', function (\App\Models\Trainer $trainer) {
        if ($trainer->profile_image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($trainer->profile_image);
        }
        if ($trainer->cv_document) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($trainer->cv_document);
        }
        $trainer->delete();
        return redirect()->route('trainers.index')->with('success', 'Trainer deleted successfully!');
    })->name('trainers.destroy');

    // Role Management
    Route::prefix('role-management')->name('role-management.')->group(function () {
        Route::get('/', [\App\Http\Controllers\RoleManagementController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\RoleManagementController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\RoleManagementController::class, 'store'])->name('store');
        Route::get('/{role}', [\App\Http\Controllers\RoleManagementController::class, 'show'])->name('show');
        Route::get('/{role}/edit', [\App\Http\Controllers\RoleManagementController::class, 'edit'])->name('edit');
        Route::put('/{role}', [\App\Http\Controllers\RoleManagementController::class, 'update'])->name('update');
        Route::delete('/{role}', [\App\Http\Controllers\RoleManagementController::class, 'destroy'])->name('destroy');
        Route::patch('/{role}/toggle-status', [\App\Http\Controllers\RoleManagementController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/api/list', [\App\Http\Controllers\RoleManagementController::class, 'api'])->name('api');
    });

    // Department Management
    Route::prefix('departments')->name('departments.')->group(function () {
        Route::get('/', [\App\Http\Controllers\DepartmentController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\DepartmentController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\DepartmentController::class, 'store'])->name('store');
        Route::get('/{department}', [\App\Http\Controllers\DepartmentController::class, 'show'])->name('show');
        Route::get('/{department}/edit', [\App\Http\Controllers\DepartmentController::class, 'edit'])->name('edit');
        Route::put('/{department}', [\App\Http\Controllers\DepartmentController::class, 'update'])->name('update');
        Route::delete('/{department}', [\App\Http\Controllers\DepartmentController::class, 'destroy'])->name('destroy');
        Route::patch('/{department}/toggle-status', [\App\Http\Controllers\DepartmentController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/api/list', [\App\Http\Controllers\DepartmentController::class, 'api'])->name('api');
    });

    // Training Hall Management
    Route::prefix('training-halls')->name('training-halls.')->group(function () {
        Route::get('/', [\App\Http\Controllers\TrainingHallController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\TrainingHallController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\TrainingHallController::class, 'store'])->name('store');
        Route::get('/create-unified', [\App\Http\Controllers\TrainingHallController::class, 'createUnified'])->name('create-unified');
        Route::post('/store-unified', [\App\Http\Controllers\TrainingHallController::class, 'storeUnified'])->name('store-unified');
        Route::get('/{trainingHall}', [\App\Http\Controllers\TrainingHallController::class, 'show'])->name('show');
        Route::get('/{trainingHall}/edit', [\App\Http\Controllers\TrainingHallController::class, 'edit'])->name('edit');
        Route::put('/{trainingHall}', [\App\Http\Controllers\TrainingHallController::class, 'update'])->name('update');
        Route::delete('/{trainingHall}', [\App\Http\Controllers\TrainingHallController::class, 'destroy'])->name('destroy');
        Route::patch('/{trainingHall}/toggle-status', [\App\Http\Controllers\TrainingHallController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/api/list', [\App\Http\Controllers\TrainingHallController::class, 'api'])->name('api');
        Route::get('/{trainingHall}/pdf', [\App\Http\Controllers\TrainingHallController::class, 'generatePdf'])->name('pdf');
        Route::get('/{trainingHall}/unified', [\App\Http\Controllers\TrainingHallController::class, 'showUnified'])->name('show-unified');
    });

    // Training Hall Reports (separate from individual hall routes)
    Route::get('/training-halls-reports', [\App\Http\Controllers\TrainingHallController::class, 'reports'])->name('training-halls.reports');

    // Hall Booking Management
    Route::prefix('hall-bookings')->name('hall-bookings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\HallBookingController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\HallBookingController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\HallBookingController::class, 'store'])->name('store');
        Route::get('/pdf-report', [\App\Http\Controllers\HallBookingController::class, 'generatePdf'])->name('pdf-report');
        Route::get('/api/list', [\App\Http\Controllers\HallBookingController::class, 'api'])->name('api');
        Route::get('/{hallBooking}', [\App\Http\Controllers\HallBookingController::class, 'show'])->name('show');
        Route::get('/{hallBooking}/edit', [\App\Http\Controllers\HallBookingController::class, 'edit'])->name('edit');
        Route::put('/{hallBooking}', [\App\Http\Controllers\HallBookingController::class, 'update'])->name('update');
        Route::delete('/{hallBooking}', [\App\Http\Controllers\HallBookingController::class, 'destroy'])->name('destroy');
        Route::patch('/{hallBooking}/toggle-status', [\App\Http\Controllers\HallBookingController::class, 'toggleStatus'])->name('toggle-status');
    });

    // Course Location Management
    Route::prefix('course-location-management')->name('course-location-management.')->group(function () {
        Route::get('/', [\App\Http\Controllers\CourseLocationController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\CourseLocationController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\CourseLocationController::class, 'store'])->name('store');
        Route::get('/{location}', [\App\Http\Controllers\CourseLocationController::class, 'show'])->name('show');
        Route::get('/{location}/edit', [\App\Http\Controllers\CourseLocationController::class, 'edit'])->name('edit');
        Route::put('/{location}', [\App\Http\Controllers\CourseLocationController::class, 'update'])->name('update');
        Route::delete('/{location}', [\App\Http\Controllers\CourseLocationController::class, 'destroy'])->name('destroy');
        Route::patch('/{location}/toggle-status', [\App\Http\Controllers\CourseLocationController::class, 'toggleStatus'])->name('toggle-status');
        Route::get('/api/list', [\App\Http\Controllers\CourseLocationController::class, 'api'])->name('api');
    });

    // Message Management
    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [\App\Http\Controllers\MessagesController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\MessagesController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\MessagesController::class, 'store'])->name('store');
        Route::post('/send-with-template', [\App\Http\Controllers\MessagesController::class, 'sendWithTemplate'])->name('send-with-template');
        Route::get('/{message}', [\App\Http\Controllers\MessagesController::class, 'show'])->name('show');
        Route::patch('/{message}/resend', [\App\Http\Controllers\MessagesController::class, 'resend'])->name('resend');
        Route::delete('/{message}', [\App\Http\Controllers\MessagesController::class, 'destroy'])->name('destroy');

        // Test routes for SMS and WhatsApp
        Route::post('/test-sms', function () {
            $message = new \App\Models\Message([
                'recipient_type' => 'phone',
                'recipient_value' => '+1234567890',
                'recipient_name' => 'Test User',
                'subject' => 'Test SMS',
                'content' => 'This is a test SMS message from ACMS SaaS!',
                'channel' => 'sms',
                'status' => 'pending'
            ]);

            $smsService = app(\App\Services\SMSService::class);
            $result = $smsService->send($message);

            return response()->json([
                'success' => $result,
                'message' => $result ? 'SMS sent successfully' : 'SMS failed',
                'configured' => $smsService->isConfigured(),
                'balance' => $smsService->getBalance()
            ]);
        })->name('test-sms');

        Route::post('/test-whatsapp', function () {
            $message = new \App\Models\Message([
                'recipient_type' => 'phone',
                'recipient_value' => '+1234567890',
                'recipient_name' => 'Test User',
                'subject' => 'Test WhatsApp',
                'content' => 'This is a test WhatsApp message from ACMS SaaS!',
                'channel' => 'whatsapp',
                'status' => 'pending'
            ]);

            $whatsappService = app(\App\Services\WhatsAppService::class);
            $result = $whatsappService->send($message);

            return response()->json([
                'success' => $result,
                'message' => $result ? 'WhatsApp message sent successfully' : 'WhatsApp message failed',
                'configured' => $whatsappService->isConfigured(),
                'templates' => $whatsappService->getTemplates()
            ]);
        })->name('test-whatsapp');
    });

    // Message Templates Management
    Route::prefix('message-templates')->name('message-templates.')->group(function () {
        Route::get('/', [\App\Http\Controllers\MessageTemplateController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\MessageTemplateController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\MessageTemplateController::class, 'store'])->name('store');
        Route::get('/{template}', [\App\Http\Controllers\MessageTemplateController::class, 'show'])->name('show');
        Route::get('/{template}/edit', [\App\Http\Controllers\MessageTemplateController::class, 'edit'])->name('edit');
        Route::put('/{template}', [\App\Http\Controllers\MessageTemplateController::class, 'update'])->name('update');
        Route::delete('/{template}', [\App\Http\Controllers\MessageTemplateController::class, 'destroy'])->name('destroy');
        Route::patch('/{template}/toggle-status', [\App\Http\Controllers\MessageTemplateController::class, 'toggleStatus'])->name('toggle-status');
    });

    // Main Management Page
    Route::get('/management', function () {
        return Inertia::render('Management/Index');
    })->name('management.index');
});

Route::middleware(['auth'])->group(function () {

    // Data endpoints for form dropdowns
    Route::get('/api/employees', [\App\Http\Controllers\DataController::class, 'getEmployees']);
    Route::get('/api/departments', [\App\Http\Controllers\DataController::class, 'getDepartments']);
    Route::get('/api/trainers', [\App\Http\Controllers\DataController::class, 'getTrainers']);
    Route::get('/api/courses', [\App\Http\Controllers\DataController::class, 'getCourses']);
    Route::get('/api/participants', [\App\Http\Controllers\DataController::class, 'getParticipants']);
    Route::get('/api/training-halls', [\App\Http\Controllers\DataController::class, 'getTrainingHalls']);
    Route::get('/api/training-programs', [\App\Http\Controllers\DataController::class, 'getTrainingPrograms']);

    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});



/*
|--------------------------------------------------------------------------
| Auth Routes (Login, Register, etc.)
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
