<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subdomain',
        'database_name',
        'is_active',
        'subscription_plan',
        'max_users',
        'max_courses',
        'contact_email',
        'contact_phone',
        'address',
        'city',
        'country',
        'timezone',
        'logo_path',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'max_users' => 'integer',
        'max_courses' => 'integer',
        'settings' => 'array',
    ];

    /**
     * Get all users for this company
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get all courses for this company
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get all employees for this company
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Get all departments for this company
     */
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    /**
     * Get all roles for this company
     */
    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    /**
     * Get all course locations for this company
     */
    public function courseLocations(): HasMany
    {
        return $this->hasMany(CourseLocation::class);
    }

    /**
     * Check if company has reached user limit
     */
    public function hasReachedUserLimit(): bool
    {
        return $this->users()->count() >= $this->max_users;
    }

    /**
     * Check if company has reached course limit
     */
    public function hasReachedCourseLimit(): bool
    {
        return $this->courses()->count() >= $this->max_courses;
    }

    /**
     * Get company usage statistics
     */
    public function getUsageStats(): array
    {
        return [
            'users_count' => $this->users()->count(),
            'users_limit' => $this->max_users,
            'courses_count' => $this->courses()->count(),
            'courses_limit' => $this->max_courses,
            'departments_count' => $this->departments()->count(),
            'employees_count' => $this->employees()->count(),
        ];
    }

    /**
     * Get company subscription details
     */
    public function getSubscriptionDetails(): array
    {
        $plans = [
            'basic' => [
                'name' => 'Basic',
                'price' => 49,
                'features' => ['Up to 10 users', 'Up to 50 courses', 'Basic support']
            ],
            'premium' => [
                'name' => 'Premium',
                'price' => 99,
                'features' => ['Up to 25 users', 'Up to 100 courses', 'Priority support', 'Advanced reports']
            ],
            'enterprise' => [
                'name' => 'Enterprise',
                'price' => 199,
                'features' => ['Unlimited users', 'Unlimited courses', '24/7 support', 'Custom integrations']
            ]
        ];

        return $plans[$this->subscription_plan] ?? $plans['basic'];
    }
}
