<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportationBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'booking_reference',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_id_type',
        'customer_id_number',
        'customer_address',
        'pickup_location',
        'dropoff_location',
        'pickup_datetime',
        'dropoff_datetime',
        'duration_hours',
        'duration_days',
        'total_amount',
        'payment_status',
        'booking_status',
        'special_requests',
        'notes',
        'driver_name',
        'driver_phone',
        'driver_license',
        'fuel_charge',
        'insurance_charge',
        'additional_charges',
        'damage_report',
        'damage_charges',
        'actual_pickup_datetime',
        'actual_dropoff_datetime',
        'actual_mileage',
    ];

    protected $casts = [
        'pickup_datetime' => 'datetime',
        'dropoff_datetime' => 'datetime',
        'duration_hours' => 'integer',
        'duration_days' => 'integer',
        'total_amount' => 'decimal:2',
        'fuel_charge' => 'decimal:2',
        'insurance_charge' => 'decimal:2',
        'additional_charges' => 'decimal:2',
        'damage_charges' => 'decimal:2',
        'actual_pickup_datetime' => 'datetime',
        'actual_dropoff_datetime' => 'datetime',
        'actual_mileage' => 'integer',
    ];

    protected $appends = [
        'duration_display',
        'status_badge',
        'payment_badge',
        'total_with_charges',
        'is_active_booking',
        'is_overdue',
    ];

    // Relationships
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(TransportationVehicle::class, 'vehicle_id');
    }

    // Accessors
    public function getDurationDisplayAttribute(): string
    {
        if ($this->duration_days > 0) {
            return "{$this->duration_days} day(s)";
        }
        return "{$this->duration_hours} hour(s)";
    }

    public function getStatusBadgeAttribute(): string
    {
        return match ($this->booking_status) {
            'confirmed' => '🟢 Confirmed',
            'active' => '🔵 Active',
            'completed' => '✅ Completed',
            'cancelled' => '❌ Cancelled',
            default => '❓ Unknown'
        };
    }

    public function getPaymentBadgeAttribute(): string
    {
        return match ($this->payment_status) {
            'pending' => '🟡 Pending',
            'paid' => '🟢 Paid',
            'refunded' => '🔄 Refunded',
            default => '❓ Unknown'
        };
    }

    public function getTotalWithChargesAttribute(): float
    {
        return $this->total_amount +
            $this->fuel_charge +
            $this->insurance_charge +
            $this->additional_charges +
            $this->damage_charges;
    }

    public function getIsActiveBookingAttribute(): bool
    {
        return $this->booking_status === 'active';
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->dropoff_datetime < now() && $this->booking_status === 'active';
    }

    // Methods
    public function calculateTotalAmount(): float
    {
        $baseAmount = $this->total_amount;
        $charges = $this->fuel_charge + $this->insurance_charge + $this->additional_charges + $this->damage_charges;

        return $baseAmount + $charges;
    }

    public function markAsPickedUp(): void
    {
        $this->update([
            'actual_pickup_datetime' => now(),
            'booking_status' => 'active'
        ]);
    }

    public function markAsReturned(int $actualMileage = null): void
    {
        $this->update([
            'actual_dropoff_datetime' => now(),
            'booking_status' => 'completed',
            'actual_mileage' => $actualMileage
        ]);
    }

    public function cancelBooking(string $reason = null): void
    {
        $this->update([
            'booking_status' => 'cancelled',
            'notes' => $reason ? ($this->notes . "\nCancellation reason: " . $reason) : $this->notes
        ]);
    }

    public function generateBookingReference(): string
    {
        return 'TRN-' . strtoupper(substr(md5(uniqid()), 0, 8));
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (!$booking->booking_reference) {
                $booking->booking_reference = $booking->generateBookingReference();
            }
        });
    }
}
