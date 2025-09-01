<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrainingHall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'address',
        'city',
        'capacity',
        'facilities',
        'contact_person',
        'contact_phone',
        'contact_email',
        'assigned_employee_id',
        'assigned_role',
        'assignment_date',
        'assignment_notes',
        'specialized_courses',
        'is_general_purpose',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'facilities' => 'array',
        'specialized_courses' => 'array',
        'is_active' => 'boolean',
        'is_general_purpose' => 'boolean',
        'capacity' => 'integer',
        'sort_order' => 'integer',
        'assignment_date' => 'date',
    ];

    /**
     * Get all bookings for this hall
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(HallBooking::class);
    }

    /**
     * Get active bookings for this hall
     */
    public function activeBookings(): HasMany
    {
        return $this->hasMany(HallBooking::class)->where('status', '!=', 'cancelled');
    }

    /**
     * Scope for active halls
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered halls
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get the assigned employee for this training hall.
     */
    public function assignedEmployee()
    {
        return $this->belongsTo(\App\Models\Employee::class, 'assigned_employee_id');
    }

    /**
     * Get the specialized courses for this training hall.
     */
    public function specializedCourses()
    {
        return $this->belongsToMany(\App\Models\TrainingProgram::class, 'training_hall_courses', 'training_hall_id', 'training_program_id');
    }

    /**
     * Check if this hall can host a specific course.
     */
    public function canHostCourse($courseId)
    {
        if ($this->is_general_purpose) {
            return true;
        }
        
        return in_array($courseId, $this->specialized_courses ?? []);
    }

    /**
     * Scope for halls assigned to a specific employee
     */
    public function scopeAssignedTo($query, $employeeId)
    {
        return $query->where('assigned_employee_id', $employeeId);
    }

    /**
     * Scope for halls that can host a specific course
     */
    public function scopeCanHostCourse($query, $courseId)
    {
        return $query->where(function($q) use ($courseId) {
            $q->where('is_general_purpose', true)
              ->orWhereJsonContains('specialized_courses', $courseId);
        });
    }
}
