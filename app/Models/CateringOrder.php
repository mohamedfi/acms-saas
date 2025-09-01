<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CateringOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'course_id',
        'event_name',
        'event_date',
        'event_time',
        'expected_attendees',
        'confirmed_attendees',
        'status',
        'delivery_type',
        'delivery_address',
        'special_instructions',
        'total_amount',
        'tax_amount',
        'discount_amount',
        'final_amount',
        'payment_status',
        'payment_method',
        'payment_date',
        'ordered_by',
        'approved_by',
        'approved_at',
        'cancellation_reason',
        'cancelled_at',
    ];

    protected $casts = [
        'event_date' => 'date',
        'event_time' => 'datetime',
        'expected_attendees' => 'integer',
        'confirmed_attendees' => 'integer',
        'total_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'approved_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Relationships
    public function course(): BelongsTo
    {
        return $this->belongsTo(ArchivedCourse::class, 'course_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(CateringOrderItem::class);
    }

    public function orderedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ordered_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('event_date', $date);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString());
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'in_preparation' => 'In Preparation',
            'ready' => 'Ready',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            default => 'Unknown',
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'confirmed' => 'bg-blue-100 text-blue-800',
            'in_preparation' => 'bg-orange-100 text-orange-800',
            'ready' => 'bg-green-100 text-green-800',
            'delivered' => 'bg-gray-100 text-gray-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getDeliveryTypeLabelAttribute(): string
    {
        return match ($this->delivery_type) {
            'pickup' => 'Pickup',
            'delivery' => 'Delivery',
            'on_site' => 'On Site',
            default => 'Unknown',
        };
    }

    public function getFormattedTotalAmountAttribute(): string
    {
        return '$' . number_format($this->total_amount, 2);
    }

    public function getFormattedFinalAmountAttribute(): string
    {
        return '$' . number_format($this->final_amount, 2);
    }

    public function getEventDateTimeAttribute(): string
    {
        return $this->event_date->format('M d, Y') . ' at ' . $this->event_time->format('g:i A');
    }

    // Methods
    public function calculateTotals(): void
    {
        $this->final_amount = $this->total_amount + $this->tax_amount - $this->discount_amount;
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->status, ['delivered', 'cancelled']);
    }

    public function canBeApproved(): bool
    {
        return $this->status === 'pending';
    }
}
