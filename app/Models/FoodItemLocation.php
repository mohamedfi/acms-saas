<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoodItemLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'food_item_id',
        'location',
        'price',
        'delivery_cost',
        'is_available',
        'location_notes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'delivery_cost' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    // Relationships
    public function foodItem(): BelongsTo
    {
        return $this->belongsTo(FoodItem::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByLocation($query, $location)
    {
        return $query->where('location', $location);
    }

    public function scopeByPriceRange($query, $minPrice, $maxPrice)
    {
        return $query->whereBetween('price', [$minPrice, $maxPrice]);
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return 'EGP ' . number_format($this->price, 2);
    }

    public function getFormattedDeliveryCostAttribute(): string
    {
        return 'EGP ' . number_format($this->delivery_cost, 2);
    }

    public function getFormattedTotalPriceAttribute(): string
    {
        return 'EGP ' . number_format($this->price + $this->delivery_cost, 2);
    }

    public function getTotalPriceAttribute(): float
    {
        return $this->price + $this->delivery_cost;
    }

    // Methods
    public function getPriceBreakdown(): array
    {
        return [
            'food_price' => $this->price,
            'delivery_cost' => $this->delivery_cost,
            'total_price' => $this->price + $this->delivery_cost,
        ];
    }

    public function isAvailableForOrder(): bool
    {
        return $this->is_available && $this->foodItem->is_available;
    }

    public function getAvailabilityStatus(): string
    {
        if (!$this->is_available) {
            return 'Location Unavailable';
        }

        if (!$this->foodItem->is_available) {
            return 'Food Item Unavailable';
        }

        return 'Available';
    }

    // Static methods for common locations
    public static function getAvailableLocations(): array
    {
        return [
            'Alexandria' => 'Alexandria',
            'Nasr City' => 'Nasr City',
            'BDC' => 'BDC',
            'Business Square' => 'Business Square',
            'Dokki' => 'Dokki',
            'Al-Rehab' => 'Al-Rehab',
        ];
    }

    public static function getDefaultDeliveryCosts(): array
    {
        return [
            'Alexandria' => 25.00,
            'Nasr City' => 20.00,
            'BDC' => 15.00,
            'Business Square' => 15.00,
            'Dokki' => 20.00,
            'Al-Rehab' => 25.00,
        ];
    }

    public static function getLocationByDisplayName(string $displayName): ?string
    {
        $locations = self::getAvailableLocations();
        return array_search($displayName, $locations) ?: null;
    }
}
