<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'cuisine_type',
        'is_vegetarian',
        'is_vegan',
        'is_halal',
        'is_gluten_free',
        'allergen_info',
        'ingredients',
        'nutritional_info',
        'preparation_time_minutes',
        'serving_temperature',
        'image_path',
        'is_available',
    ];

    protected $casts = [
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_halal' => 'boolean',
        'is_gluten_free' => 'boolean',
        'preparation_time_minutes' => 'integer',
        'is_available' => 'boolean',
    ];

    // Relationships
    public function locations(): HasMany
    {
        return $this->hasMany(FoodItemLocation::class);
    }

    public function individualOrders(): HasMany
    {
        return $this->hasMany(IndividualFoodOrder::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByCuisineType($query, $cuisineType)
    {
        return $query->where('cuisine_type', $cuisineType);
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
    public function getDietaryLabelsAttribute(): array
    {
        $labels = [];
        
        if ($this->is_vegetarian) $labels[] = 'Vegetarian';
        if ($this->is_vegan) $labels[] = 'Vegan';
        if ($this->is_halal) $labels[] = 'Halal';
        if ($this->is_gluten_free) $labels[] = 'Gluten-Free';
        
        return $labels;
    }

    public function getFormattedPreparationTimeAttribute(): string
    {
        if ($this->preparation_time_minutes) {
            $hours = floor($this->preparation_time_minutes / 60);
            $minutes = $this->preparation_time_minutes % 60;
            
            if ($hours > 0) {
                return $hours . 'h ' . $minutes . 'm';
            }
            return $minutes . 'm';
        }
        return 'N/A';
    }

    public function getPriceForLocation(string $location): ?float
    {
        $locationPricing = $this->locations()->where('location', $location)->first();
        return $locationPricing ? $locationPricing->price : null;
    }

    public function getDeliveryCostForLocation(string $location): ?float
    {
        $locationPricing = $this->locations()->where('location', $location)->first();
        return $locationPricing ? $locationPricing->delivery_cost : null;
    }

    public function isAvailableAtLocation(string $location): bool
    {
        $locationPricing = $this->locations()->where('location', $location)->first();
        return $locationPricing ? $locationPricing->is_available : false;
    }

    // Methods
    public function getAvailableLocations(): array
    {
        return $this->locations()
            ->where('is_available', true)
            ->pluck('location')
            ->toArray();
    }

    public function getPricingForAllLocations(): array
    {
        return $this->locations()
            ->where('is_available', true)
            ->get()
            ->mapWithKeys(function ($location) {
                return [$location->location => [
                    'price' => $location->price,
                    'delivery_cost' => $location->delivery_cost,
                    'total_price' => $location->price + $location->delivery_cost,
                ]];
            })
            ->toArray();
    }
}
