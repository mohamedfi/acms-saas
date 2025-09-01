<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealPlanItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_plan_id',
        'catering_service_id',
        'meal_type',
        'day_number',
        'quantity',
        'notes',
    ];

    protected $casts = [
        'day_number' => 'integer',
        'quantity' => 'integer',
    ];

    // Relationships
    public function mealPlan(): BelongsTo
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function cateringService(): BelongsTo
    {
        return $this->belongsTo(CateringService::class);
    }
}
