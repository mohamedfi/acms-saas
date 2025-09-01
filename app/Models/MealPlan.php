<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MealPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'duration',
        'duration_value',
        'total_price',
        'price_per_day',
        'includes_breakfast',
        'includes_lunch',
        'includes_dinner',
        'includes_snacks',
        'includes_beverages',
        'special_notes',
        'is_active',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'price_per_day' => 'decimal:2',
        'duration_value' => 'integer',
        'includes_breakfast' => 'boolean',
        'includes_lunch' => 'boolean',
        'includes_dinner' => 'boolean',
        'includes_snacks' => 'boolean',
        'includes_beverages' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function items(): HasMany
    {
        return $this->hasMany(MealPlanItem::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByDuration($query, $duration)
    {
        return $query->where('duration', $duration);
    }

    // Accessors
    public function getDurationLabelAttribute(): string
    {
        return match ($this->duration) {
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            default => 'Custom',
        };
    }

    public function getFormattedTotalPriceAttribute(): string
    {
        return '$' . number_format($this->total_price, 2);
    }

    public function getFormattedPricePerDayAttribute(): string
    {
        if ($this->price_per_day) {
            return '$' . number_format($this->price_per_day, 2);
        }
        return 'N/A';
    }

    public function getMealTypesAttribute(): array
    {
        $types = [];
        if ($this->includes_breakfast) $types[] = 'Breakfast';
        if ($this->includes_lunch) $types[] = 'Lunch';
        if ($this->includes_dinner) $types[] = 'Dinner';
        if ($this->includes_snacks) $types[] = 'Snacks';
        if ($this->includes_beverages) $types[] = 'Beverages';

        return $types;
    }
}
