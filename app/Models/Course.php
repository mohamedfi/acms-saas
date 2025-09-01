<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'delivery_type',
        'country',
        'city',
        'trainer_id',
        'coordinator_id',
        'location_id',
    ];

    protected $casts = [
        'delivery_type' => 'string',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class, 'trainer_id');
    }

    public function coordinator(): BelongsTo
    {
        return $this->belongsTo(Trainer::class, 'coordinator_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(CourseLocation::class, 'location_id');
    }

    /**
     * Evaluations submitted for this course.
     */
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    /**
     * Course instances for this course.
     */
    public function instances()
    {
        return $this->hasMany(CourseInstance::class);
    }

    /**
     * Participants enrolled in this course.
     */
    public function participants()
    {
        return $this->belongsToMany(Participant::class, 'course_enrollments')
            ->withPivot('status', 'enrollment_date', 'completion_date')
            ->withTimestamps();
    }

    /**
     * Enrollments for this course.
     */
    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }
}
