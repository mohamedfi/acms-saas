<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_instance_id',
        'guest_user_id',
        'hotel_name',
        'address',
        'checkin',
        'checkout',
        'nightly_rate',
        'taxes',
        'currency',
        'status',
    ];

    protected $casts = [
        'checkin' => 'date',
        'checkout' => 'date',
        'nightly_rate' => 'decimal:2',
        'taxes' => 'decimal:2',
    ];

    public function courseInstance(): BelongsTo
    {
        return $this->belongsTo(CourseInstance::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_user_id');
    }

    public function getTotalCostAttribute(): float
    {
        $nights = $this->checkin->diffInDays($this->checkout);
        return ($this->nightly_rate * $nights) + $this->taxes;
    }
}
