<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CateringServiceEmployee extends Model
{
    use HasFactory;

    protected $table = 'catering_service_employees';

    protected $fillable = [
        'catering_service_id',
        'employee_id',
        'role',
        'notes',
        'is_primary',
        'is_available',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_available' => 'boolean',
    ];

    // Relationships
    public function cateringService(): BelongsTo
    {
        return $this->belongsTo(CateringService::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function roleDefinition(): BelongsTo
    {
        return $this->belongsTo(CateringRole::class, 'role', 'slug');
    }
}
