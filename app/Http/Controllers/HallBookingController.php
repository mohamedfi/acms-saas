<?php

namespace App\Http\Controllers;

use App\Models\HallBooking;
use App\Models\TrainingHall;
use App\Models\TrainingProgram;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class HallBookingController extends Controller
{
    /**
     * Display a listing of hall bookings.
     */
    public function index()
    {
        $bookings = HallBooking::with(['trainingHall', 'trainingProgram', 'trainer'])
            ->orderBy('start_date', 'desc')
            ->get();

        $stats = [
            'total_bookings' => HallBooking::count(),
            'scheduled_bookings' => HallBooking::scheduled()->count(),
            'in_progress_bookings' => HallBooking::where('status', 'in_progress')->count(),
            'completed_bookings' => HallBooking::where('status', 'completed')->count(),
        ];

        return Inertia::render('HallBookingManagement/Index', [
            'bookings' => $bookings,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new hall booking.
     */
    public function create()
    {
        return Inertia::render('HallBookingManagement/Create');
    }

    /**
     * Store a newly created hall booking in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'training_program_id' => 'required|exists:training_programs,id',
            'training_hall_id' => 'required|exists:training_halls,id',
            'trainer_id' => 'nullable|exists:employees,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_participants' => 'required|integer|min:1|max:1000',
            'current_participants' => 'integer|min:0',
            'price_per_participant' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_pattern' => 'nullable|array',
        ]);

        // Generate unique booking reference
        $validated['booking_reference'] = HallBooking::generateBookingReference();

        // Set default status
        $validated['status'] = 'scheduled';

        // Create the booking
        HallBooking::create($validated);

        return redirect()->route('hall-bookings.index')
            ->with('success', 'Hall booking created successfully.');
    }

    /**
     * Display the specified hall booking.
     */
    public function show(HallBooking $hallBooking)
    {
        $hallBooking->load(['trainingHall', 'trainingProgram', 'trainer']);

        return Inertia::render('HallBookingManagement/Show', [
            'booking' => $hallBooking,
        ]);
    }

    /**
     * Show the form for editing the specified hall booking.
     */
    public function edit(HallBooking $hallBooking)
    {
        return Inertia::render('HallBookingManagement/Edit', [
            'booking' => $hallBooking,
        ]);
    }

    /**
     * Update the specified hall booking in storage.
     */
    public function update(Request $request, HallBooking $hallBooking)
    {
        $validated = $request->validate([
            'training_program_id' => 'required|exists:training_programs,id',
            'training_hall_id' => 'required|exists:training_halls,id',
            'trainer_id' => 'nullable|exists:employees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_participants' => 'required|integer|min:1|max:1000',
            'current_participants' => 'integer|min:0',
            'price_per_participant' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_pattern' => 'nullable|array',
        ]);

        $hallBooking->update($validated);

        return redirect()->route('hall-bookings.index')
            ->with('success', 'Hall booking updated successfully.');
    }

    /**
     * Remove the specified hall booking from storage.
     */
    public function destroy(HallBooking $hallBooking)
    {
        $hallBooking->delete();

        return redirect()->route('hall-bookings.index')
            ->with('success', 'Hall booking deleted successfully.');
    }

    /**
     * Toggle hall booking status.
     */
    public function toggleStatus(HallBooking $hallBooking)
    {
        $hallBooking->update(['status' => 'completed']);
        return redirect()->back()->with('success', 'Hall booking marked as completed.');
    }

    public function generatePdf(Request $request)
    {
        try {
            $query = HallBooking::with(['trainingHall', 'trainingProgram', 'trainer'])
                ->orderBy('start_date', 'desc');

            // Debug: Check if relationships are working
            \Log::info("Query built with relationships");

            // Filter by selected courses if provided
            if ($request->has('courses') && is_array($request->courses) && !empty($request->courses)) {
                $query->whereHas('trainingProgram', function ($q) use ($request) {
                    $q->whereIn('name', $request->courses);
                });
            }

            $bookings = $query->get();

            // Debug logging
            \Log::info("PDF Report Generation - Total bookings loaded: " . $bookings->count());
            \Log::info("PDF Report Generation - Sample booking data:", [
                'first_booking' => $bookings->first() ? [
                    'id' => $bookings->first()->id,
                    'status' => $bookings->first()->status,
                    'start_date' => $bookings->first()->start_date,
                    'training_program' => $bookings->first()->trainingProgram?->name,
                    'training_hall' => $bookings->first()->trainingHall?->name,
                    'trainer' => $bookings->first()->trainer?->full_name,
                ] : 'No bookings found'
            ]);

            // Calculate stats based on filtered data
            $stats = [
                'total_bookings' => $bookings->count(),
                'scheduled_bookings' => $bookings->where('status', 'scheduled')->count(),
                'in_progress_bookings' => $bookings->where('status', 'in_progress')->count(),
                'completed_bookings' => $bookings->where('status', 'completed')->count(),
                'cancelled_bookings' => $bookings->where('status', 'cancelled')->count(),
            ];

            // Generate comprehensive chart data with fallbacks
            $courseData = [];
            $hallData = [];
            $monthlyData = [];
            $statusData = [];
            $trainerData = [];

            foreach ($bookings as $booking) {
                // Course distribution
                $courseName = $booking->trainingProgram?->name ?? 'Unknown Course';
                $courseData[$courseName] = ($courseData[$courseName] ?? 0) + 1;

                // Hall utilization
                $hallName = $booking->trainingHall?->name ?? 'Unknown Hall';
                $hallData[$hallName] = ($hallData[$hallName] ?? 0) + 1;

                // Debug logging for first few bookings
                if (count($courseData) <= 3) {
                    \Log::info("Processing booking {$booking->id}:", [
                        'courseName' => $courseName,
                        'hallName' => $hallName,
                        'status' => $booking->status,
                        'start_date' => $booking->start_date,
                        'training_program_id' => $booking->training_program_id,
                        'training_hall_id' => $booking->training_hall_id,
                    ]);
                }

                // Monthly distribution with better date handling
                if ($booking->start_date) {
                    try {
                        $month = date('M Y', strtotime($booking->start_date));
                        $monthlyData[$month] = ($monthlyData[$month] ?? 0) + 1;
                    } catch (\Exception $e) {
                        \Log::warning("Invalid date format for booking {$booking->id}: {$booking->start_date}");
                        $monthlyData['Invalid Date'] = ($monthlyData['Invalid Date'] ?? 0) + 1;
                    }
                }

                // Status distribution
                $status = $booking->status ?? 'unknown';
                $statusData[$status] = ($statusData[$status] ?? 0) + 1;

                // Trainer distribution
                $trainerName = $booking->trainer?->full_name ?? 'Unknown Trainer';
                $trainerData[$trainerName] = ($trainerData[$trainerName] ?? 0) + 1;
            }

            // Ensure we have data for all statuses even if zero
            $allStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
            foreach ($allStatuses as $status) {
                if (!isset($statusData[$status])) {
                    $statusData[$status] = 0;
                }
            }

            // Ensure we have data for all months in the range with better date handling
            if (!empty($bookings)) {
                $validDates = $bookings->filter(function ($booking) {
                    return $booking->start_date && strtotime($booking->start_date) !== false;
                });

                if ($validDates->isNotEmpty()) {
                    $earliestDate = $validDates->min('start_date');
                    $latestDate = $validDates->max('start_date');

                    if ($earliestDate && $latestDate) {
                        try {
                            $current = new \DateTime($earliestDate);
                            $end = new \DateTime($latestDate);

                            while ($current <= $end) {
                                $monthKey = $current->format('M Y');
                                if (!isset($monthlyData[$monthKey])) {
                                    $monthlyData[$monthKey] = 0;
                                }
                                $current->modify('+1 month');
                            }

                            // Sort monthly data chronologically
                            ksort($monthlyData);
                        } catch (\Exception $e) {
                            \Log::error("Error processing date range: " . $e->getMessage());
                        }
                    }
                }
            }

            // Add fallback data if charts are empty
            if (empty($courseData)) {
                $courseData = ['No Data Available' => 1];
            }
            if (empty($hallData)) {
                $hallData = ['No Data Available' => 1];
            }
            if (empty($monthlyData)) {
                $monthlyData = ['No Data Available' => 1];
            }
            if (empty($statusData)) {
                $statusData = ['No Data Available' => 1];
            }

            // Debug logging before creating chartData
            \Log::info("Before creating chartData:", [
                'courseData_keys' => array_keys($courseData),
                'courseData_values' => array_values($courseData),
                'hallData_keys' => array_keys($hallData),
                'hallData_values' => array_values($hallData),
                'courseData_count' => count($courseData),
                'hallData_count' => count($hallData),
            ]);

            // Prepare comprehensive chart data for frontend
            $chartData = [
                'courseLabels' => array_keys($courseData),
                'courseValues' => array_values($courseData),
                'hallLabels' => array_keys($hallData),
                'hallValues' => array_values($hallData),
                'monthlyLabels' => array_keys($monthlyData),
                'monthlyValues' => array_values($monthlyData),
                'statusLabels' => array_keys($statusData),
                'statusValues' => array_values($statusData),
                'trainerLabels' => array_keys($trainerData),
                'trainerValues' => array_values($trainerData),
            ];

            // Debug logging for chart data
            \Log::info("PDF Report Generation - Chart data prepared:", [
                'courseData' => $courseData,
                'hallData' => $hallData,
                'monthlyData' => $monthlyData,
                'statusData' => $statusData,
                'chartData_keys' => array_keys($chartData),
                'chartData_sample' => [
                    'courseLabels_count' => count($chartData['courseLabels']),
                    'courseValues_count' => count($chartData['courseValues']),
                    'hallLabels_count' => count($chartData['hallLabels']),
                    'hallValues_count' => count($chartData['hallValues']),
                ],
                'raw_courseData_keys' => array_keys($courseData),
                'raw_courseData_values' => array_values($courseData),
                'raw_hallData_keys' => array_keys($hallData),
                'raw_hallData_values' => array_values($hallData),
                'test_array_keys' => array_keys($courseData),
                'test_array_values' => array_values($courseData),
                'test_array_keys_type' => gettype(array_keys($courseData)),
                'test_array_values_type' => gettype(array_values($courseData)),
            ]);

            // Add metadata for better debugging
            $metadata = [
                'generated_at' => now()->format('Y-m-d H:i:s'),
                'total_records' => $bookings->count(),
                'date_range' => [
                    'earliest' => $bookings->min('start_date'),
                    'latest' => $bookings->max('start_date'),
                ],
                'courses_filtered' => $request->has('courses') ? $request->courses : 'All courses',
            ];

            // Final debug: Test the actual data being sent
            \Log::info("Final chartData being sent to frontend:", [
                'chartData_json' => json_encode($chartData),
                'chartData_serialized' => serialize($chartData),
                'chartData_var_export' => var_export($chartData, true),
            ]);

            return Inertia::render('HallBookingManagement/PdfReport', [
                'bookings' => $bookings,
                'stats' => $stats,
                'chartData' => $chartData,
                'metadata' => $metadata,
            ]);
        } catch (\Exception $e) {
            \Log::error("Error generating PDF report: " . $e->getMessage());

            // Return fallback data
            return Inertia::render('HallBookingManagement/PdfReport', [
                'bookings' => collect(),
                'stats' => [
                    'total_bookings' => 0,
                    'scheduled_bookings' => 0,
                    'in_progress_bookings' => 0,
                    'completed_bookings' => 0,
                    'cancelled_bookings' => 0,
                ],
                'chartData' => [
                    'courseLabels' => ['No Data Available'],
                    'courseValues' => [1],
                    'hallLabels' => ['No Data Available'],
                    'hallValues' => [1],
                    'monthlyLabels' => ['No Data Available'],
                    'monthlyValues' => [1],
                    'statusLabels' => ['No Data Available'],
                    'statusValues' => [1],
                    'trainerLabels' => ['No Data Available'],
                    'trainerValues' => [1],
                ],
                'metadata' => [
                    'generated_at' => now()->format('Y-m-d H:i:s'),
                    'error' => 'Failed to load data. Please try again.',
                ],
            ]);
        }
    }
}
