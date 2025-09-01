<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trainer extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'position',
        'bio',
        'expertise_areas',
        'qualifications',
        'years_experience',
        'profile_image',
        'cv_document',
        'status',
        'hourly_rate',
        'currency',
        'notes',
    ];

    protected $casts = [
        'years_experience' => 'integer',
        'hourly_rate' => 'decimal:2',
    ];

    protected $appends = [
        'expertise_areas_array',
        'profile_image_url',
        'cv_document_url',
        'status_badge',
        'status_text',
        'total_courses'
    ];

    // Relationships
    public function coursesAsTrainer(): HasMany
    {
        return $this->hasMany(Course::class, 'trainer_id');
    }

    public function coursesAsCoordinator(): HasMany
    {
        return $this->hasMany(Course::class, 'coordinator_id');
    }

    public function archivedCoursesAsTrainer(): HasMany
    {
        return $this->hasMany(ArchivedCourse::class, 'trainer_name', 'full_name');
    }

    public function archivedCoursesAsCoordinator(): HasMany
    {
        return $this->hasMany(ArchivedCourse::class, 'coordinator_name', 'full_name');
    }

    // Accessors
    public function getProfileImageUrlAttribute()
    {
        return $this->profile_image ? asset('storage/' . $this->profile_image) : null;
    }

    public function getCvDocumentUrlAttribute()
    {
        return $this->cv_document ? asset('storage/' . $this->cv_document) : null;
    }

    public function getStatusBadgeAttribute()
    {
        return match ($this->status) {
            'active' => 'bg-green-100 text-green-800',
            'inactive' => 'bg-red-100 text-red-800',
            'on_leave' => 'bg-yellow-100 text-yellow-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    public function getStatusTextAttribute()
    {
        return match ($this->status) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'on_leave' => 'On Leave',
            default => 'Unknown'
        };
    }

    public function getExpertiseAreasArrayAttribute()
    {
        if (empty($this->expertise_areas)) {
            return [];
        }

        // Try to decode as JSON first, fallback to comma-separated
        $decoded = json_decode($this->expertise_areas, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        return array_map('trim', explode(',', $this->expertise_areas));
    }

    public function getTotalCoursesAttribute()
    {
        return $this->coursesAsTrainer->count() + $this->coursesAsCoordinator->count();
    }
}
