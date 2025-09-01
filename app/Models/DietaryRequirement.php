<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DietaryRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'restrictions',
        'allowed_foods',
        'substitutions',
        'requires_medical_attention',
        'medical_notes',
        'icon',
        'color',
        'is_active',
    ];

    protected $casts = [
        'requires_medical_attention' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function cateringServices(): BelongsToMany
    {
        return $this->belongsToMany(CateringService::class, 'catering_dietary_requirements')
            ->withPivot('is_compatible', 'notes')
            ->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeMedical($query)
    {
        return $query->where('requires_medical_attention', true);
    }

    // Accessors
    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'dietary_restriction' => 'Dietary Restriction',
            'allergy' => 'Food Allergy',
            'preference' => 'Food Preference',
            'religious' => 'Religious Requirement',
            default => 'Other',
        };
    }

    public function getCategoryIconAttribute(): string
    {
        return match ($this->category) {
            'dietary_restriction' => '🚫',
            'allergy' => '⚠️',
            'preference' => '❤️',
            'religious' => '🙏',
            default => '📋',
        };
    }

    public function getDisplayIconAttribute(): string
    {
        return $this->icon ?: $this->category_icon;
    }

    public function getColorClassAttribute(): string
    {
        if ($this->color) {
            return $this->color;
        }

        return match ($this->category) {
            'dietary_restriction' => 'text-red-600',
            'allergy' => 'text-orange-600',
            'preference' => 'text-green-600',
            'religious' => 'text-blue-600',
            default => 'text-gray-600',
        };
    }
}
