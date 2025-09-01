<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_code',
        'name',
        'description',
        'category_id',
        'location_id',
        'brand',
        'model',
        'serial_number',
        'condition',
        'purchase_price',
        'purchase_date',
        'supplier',
        'warranty_expiry',
        'status',
        'assigned_to',
        'notes',
        'qr_code',
        'images',
        'last_maintenance',
        'next_maintenance',
        'maintenance_notes',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'purchase_date' => 'date',
        'warranty_expiry' => 'date',
        'last_maintenance' => 'date',
        'next_maintenance' => 'date',
        'images' => 'array',
    ];

    /**
     * Get the category of this asset
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'category_id');
    }

    /**
     * Get the location of this asset
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'location_id');
    }

    /**
     * Scope for available assets
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope for assets in use
     */
    public function scopeInUse($query)
    {
        return $query->where('status', 'in_use');
    }

    /**
     * Scope for assets needing maintenance
     */
    public function scopeNeedsMaintenance($query)
    {
        return $query->where('next_maintenance', '<=', now());
    }

    /**
     * Scope for assets by condition
     */
    public function scopeByCondition($query, $condition)
    {
        return $query->where('condition', $condition);
    }

    /**
     * Generate a unique asset code
     */
    public static function generateAssetCode(): string
    {
        $prefix = 'AST';
        $year = date('Y');
        $lastAsset = self::where('asset_code', 'like', $prefix . $year . '%')
            ->orderBy('asset_code', 'desc')
            ->first();

        if ($lastAsset) {
            $lastNumber = (int) substr($lastAsset->asset_code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get the age of the asset in years
     */
    public function getAgeAttribute(): int
    {
        if (!$this->purchase_date) {
            return 0;
        }
        return $this->purchase_date->diffInYears(now());
    }

    /**
     * Check if asset is under warranty
     */
    public function getIsUnderWarrantyAttribute(): bool
    {
        if (!$this->warranty_expiry) {
            return false;
        }
        return $this->warranty_expiry->isFuture();
    }

    /**
     * Check if asset needs maintenance
     */
    public function getNeedsMaintenanceAttribute(): bool
    {
        if (!$this->next_maintenance) {
            return false;
        }
        return $this->next_maintenance->isPast();
    }

    /**
     * Get the status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'available' => 'green',
            'in_use' => 'blue',
            'maintenance' => 'yellow',
            'retired' => 'gray',
            'lost' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get the condition badge color
     */
    public function getConditionColorAttribute(): string
    {
        return match ($this->condition) {
            'excellent' => 'green',
            'good' => 'blue',
            'fair' => 'yellow',
            'poor' => 'orange',
            'damaged' => 'red',
            default => 'gray'
        };
    }
}
