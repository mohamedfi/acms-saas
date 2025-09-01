<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'code',
        'manager_id',
        'is_active',
        'sort_order',
        'budget',
        'location',
        'contact_email',
        'contact_phone',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'budget' => 'decimal:2',
    ];

    /**
     * Get all employees in this department
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'department_id');
    }

    /**
     * Get the department manager
     */
    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /**
     * Scope for active departments
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered departments
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get the employee count for this department
     */
    public function getEmployeeCountAttribute(): int
    {
        return $this->employees()->count();
    }

    /**
     * Get the total salary cost for this department
     */
    public function getTotalSalaryAttribute(): float
    {
        return $this->employees()->sum('salary') ?? 0;
    }

    /**
     * Get the budget utilization percentage
     */
    public function getBudgetUtilizationAttribute(): float
    {
        if (!$this->budget || $this->budget <= 0) {
            return 0;
        }
        
        return round(($this->total_salary / $this->budget) * 100, 2);
    }
}
