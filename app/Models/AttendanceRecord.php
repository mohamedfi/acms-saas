<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_instance_id',
        'participant_id',
        'status',
        'occurred_at',
        'method',
        'geo',
        'photo_path',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'geo' => 'array',
    ];

    public function courseInstance(): BelongsTo
    {
        return $this->belongsTo(CourseInstance::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
