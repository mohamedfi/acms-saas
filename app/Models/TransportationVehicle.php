<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportationVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_type',
        'brand',
        'model',
        'year',
        'license_plate',
        'color',
        'seats',
        'fuel_type',
        'transmission',
        'features',
        'description',
        'daily_rate',
        'hourly_rate',
        'weekly_rate',
        'monthly_rate',
        'status',
        'location',
        'insurance_info',
        'last_maintenance',
        'next_maintenance',
        'mileage',
        'maintenance_notes',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'daily_rate' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
        'weekly_rate' => 'decimal:2',
        'monthly_rate' => 'decimal:2',
        'last_maintenance' => 'date',
        'next_maintenance' => 'date',
        'mileage' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'display_name',
        'full_vehicle_info',
        'rate_display',
        'status_badge',
        'maintenance_status',
    ];

    // Relationships
    public function bookings(): HasMany
    {
        return $this->hasMany(TransportationBooking::class, 'vehicle_id');
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(TransportationMaintenance::class, 'vehicle_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('vehicle_type', $type);
    }

    public function scopeByBrand($query, $brand)
    {
        return $query->where('brand', $brand);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return "{$this->year} {$this->brand} {$this->model}";
    }

    public function getFullVehicleInfoAttribute(): string
    {
        return "{$this->year} {$this->brand} {$this->model} - {$this->color} ({$this->license_plate})";
    }

    public function getRateDisplayAttribute(): string
    {
        $rates = [];
        if ($this->daily_rate) $rates[] = "\${$this->daily_rate}/day";
        if ($this->hourly_rate) $rates[] = "\${$this->hourly_rate}/hour";
        if ($this->weekly_rate) $rates[] = "\${$this->weekly_rate}/week";
        if ($this->monthly_rate) $rates[] = "\${$this->monthly_rate}/month";
        
        return implode(', ', $rates);
    }

    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'available' => '🟢 Available',
            'rented' => '🔴 Rented',
            'maintenance' => '🟡 Maintenance',
            'out_of_service' => '⚫ Out of Service',
            default => '❓ Unknown'
        };
    }

    public function getMaintenanceStatusAttribute(): string
    {
        if (!$this->next_maintenance) return 'No maintenance scheduled';
        
        $daysUntil = now()->diffInDays($this->next_maintenance, false);
        
        if ($daysUntil < 0) return '⚠️ Maintenance overdue';
        if ($daysUntil <= 7) return '🔴 Maintenance due soon';
        if ($daysUntil <= 30) return '🟡 Maintenance due this month';
        
        return '🟢 Maintenance up to date';
    }

    // Methods
    public function isAvailable(): bool
    {
        return $this->status === 'available' && $this->is_active;
    }

    public function needsMaintenance(): bool
    {
        return $this->next_maintenance && now()->isAfter($this->next_maintenance);
    }

    public function calculateRentalCost(int $days, int $hours = 0): float
    {
        $cost = 0;
        
        if ($days > 0) {
            $cost += $this->daily_rate * $days;
        }
        
        if ($hours > 0 && $this->hourly_rate) {
            $cost += $this->hourly_rate * $hours;
        }
        
        return $cost;
    }

    public function getUpcomingBookings()
    {
        return $this->bookings()
            ->where('pickup_datetime', '>=', now())
            ->orderBy('pickup_datetime')
            ->get();
    }

    public function getCurrentBooking()
    {
        return $this->bookings()
            ->where('pickup_datetime', '<=', now())
            ->where('dropoff_datetime', '>=', now())
            ->where('booking_status', 'active')
            ->first();
    }
}
