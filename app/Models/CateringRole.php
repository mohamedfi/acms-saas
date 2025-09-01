<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CateringRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'hierarchy_level',
        'is_active',
        'required_skills',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'required_skills' => 'array',
        'hierarchy_level' => 'integer',
    ];

    protected $appends = [
        'display_name',
        'skills_list',
    ];

    // Relationships
    public function employeeAssignments(): HasMany
    {
        return $this->hasMany(CateringServiceEmployee::class, 'role', 'slug');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('hierarchy_level', 'asc')->orderBy('name', 'asc');
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return $this->icon ? $this->icon . ' ' . $this->name : $this->name;
    }

    public function getSkillsListAttribute(): string
    {
        if (!$this->required_skills || !is_array($this->required_skills)) {
            return 'No specific skills required';
        }
        return implode(', ', $this->required_skills);
    }

    // Methods
    public function isSeniorRole(): bool
    {
        return $this->hierarchy_level <= 2; // Chef, Sous Chef, Head Server
    }

    public function isEntryLevel(): bool
    {
        return $this->hierarchy_level >= 5; // Kitchen Helper, Trainee
    }
}
