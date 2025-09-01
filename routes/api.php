<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CourseInstanceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\FlightBookingController;
use App\Http\Controllers\Api\HotelBookingController;
use App\Http\Controllers\Api\LogisticsController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\PerDiemController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\TransportBookingController;
use App\Http\Controllers\Api\VisaApplicationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:web');

// Protected routes
Route::middleware('auth:web')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Trainers (admin and coordinator only)
    Route::apiResource('trainers', TrainerController::class)
        ->middleware('role:admin,coordinator')
        ->names([
            'index' => 'trainers.api.index',
            'store' => 'trainers.api.store',
            'show' => 'trainers.api.show',
            'update' => 'trainers.api.update',
            'destroy' => 'trainers.api.destroy'
        ]);



    // Courses (admin and coordinator only)
    Route::apiResource('courses', CourseController::class)
        ->middleware('role:admin,coordinator')
        ->names([
            'index' => 'courses.api.index',
            'store' => 'courses.api.store',
            'show' => 'courses.api.show',
            'update' => 'courses.api.update',
            'destroy' => 'courses.api.destroy'
        ]);

    // Course Instances (admin and coordinator only)
    Route::apiResource('courses/{course}/instances', CourseInstanceController::class)
        ->middleware('role:admin,coordinator');

    // Specific instance routes (accessible by trainers assigned to the course)
    Route::get('/instances/{instance}', [CourseInstanceController::class, 'show'])
        ->middleware('role:admin,coordinator,trainer');
    Route::put('/instances/{instance}', [CourseInstanceController::class, 'update'])
        ->middleware('role:admin,coordinator');
    Route::delete('/instances/{instance}', [CourseInstanceController::class, 'destroy'])
        ->middleware('role:admin');

    // Participants
    Route::apiResource('participants', ParticipantController::class)
        ->middleware('role:admin,coordinator')
        ->names([
            'index' => 'participants.api.index',
            'store' => 'participants.api.store',
            'show' => 'participants.api.show',
            'update' => 'participants.api.update',
            'destroy' => 'participants.api.destroy'
        ]);

    // Enrollments
    Route::post('/instances/{instance}/participants', [EnrollmentController::class, 'store'])
        ->middleware('role:admin,coordinator');
    Route::get('/instances/{instance}/participants', [EnrollmentController::class, 'participants'])
        ->middleware('role:admin,coordinator,trainer');
    Route::put('/instances/{instance}/participants/{participant}', [EnrollmentController::class, 'update'])
        ->middleware('role:admin,coordinator');
    Route::delete('/instances/{instance}/participants/{participant}', [EnrollmentController::class, 'destroy'])
        ->middleware('role:admin,coordinator');

    // Tasks
    Route::apiResource('tasks', TaskController::class)
        ->middleware('role:admin,coordinator,trainer')
        ->names([
            'index' => 'tasks.api.index',
            'store' => 'tasks.api.store',
            'show' => 'tasks.api.show',
            'update' => 'tasks.api.update',
            'destroy' => 'tasks.api.destroy'
        ]);
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete'])
        ->middleware('role:admin,coordinator,trainer');
    Route::get('/tasks/overdue', [TaskController::class, 'overdue'])
        ->middleware('role:admin,coordinator,trainer');
    Route::get('/tasks/today', [TaskController::class, 'today'])
        ->middleware('role:admin,coordinator,trainer');



    // Attendance
    Route::get('/instances/{instance}/attendance', [AttendanceController::class, 'index'])
        ->middleware('role:admin,coordinator,trainer');
    Route::post('/instances/{instance}/attendance', [AttendanceController::class, 'store'])
        ->middleware('role:admin,coordinator,trainer');
    Route::post('/instances/{instance}/attendance/bulk', [AttendanceController::class, 'bulkStore'])
        ->middleware('role:admin,coordinator');
    Route::get('/instances/{instance}/attendance/summary', [AttendanceController::class, 'summary'])
        ->middleware('role:admin,coordinator,trainer');
    Route::get('/instances/{instance}/qr-code', [AttendanceController::class, 'generateQR'])
        ->middleware('role:admin,coordinator');
    Route::post('/attendance/qr-checkin', [AttendanceController::class, 'qrCheckin']);
    Route::put('/attendance/{attendance}', [AttendanceController::class, 'update'])
        ->middleware('role:admin,coordinator');
    Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy'])
        ->middleware('role:admin,coordinator');

    // Logistics Management
    Route::get('/instances/{instance}/logistics', [LogisticsController::class, 'index'])
        ->middleware('role:admin,coordinator,finance');
    Route::get('/instances/{instance}/logistics/summary', [LogisticsController::class, 'summary'])
        ->middleware('role:admin,coordinator,finance');
    Route::post('/instances/{instance}/logistics/approve', [LogisticsController::class, 'approve'])
        ->middleware('role:admin,finance');

    // Flight Bookings
    Route::apiResource('instances/{instance}/flights', FlightBookingController::class)
        ->middleware('role:admin,coordinator');
    Route::apiResource('flights', FlightBookingController::class)
        ->only(['show', 'update', 'destroy'])
        ->middleware('role:admin,coordinator')
        ->names([
            'show' => 'flights.global.show',
            'update' => 'flights.global.update',
            'destroy' => 'flights.global.destroy'
        ]);

    // Hotel Bookings
    Route::apiResource('instances/{instance}/hotels', HotelBookingController::class)
        ->middleware('role:admin,coordinator');
    Route::apiResource('hotels', HotelBookingController::class)
        ->only(['show', 'update', 'destroy'])
        ->middleware('role:admin,coordinator')
        ->names([
            'show' => 'hotels.global.show',
            'update' => 'hotels.global.update',
            'destroy' => 'hotels.global.destroy'
        ]);

    // Transport Bookings
    Route::apiResource('instances/{instance}/transport', TransportBookingController::class)
        ->middleware('role:admin,coordinator');
    Route::apiResource('transport', TransportBookingController::class)
        ->only(['show', 'update', 'destroy'])
        ->middleware('role:admin,coordinator')
        ->names([
            'show' => 'transport.global.show',
            'update' => 'transport.global.update',
            'destroy' => 'transport.global.destroy'
        ]);

    // Visa Applications
    Route::apiResource('instances/{instance}/visas', VisaApplicationController::class)
        ->middleware('role:admin,coordinator');
    Route::apiResource('visas', VisaApplicationController::class)
        ->only(['show', 'update', 'destroy'])
        ->middleware('role:admin,coordinator')
        ->names([
            'show' => 'visas.global.show',
            'update' => 'visas.global.update',
            'destroy' => 'visas.global.destroy'
        ]);

    // Per-Diems
    Route::apiResource('instances/{instance}/perdiems', PerDiemController::class)
        ->middleware('role:admin,coordinator');
    Route::apiResource('perdiems', PerDiemController::class)
        ->only(['show', 'update', 'destroy'])
        ->middleware('role:admin,coordinator')
        ->names([
            'show' => 'perdiems.global.show',
            'update' => 'perdiems.global.update',
            'destroy' => 'perdiems.global.destroy'
        ]);

    // CSRF Cookie for SPA
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF cookie set']);
    });
});
