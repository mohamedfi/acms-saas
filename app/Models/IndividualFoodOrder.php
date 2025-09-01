<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndividualFoodOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_meal_order_id',
        'food_item_id',
        'customer_name',
        'quantity',
        'unit_price',
        'total_price',
        'special_instructions',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    // Relationships
    public function dailyMealOrder(): BelongsTo
    {
        return $this->belongsTo(DailyMealOrder::class);
    }

    public function foodItem(): BelongsTo
    {
        return $this->belongsTo(FoodItem::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeOrdered($query)
    {
        return $query->where('status', 'ordered');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeInPreparation($query)
    {
        return $query->where('status', 'in_preparation');
    }

    public function scopeReady($query)
    {
        return $query->where('status', 'ready');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeByCustomer($query, $customerName)
    {
        return $query->where('customer_name', $customerName);
    }

    // Accessors
    public function getFormattedUnitPriceAttribute(): string
    {
        return 'EGP ' . number_format($this->unit_price, 2);
    }

    public function getFormattedTotalPriceAttribute(): string
    {
        return 'EGP ' . number_format($this->total_price, 2);
    }

    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'ordered' => 'bg-gray-100 text-gray-800',
            'confirmed' => 'bg-blue-100 text-blue-800',
            'in_preparation' => 'bg-orange-100 text-orange-800',
            'ready' => 'bg-yellow-100 text-yellow-800',
            'delivered' => 'bg-green-100 text-green-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    // Methods
    public function calculateTotalPrice(): void
    {
        $this->total_price = $this->quantity * $this->unit_price;
        $this->save();
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['ordered', 'confirmed']);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['ordered', 'confirmed']);
    }

    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    public function markInPreparation(): void
    {
        $this->update(['status' => 'in_preparation']);
    }

    public function markReady(): void
    {
        $this->update(['status' => 'ready']);
    }

    public function markDelivered(): void
    {
        $this->update(['status' => 'delivered']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    // Boot method to automatically calculate total price
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($order) {
            if ($order->isDirty('quantity') || $order->isDirty('unit_price')) {
                $order->total_price = $order->quantity * $order->unit_price;
            }
        });
    }
}
