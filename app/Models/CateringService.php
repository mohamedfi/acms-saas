<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CateringService extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'price_per_person',
        'cuisine_type',
        'is_vegetarian',
        'is_vegan',
        'is_halal',
        'is_gluten_free',
        'preparation_time_minutes',
        'serving_temperature',
        'allergen_info',
        'ingredients',
        'nutritional_info',
        'is_available',
        'image_path',
    ];

    protected $casts = [
        'price_per_person' => 'decimal:2',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_halal' => 'boolean',
        'is_gluten_free' => 'boolean',
        'preparation_time_minutes' => 'integer',
        'serving_temperature' => 'integer',
        'is_available' => 'boolean',
    ];

    // Relationships
    public function dietaryRequirements(): BelongsToMany
    {
        return $this->belongsToMany(DietaryRequirement::class, 'catering_dietary_requirements')
            ->withPivot('is_compatible', 'notes')
            ->withTimestamps();
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'catering_service_employees')
            ->withPivot('role', 'notes', 'is_primary', 'is_available')
            ->withTimestamps();
    }

    public function primaryEmployee(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'catering_service_employees')
            ->wherePivot('is_primary', true)
            ->withPivot('role', 'notes')
            ->withTimestamps();
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(CateringOrderItem::class);
    }

    public function mealPlanItems(): HasMany
    {
        return $this->hasMany(MealPlanItem::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeVegetarian($query)
    {
        return $query->where('is_vegetarian', true);
    }

    public function scopeVegan($query)
    {
        return $query->where('is_vegan', true);
    }

    public function scopeHalal($query)
    {
        return $query->where('is_halal', true);
    }

    public function scopeGlutenFree($query)
    {
        return $query->where('is_gluten_free', true);
    }

    // Accessors
    public function getTypeIconAttribute(): string
    {
        return match ($this->type) {
            'breakfast' => '🌅',
            'lunch' => '🍽️',
            'dinner' => '🌙',
            'snack' => '🍎',
            'beverage' => '☕',
            default => '🍽️',
        };
    }

    public function getDietaryIconsAttribute(): string
    {
        $icons = [];
        if ($this->is_vegetarian) $icons[] = '🥬';
        if ($this->is_vegan) $icons[] = '🌱';
        if ($this->is_halal) $icons[] = '☪️';
        if ($this->is_gluten_free) $icons[] = '🌾';

        return implode(' ', $icons);
    }

    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price_per_person, 2);
    }
}
