<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_instance_id',
        'type',
        'provider',
        'pickup_at',
        'dropoff_at',
        'cost',
        'currency',
        'status',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
    ];

    public function courseInstance(): BelongsTo
    {
        return $this->belongsTo(CourseInstance::class);
    }
}
