<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'building',
        'floor',
        'room',
        'area',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get all assets at this location
     */
    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class, 'location_id');
    }

    /**
     * Scope for active locations
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered locations
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get the full location address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->building,
            $this->floor,
            $this->room,
            $this->area
        ]);

        return implode(', ', $parts) ?: $this->name;
    }

    /**
     * Get the total count of assets at this location
     */
    public function getAssetCountAttribute(): int
    {
        return $this->assets()->count();
    }

    /**
     * Get the total value of assets at this location
     */
    public function getTotalValueAttribute(): float
    {
        return $this->assets()->sum('purchase_price') ?? 0;
    }
}
