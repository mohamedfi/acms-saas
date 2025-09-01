<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class DailyMealOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_break_plan_id',
        'order_date',
        'day_name',
        'course_name',
        'number_of_attendance',
        'location',
        'delivery_cost',
        'total_food_cost',
        'daily_total',
        'special_instructions',
        'status',
    ];

    protected $casts = [
        'order_date' => 'date',
        'number_of_attendance' => 'integer',
        'delivery_cost' => 'decimal:2',
        'total_food_cost' => 'decimal:2',
        'daily_total' => 'decimal:2',
    ];

    // Relationships
    public function mealBreakPlan(): BelongsTo
    {
        return $this->belongsTo(MealBreakPlan::class);
    }

    public function individualFoodOrders(): HasMany
    {
        return $this->hasMany(IndividualFoodOrder::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeByLocation($query, $location)
    {
        return $query->where('location', $location);
    }

    public function scopeByCourse($query, $courseName)
    {
        return $query->where('course_name', $courseName);
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('order_date', $date);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('order_date', [$startDate, $endDate]);
    }

    // Accessors
    public function getFormattedOrderDateAttribute(): string
    {
        return $this->order_date->format('d-m-Y');
    }

    public function getFormattedDeliveryCostAttribute(): string
    {
        return 'EGP ' . number_format($this->delivery_cost, 2);
    }

    public function getFormattedTotalFoodCostAttribute(): string
    {
        return 'EGP ' . number_format($this->total_food_cost, 2);
    }

    public function getFormattedDailyTotalAttribute(): string
    {
        return 'EGP ' . number_format($this->daily_total, 2);
    }

    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'confirmed' => 'bg-blue-100 text-blue-800',
            'in_preparation' => 'bg-orange-100 text-orange-800',
            'delivered' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    // Methods
    public function calculateTotals(): void
    {
        $this->total_food_cost = $this->individualFoodOrders->sum('total_price');
        $this->daily_total = $this->total_food_cost + $this->delivery_cost;
        $this->save();
    }

    public function getFoodItemsSummary(): array
    {
        return $this->individualFoodOrders()
            ->with('foodItem')
            ->get()
            ->groupBy('food_item_id')
            ->map(function ($orders, $foodItemId) {
                $firstOrder = $orders->first();
                $totalQuantity = $orders->sum('quantity');
                $totalPrice = $orders->sum('total_price');

                return [
                    'food_item_id' => $foodItemId,
                    'food_item_name' => $firstOrder->foodItem->name,
                    'quantity' => $totalQuantity,
                    'unit_price' => $firstOrder->unit_price,
                    'total_price' => $totalPrice,
                    'special_instructions' => $orders->pluck('special_instructions')->filter()->unique()->values(),
                ];
            })
            ->values()
            ->toArray();
    }

    public function getAttendeesBreakdown(): array
    {
        $breakdown = [];

        foreach ($this->individualFoodOrders as $order) {
            $customerName = $order->customer_name ?: 'Anonymous';

            if (!isset($breakdown[$customerName])) {
                $breakdown[$customerName] = [
                    'name' => $customerName,
                    'orders' => [],
                    'total_cost' => 0,
                ];
            }

            $breakdown[$customerName]['orders'][] = [
                'food_item' => $order->foodItem->name,
                'quantity' => $order->quantity,
                'unit_price' => $order->unit_price,
                'total_price' => $order->total_price,
                'special_instructions' => $order->special_instructions,
            ];

            $breakdown[$customerName]['total_cost'] += $order->total_price;
        }

        return array_values($breakdown);
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    public function markInPreparation(): void
    {
        $this->update(['status' => 'in_preparation']);
    }

    public function markDelivered(): void
    {
        $this->update(['status' => 'delivered']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
