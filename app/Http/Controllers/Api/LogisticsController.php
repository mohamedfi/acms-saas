<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseInstance;
use App\Models\FlightBooking;
use App\Models\HotelBooking;
use App\Models\TransportBooking;
use App\Models\VisaApplication;
use App\Models\PerDiem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogisticsController extends Controller
{
    /**
     * Get all logistics data for a course instance
     */
    public function index(CourseInstance $instance)
    {
        $logistics = [
            'flights' => $instance->flightBookings()->with('traveler')->get(),
            'hotels' => $instance->hotelBookings()->with('guest')->get(),
            'transport' => $instance->transportBookings()->get(),
            'visas' => $instance->visaApplications()->with('traveler')->get(),
            'perdiems' => $instance->perDiems()->with('user')->get(),
            'total_cost' => $this->calculateTotalCost($instance),
        ];

        return response()->json($logistics);
    }

    /**
     * Get logistics cost summary for a course instance
     */
    public function summary(CourseInstance $instance)
    {
        $summary = [
            'flight_cost' => $instance->flightBookings()->sum('cost'),
            'hotel_cost' => $instance->hotelBookings()
                ->selectRaw('SUM((nightly_rate * DATEDIFF(checkout, checkin)) + taxes) as total')
                ->value('total') ?? 0,
            'transport_cost' => $instance->transportBookings()->sum('cost'),
            'visa_cost' => $instance->visaApplications()->sum('fee'),
            'perdiem_cost' => $instance->perDiems()->sum('total_amount'),
        ];

        $summary['total_cost'] = array_sum($summary);

        return response()->json($summary);
    }

    /**
     * Update logistics approval status
     */
    public function approve(Request $request, CourseInstance $instance)
    {
        $validated = $request->validate([
            'type' => 'required|in:flight,hotel,transport,visa,perdiem',
            'item_id' => 'required|integer',
            'status' => 'required|in:pending,approved,denied',
            'notes' => 'nullable|string',
        ]);

        $model = $this->getLogisticsModel($validated['type']);
        $item = $model::where('course_instance_id', $instance->id)
            ->findOrFail($validated['item_id']);

        $item->update([
            'status' => $validated['status'],
            'approval_notes' => $validated['notes'] ?? null,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        // Update instance total cost
        $instance->update([
            'logistics_cost' => $this->calculateTotalCost($instance)
        ]);

        return response()->json([
            'message' => 'Logistics item status updated successfully',
            'item' => $item->fresh(),
        ]);
    }

    /**
     * Calculate total logistics cost for an instance
     */
    private function calculateTotalCost(CourseInstance $instance): float
    {
        $flightCost = $instance->flightBookings()->where('status', 'approved')->sum('cost');
        $hotelCost = $instance->hotelBookings()
            ->where('status', 'approved')
            ->get()
            ->sum('total_cost');
        $transportCost = $instance->transportBookings()->where('status', 'approved')->sum('cost');
        $visaCost = $instance->visaApplications()->where('status', 'approved')->sum('fee');
        $perdiemCost = $instance->perDiems()->sum('total_amount');

        return $flightCost + $hotelCost + $transportCost + $visaCost + $perdiemCost;
    }

    /**
     * Get the appropriate model class for logistics type
     */
    private function getLogisticsModel(string $type): string
    {
        return match ($type) {
            'flight' => FlightBooking::class,
            'hotel' => HotelBooking::class,
            'transport' => TransportBooking::class,
            'visa' => VisaApplication::class,
            'perdiem' => PerDiem::class,
        };
    }
}
