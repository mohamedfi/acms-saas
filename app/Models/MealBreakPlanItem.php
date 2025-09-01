<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealBreakPlanItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_break_plan_id',
        'name',
        'cost',
        'delivery_cost',
        'location',
        'department',
        'course_id',
        'quantity',
        'supplier',
        'day',
        'total',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'delivery_cost' => 'decimal:2',
        'quantity' => 'integer',
        'total' => 'decimal:2',
    ];

    public function mealBreakPlan()
    {
        return $this->belongsTo(MealBreakPlan::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
