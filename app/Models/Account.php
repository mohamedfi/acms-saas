<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Account extends Model
{
    protected $fillable = [
        'name',
        'account_number',
        'type',
        'opening_balance',
        'current_balance',
        'currency',
        'description',
        'is_active',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeByType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }

    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('name');
    }

    public function getTypeLabelAttribute(): string
    {
        return ucfirst($this->type);
    }

    public function getFormattedBalanceAttribute(): string
    {
        return number_format($this->current_balance, 2) . ' ' . $this->currency;
    }
}
