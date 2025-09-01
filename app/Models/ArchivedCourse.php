<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArchivedCourse extends Model
{
    protected $fillable = [
        'course_name',
        'course_code',
        'description',
        'trainer_name',
        'coordinator_name',
        'start_date',
        'end_date',
        'duration_hours',
        'delivery_type',
        'location_details',
        'total_participants',
        'successful_participants',
        'completion_rate',
        'trainer_notes',
        'coordinator_notes',
        'status',
        'archived_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'archived_date' => 'date',
        'completion_rate' => 'decimal:2',
    ];

    // Relationships
    public function sections(): HasMany
    {
        return $this->hasMany(ArchivedCourseSection::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ArchivedCourseParticipant::class);
    }

    public function finances(): HasMany
    {
        return $this->hasMany(ArchivedCourseFinance::class);
    }

    // Accessors
    public function getFormattedDurationAttribute()
    {
        if ($this->duration_hours >= 24) {
            $days = floor($this->duration_hours / 24);
            $hours = $this->duration_hours % 24;
            return $days . ' day' . ($days > 1 ? 's' : '') . ($hours > 0 ? ' ' . $hours . ' hour' . ($hours > 1 ? 's' : '') : '');
        }
        return $this->duration_hours . ' hour' . ($this->duration_hours > 1 ? 's' : '');
    }

    public function getDeliveryTypeTextAttribute()
    {
        return match ($this->delivery_type) {
            'office' => 'Office',
            'offsite' => 'Offsite',
            'abroad' => 'Abroad',
            default => $this->delivery_type
        };
    }

    public function getStatusBadgeAttribute()
    {
        return match ($this->status) {
            'archived' => 'bg-gray-100 text-gray-800',
            'completed' => 'bg-green-100 text-green-800',
            default => 'bg-blue-100 text-blue-800'
        };
    }
}
