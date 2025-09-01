<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HallBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_hall_id',
        'training_program_id',
        'trainer_id',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'session_dates',
        'max_participants',
        'current_participants',
        'status',
        'notes',
        'price_per_participant',
        'booking_reference',
        'is_recurring',
        'recurring_pattern',
    ];

    protected $casts = [
        'session_dates' => 'array',
        'recurring_pattern' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'max_participants' => 'integer',
        'current_participants' => 'integer',
        'is_recurring' => 'boolean',
        'price_per_participant' => 'decimal:2',
    ];

    /**
     * Get the training hall for this booking
     */
    public function trainingHall(): BelongsTo
    {
        return $this->belongsTo(TrainingHall::class);
    }

    /**
     * Get the training program for this booking
     */
    public function trainingProgram(): BelongsTo
    {
        return $this->belongsTo(TrainingProgram::class);
    }

    /**
     * Get the trainer for this booking
     */
    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'trainer_id');
    }

    /**
     * Scope for scheduled bookings
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope for active bookings
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['scheduled', 'in_progress']);
    }

    /**
     * Generate unique booking reference
     */
    public static function generateBookingReference(): string
    {
        return 'BK-' . date('Ymd') . '-' . strtoupper(uniqid());
    }
}
