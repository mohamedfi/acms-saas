<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportationMaintenance extends Model
{
    use HasFactory;

    protected $table = 'transportation_maintenance';

    protected $fillable = [
        'vehicle_id',
        'maintenance_type',
        'title',
        'description',
        'maintenance_date',
        'next_maintenance_date',
        'cost',
        'mechanic_name',
        'mechanic_phone',
        'garage_name',
        'garage_address',
        'work_performed',
        'parts_replaced',
        'mileage_at_service',
        'status',
        'notes',
        'invoice_number',
        'warranty_info',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'cost' => 'decimal:2',
        'mileage_at_service' => 'integer',
    ];

    protected $appends = [
        'status_badge',
        'maintenance_type_badge',
        'days_until_next',
        'is_overdue',
        'cost_formatted',
    ];

    // Relationships
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(TransportationVehicle::class, 'vehicle_id');
    }

    // Accessors
    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'scheduled' => '📅 Scheduled',
            'in_progress' => '🔄 In Progress',
            'completed' => '✅ Completed',
            'cancelled' => '❌ Cancelled',
            default => '❓ Unknown'
        };
    }

    public function getMaintenanceTypeBadgeAttribute(): string
    {
        return match ($this->maintenance_type) {
            'routine' => '🔧 Routine',
            'repair' => '🛠️ Repair',
            'inspection' => '🔍 Inspection',
            'emergency' => '🚨 Emergency',
            default => '❓ Unknown'
        };
    }

    public function getDaysUntilNextAttribute(): string
    {
        if (!$this->next_maintenance_date) return 'No next maintenance scheduled';

        $daysUntil = now()->diffInDays($this->next_maintenance_date, false);

        if ($daysUntil < 0) return 'Overdue by ' . abs($daysUntil) . ' days';
        if ($daysUntil === 0) return 'Due today';
        if ($daysUntil === 1) return 'Due tomorrow';

        return "Due in {$daysUntil} days";
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->next_maintenance_date && now()->isAfter($this->next_maintenance_date);
    }

    public function getCostFormattedAttribute(): string
    {
        return '$' . number_format($this->cost, 2);
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('next_maintenance_date', '>=', now())
            ->where('status', '!=', 'cancelled');
    }

    public function scopeOverdue($query)
    {
        return $query->where('next_maintenance_date', '<', now())
            ->where('status', '!=', 'cancelled');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('maintenance_type', $type);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Methods
    public function isUrgent(): bool
    {
        if (!$this->next_maintenance_date) return false;

        $daysUntil = now()->diffInDays($this->next_maintenance_date, false);
        return $daysUntil <= 7;
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'maintenance_date' => now()
        ]);
    }

    public function scheduleNextMaintenance(int $daysFromNow): void
    {
        $this->update([
            'next_maintenance_date' => now()->addDays($daysFromNow)
        ]);
    }

    public function getTotalCostWithParts(): float
    {
        // This could be expanded to include parts cost if you track individual parts
        return $this->cost;
    }
}
