<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FlightBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_instance_id',
        'traveler_user_id',
        'airline',
        'flight_no',
        'depart_airport',
        'arrive_airport',
        'depart_at',
        'return_at',
        'cost',
        'currency',
        'status',
    ];

    protected $casts = [
        'depart_at' => 'datetime',
        'return_at' => 'datetime',
        'cost' => 'decimal:2',
    ];

    public function courseInstance(): BelongsTo
    {
        return $this->belongsTo(CourseInstance::class);
    }

    public function traveler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'traveler_user_id');
    }
}
