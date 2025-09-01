<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisaApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_instance_id',
        'traveler_user_id',
        'destination_country',
        'application_no',
        'submitted_at',
        'status',
        'fee',
        'currency',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'fee' => 'decimal:2',
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
