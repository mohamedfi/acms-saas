<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class MealBreakPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'total_days',
        'total_delivery_cost',
        'total_food_cost',
        'grand_total',
        'status',
        'created_by',
        'approved_by',
        'approved_at',
        'employee_id',
        'department_id',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_days' => 'integer',
        'total_delivery_cost' => 'decimal:2',
        'total_food_cost' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    // Relationships
    public function dailyMealOrders(): HasMany
    {
        return $this->hasMany(DailyMealOrder::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(MealBreakPlanItem::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate])
            ->orWhereBetween('end_date', [$startDate, $endDate]);
    }

    // Accessors
    public function getFormattedStartDateAttribute(): string
    {
        return $this->start_date->format('d-m-Y');
    }

    public function getFormattedEndDateAttribute(): string
    {
        return $this->end_date->format('d-m-Y');
    }

    public function getFormattedTotalDeliveryCostAttribute(): string
    {
        return 'EGP ' . number_format($this->total_delivery_cost, 2);
    }

    public function getFormattedTotalFoodCostAttribute(): string
    {
        return 'EGP ' . number_format($this->total_food_cost, 2);
    }

    public function getFormattedGrandTotalAttribute(): string
    {
        return 'EGP ' . number_format($this->grand_total, 2);
    }

    public function getPeriodLabelAttribute(): string
    {
        return $this->start_date->format('d-m-Y') . ' to ' . $this->end_date->format('d-m-Y');
    }

    // Methods
    public function calculateTotals(): void
    {
        $this->total_days = $this->start_date->diffInDays($this->end_date) + 1;

        $this->total_delivery_cost = $this->dailyMealOrders->sum('delivery_cost');
        $this->total_food_cost = $this->dailyMealOrders->sum('total_food_cost');
        $this->grand_total = $this->total_food_cost + $this->total_delivery_cost;

        $this->save();
    }

    public function getDailyBreakdown(): array
    {
        $breakdown = [];

        for ($date = $this->start_date->copy(); $date <= $this->end_date; $date->addDay()) {
            $dayOrder = $this->dailyMealOrders()
                ->where('order_date', $date->format('Y-m-d'))
                ->first();

            $breakdown[] = [
                'date' => $date->format('Y-m-d'),
                'day_name' => $date->format('l'),
                'day_order' => $dayOrder,
                'has_orders' => $dayOrder ? true : false,
            ];
        }

        return $breakdown;
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['draft', 'active']);
    }

    public function canBeApproved(): bool
    {
        return $this->status === 'draft' && $this->dailyMealOrders()->count() > 0;
    }

    public function approve(User $user): void
    {
        $this->update([
            'status' => 'active',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
    }

    public function complete(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
