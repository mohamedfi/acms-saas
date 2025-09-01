<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrainingProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'duration_hours',
        'total_sessions',
        'price_per_session',
        'category',
        'level',
        'prerequisites',
        'learning_objectives',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'learning_objectives' => 'array',
        'is_active' => 'boolean',
        'duration_hours' => 'integer',
        'total_sessions' => 'integer',
        'price_per_session' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    /**
     * Get all bookings for this program
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(HallBooking::class);
    }

    /**
     * Get active bookings for this program
     */
    public function activeBookings(): HasMany
    {
        return $this->hasMany(HallBooking::class)->where('status', '!=', 'cancelled');
    }

    /**
     * Scope for active programs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered programs
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
