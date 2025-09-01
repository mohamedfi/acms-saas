<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Budget extends Model
{
    protected $fillable = [
        'name',
        'description',
        'period',
        'fiscal_year',
        'period_name',
        'category_id',
        'budgeted_amount',
        'actual_amount',
        'variance',
        'variance_percentage',
        'is_active',
    ];

    protected $casts = [
        'budgeted_amount' => 'decimal:2',
        'actual_amount' => 'decimal:2',
        'variance' => 'decimal:2',
        'variance_percentage' => 'decimal:2',
        'fiscal_year' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(FinancialCategory::class, 'category_id');
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeByPeriod(Builder $query, string $period): void
    {
        $query->where('period', $period);
    }

    public function scopeByFiscalYear(Builder $query, int $year): void
    {
        $query->query->where('fiscal_year', $year);
    }

    public function scopeByCategory(Builder $query, int $categoryId): void
    {
        $query->where('category_id', $categoryId);
    }

    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('fiscal_year', 'desc')
            ->orderBy('period')
            ->orderBy('period_name');
    }

    public function getPeriodLabelAttribute(): string
    {
        return ucfirst($this->period);
    }

    public function getFormattedBudgetedAmountAttribute(): string
    {
        return number_format($this->budgeted_amount, 2);
    }

    public function getFormattedActualAmountAttribute(): string
    {
        return number_format($this->actual_amount, 2);
    }

    public function getFormattedVarianceAttribute(): string
    {
        return number_format($this->variance, 2);
    }

    public function getVarianceColorAttribute(): string
    {
        if ($this->variance > 0) {
            return 'text-red-600'; // Over budget
        } elseif ($this->variance < 0) {
            return 'text-green-600'; // Under budget
        }
        return 'text-gray-600'; // On budget
    }
}
