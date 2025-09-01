<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CateringOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'catering_order_id',
        'catering_service_id',
        'quantity',
        'unit_price',
        'total_price',
        'special_notes',
        'dietary_modifications',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    // Relationships
    public function cateringOrder(): BelongsTo
    {
        return $this->belongsTo(CateringOrder::class);
    }

    public function cateringService(): BelongsTo
    {
        return $this->belongsTo(CateringService::class);
    }
}
