<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerDiem extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_instance_id',
        'user_id',
        'rate_per_day',
        'days',
        'currency',
        'total_amount',
    ];

    protected $casts = [
        'rate_per_day' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function courseInstance(): BelongsTo
    {
        return $this->belongsTo(CourseInstance::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($perDiem) {
            $perDiem->total_amount = $perDiem->rate_per_day * $perDiem->days;
        });
    }
}
