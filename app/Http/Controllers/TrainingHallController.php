<?php

namespace App\Http\Controllers;

use App\Models\TrainingHall;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TrainingHallController extends Controller
{
    /**
     * Display a listing of training halls.
     */
    public function index()
    {
        $halls = TrainingHall::with(['bookings' => function ($query) {
            $query->where('status', '!=', 'cancelled');
        }])
            ->withCount(['bookings' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            }])
            ->ordered()
            ->get();

        $stats = [
            'total_halls' => TrainingHall::count(),
            'active_halls' => TrainingHall::active()->count(),
            'total_bookings' => \App\Models\HallBooking::where('status', '!=', 'cancelled')->count(),
            'halls_with_bookings' => TrainingHall::has('bookings')->count(),
        ];

        return Inertia::render('TrainingHallManagement/Index', [
            'halls' => $halls,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new training hall.
     */
    public function create()
    {
        return Inertia::render('TrainingHallManagement/Create');
    }

    /**
     * Show the unified form for creating a training hall and booking.
     */
    public function createUnified()
    {
        return Inertia::render('TrainingHallManagement/CreateUnified');
    }

    /**
     * Store a newly created training hall in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:training_halls',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'city' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:1000',
            'facilities' => 'nullable|array',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'assigned_employee_id' => 'nullable|exists:employees,id',
            'assigned_role' => 'nullable|string|max:100',
            'assignment_date' => 'nullable|date',
            'assignment_notes' => 'nullable|string',
            'specialized_courses' => 'nullable|array',
            'specialized_courses.*' => 'exists:training_programs,id',
            'is_general_purpose' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        TrainingHall::create($validated);

        return redirect()->route('training-halls.index')
            ->with('success', 'Training hall created successfully.');
    }

    /**
     * Store a newly created training hall and optional booking in storage.
     */
    public function storeUnified(Request $request)
    {
        // Validate hall information
        $hallValidated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:training_halls',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'city' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:1000',
            'facilities' => 'nullable|array',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Create the training hall
        $trainingHall = TrainingHall::create($hallValidated);

        // Check if booking information is provided
        if ($request->filled('training_program_id') && $request->filled('start_date')) {
            // Validate booking information
            $bookingValidated = $request->validate([
                'training_program_id' => 'required|exists:training_programs,id',
                'trainer_id' => 'nullable|exists:employees,id',
                'start_date' => 'required|date|after_or_equal:today',
                'end_date' => 'required|date|after_or_equal:start_date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'max_participants' => 'required|integer|min:1|max:' . $trainingHall->capacity,
                'current_participants' => 'integer|min:0|max:max_participants',
                'price_per_participant' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            // Create the hall booking
            $bookingValidated['training_hall_id'] = $trainingHall->id;
            $bookingValidated['status'] = 'scheduled';
            $bookingValidated['booking_reference'] = 'HB-' . strtoupper(uniqid());

            \App\Models\HallBooking::create($bookingValidated);
        }

        return redirect()->route('training-halls.index')
            ->with('success', 'Training hall created successfully' .
                ($request->filled('training_program_id') ? ' with initial booking.' : '.'));
    }

    /**
     * Generate PDF report for the training hall
     */
    public function generatePdf(TrainingHall $trainingHall)
    {
        $trainingHall->load(['bookings.trainingProgram', 'bookings.trainer']);

        // Get the most recent active booking for the report
        $recentBooking = $trainingHall->bookings()
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->first();

        $pdfService = new \App\Services\PdfService();
        $pdf = $pdfService->generateTrainingHallReport($trainingHall, $recentBooking);

        return $pdf->download('training-hall-' . $trainingHall->code . '-report.pdf');
    }

    /**
     * Display the unified view of training hall with all its bookings.
     */
    public function showUnified(TrainingHall $trainingHall)
    {
        $trainingHall->load(['bookings.trainingProgram', 'bookings.trainer', 'assignedEmployee']);

        return Inertia::render('TrainingHallManagement/ShowUnified', [
            'hall' => $trainingHall,
            'bookings' => $trainingHall->bookings,
        ]);
    }

    /**
     * Display the specified training hall.
     */
    public function show(TrainingHall $trainingHall)
    {
        $trainingHall->load(['bookings.trainingProgram', 'bookings.trainer', 'assignedEmployee']);

        return Inertia::render('TrainingHallManagement/Show', [
            'hall' => $trainingHall,
        ]);
    }

    /**
     * Show the form for editing the specified training hall.
     */
    public function edit(TrainingHall $trainingHall)
    {
        $trainers = \App\Models\Employee::where('is_active', true)->get();
        $trainingPrograms = \App\Models\TrainingProgram::where('is_active', true)->ordered()->get();

        return Inertia::render('TrainingHallManagement/Edit', [
            'hall' => $trainingHall,
            'trainers' => $trainers,
            'trainingPrograms' => $trainingPrograms,
        ]);
    }

    /**
     * Update the specified training hall in storage.
     */
    public function update(Request $request, TrainingHall $trainingHall)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => ['required', 'string', 'max:10', Rule::unique('training_halls')->ignore($trainingHall->id)],
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'city' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:1000',
            'facilities' => 'nullable|array',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'assigned_employee_id' => 'nullable|exists:employees,id',
            'assigned_role' => 'nullable|string|max:100',
            'assignment_date' => 'nullable|date',
            'assignment_notes' => 'nullable|string',
            'specialized_courses' => 'nullable|array',
            'specialized_courses.*' => 'exists:training_programs,id',
            'is_general_purpose' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $trainingHall->update($validated);

        return redirect()->route('training-halls.show', $trainingHall->id)
            ->with('success', 'Training hall updated successfully.');
    }

    /**
     * Remove the specified training hall from storage.
     */
    public function destroy(TrainingHall $trainingHall)
    {
        // Check if hall has active bookings
        if ($trainingHall->activeBookings()->count() > 0) {
            return back()->with('error', 'Cannot delete training hall with active bookings.');
        }

        $trainingHall->delete();

        return redirect()->route('training-halls.index')
            ->with('success', 'Training hall deleted successfully.');
    }

    /**
     * Toggle training hall active status.
     */
    public function toggleStatus(TrainingHall $trainingHall)
    {
        $trainingHall->update(['is_active' => !$trainingHall->is_active]);

        $status = $trainingHall->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Training hall {$status} successfully.");
    }

    /**
     * Display comprehensive reports and analytics.
     */
    public function reports()
    {
        $halls = TrainingHall::with(['bookings' => function ($query) {
            $query->where('status', '!=', 'cancelled');
        }])
            ->withCount(['bookings' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            }])
            ->ordered()
            ->get();

        $bookings = \App\Models\HallBooking::with(['trainingProgram', 'trainingHall', 'trainer'])
            ->orderBy('start_date', 'desc')
            ->get();

        $programs = \App\Models\TrainingProgram::active()->ordered()->get();

        $stats = [
            'total_halls' => TrainingHall::count(),
            'active_halls' => TrainingHall::active()->count(),
            'total_bookings' => \App\Models\HallBooking::where('status', '!=', 'cancelled')->count(),
            'halls_with_bookings' => TrainingHall::has('bookings')->count(),
        ];

        return Inertia::render('TrainingHallManagement/Reports', [
            'halls' => $halls,
            'bookings' => $bookings,
            'programs' => $programs,
            'stats' => $stats,
        ]);
    }
}
