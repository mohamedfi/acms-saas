<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class CompanyVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_company_id',
        'vehicle_type',
        'brand',
        'model',
        'year',
        'license_plate',
        'color',
        'seats',
        'fuel_type',
        'transmission',
        'engine_size',
        'fuel_consumption',
        'mileage',
        'features',
        'description',
        'images',
        'hourly_rate',
        'daily_rate',
        'weekly_rate',
        'monthly_rate',
        'weekend_rate',
        'holiday_rate',
        'mileage_charge_per_km',
        'included_mileage_per_day',
        'driver_charge_per_hour',
        'fuel_charge',
        'cleaning_fee',
        'insurance_daily_rate',
        'security_deposit',
        'insurance_included',
        'insurance_coverage',
        'status',
        'is_active',
        'requires_special_license',
        'minimum_age_requirement',
        'minimum_driving_experience',
        'current_location',
        'pickup_locations',
        'delivery_available',
        'delivery_charge',
        'delivery_radius_km',
        'last_service_date',
        'next_service_due',
        'insurance_expiry',
        'registration_expiry',
        'maintenance_notes',
        'minimum_rental_hours',
        'maximum_rental_days',
        'blackout_dates',
        'weekend_only',
        'advance_booking_required',
        'advance_booking_hours',
        'average_rating',
        'total_bookings',
        'total_reviews',
        'revenue_to_date',
        'additional_features',
        'special_instructions',
        'admin_notes',
    ];

    protected $casts = [
        'features' => 'array',
        'images' => 'array',
        'pickup_locations' => 'array',
        'blackout_dates' => 'array',
        'additional_features' => 'array',
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'weekly_rate' => 'decimal:2',
        'monthly_rate' => 'decimal:2',
        'weekend_rate' => 'decimal:2',
        'holiday_rate' => 'decimal:2',
        'mileage_charge_per_km' => 'decimal:2',
        'driver_charge_per_hour' => 'decimal:2',
        'fuel_charge' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'insurance_daily_rate' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'fuel_consumption' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'revenue_to_date' => 'decimal:2',
        'seats' => 'integer',
        'mileage' => 'integer',
        'included_mileage_per_day' => 'integer',
        'delivery_radius_km' => 'integer',
        'minimum_rental_hours' => 'integer',
        'maximum_rental_days' => 'integer',
        'minimum_age_requirement' => 'integer',
        'minimum_driving_experience' => 'integer',
        'advance_booking_hours' => 'integer',
        'total_bookings' => 'integer',
        'total_reviews' => 'integer',
        'insurance_included' => 'boolean',
        'is_active' => 'boolean',
        'requires_special_license' => 'boolean',
        'delivery_available' => 'boolean',
        'weekend_only' => 'boolean',
        'advance_booking_required' => 'boolean',
        'last_service_date' => 'date',
        'next_service_due' => 'date',
        'insurance_expiry' => 'date',
        'registration_expiry' => 'date',
    ];

    protected $appends = [
        'display_name',
        'status_badge',
        'price_range',
        'rating_display',
        'maintenance_status',
        'full_specifications',
        'booking_requirements',
    ];

    // Relationships
    public function rentalCompany(): BelongsTo
    {
        return $this->belongsTo(RentalCompany::class);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'available')->where('is_active', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('vehicle_type', $type);
    }

    public function scopeByCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('rental_company_id', $companyId);
    }

    public function scopePriceRange(Builder $query, float $min, float $max): Builder
    {
        return $query->whereBetween('daily_rate', [$min, $max]);
    }

    public function scopeBySeats(Builder $query, int $minSeats): Builder
    {
        return $query->where('seats', '>=', $minSeats);
    }

    public function scopeWithFeature(Builder $query, string $feature): Builder
    {
        return $query->whereJsonContains('features', $feature);
    }

    public function scopeNeedsService(Builder $query): Builder
    {
        return $query->where('next_service_due', '<=', now()->addDays(7));
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return "{$this->year} {$this->brand} {$this->model}";
    }

    public function getStatusBadgeAttribute(): array
    {
        $colors = [
            'available' => ['text' => 'Available', 'class' => 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'],
            'rented' => ['text' => 'Currently Rented', 'class' => 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'],
            'maintenance' => ['text' => 'In Maintenance', 'class' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'],
            'out_of_service' => ['text' => 'Out of Service', 'class' => 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'],
        ];

        return $colors[$this->status] ?? $colors['out_of_service'];
    }

    public function getPriceRangeAttribute(): array
    {
        $prices = array_filter([
            'hourly' => $this->hourly_rate,
            'daily' => $this->daily_rate,
            'weekly' => $this->weekly_rate,
            'monthly' => $this->monthly_rate,
        ]);

        return [
            'lowest' => min($prices),
            'highest' => max($prices),
            'daily' => $this->daily_rate,
            'currency' => $this->rentalCompany->currency ?? 'AED',
        ];
    }

    public function getRatingDisplayAttribute(): string
    {
        if (!$this->average_rating || $this->total_reviews === 0) {
            return 'No ratings yet';
        }

        $stars = str_repeat('⭐', (int) round($this->average_rating));
        return $stars . ' (' . number_format($this->average_rating, 1) . '/5) - ' . $this->total_reviews . ' reviews';
    }

    public function getMaintenanceStatusAttribute(): array
    {
        if (!$this->next_service_due) {
            return ['status' => 'unknown', 'message' => 'Service schedule not set', 'urgent' => false];
        }

        $daysUntilService = now()->diffInDays($this->next_service_due, false);

        if ($daysUntilService < 0) {
            return ['status' => 'overdue', 'message' => 'Service overdue by ' . abs($daysUntilService) . ' days', 'urgent' => true];
        } elseif ($daysUntilService <= 7) {
            return ['status' => 'due_soon', 'message' => 'Service due in ' . $daysUntilService . ' days', 'urgent' => true];
        } elseif ($daysUntilService <= 30) {
            return ['status' => 'upcoming', 'message' => 'Service due in ' . $daysUntilService . ' days', 'urgent' => false];
        }

        return ['status' => 'current', 'message' => 'Next service in ' . $daysUntilService . ' days', 'urgent' => false];
    }

    public function getFullSpecificationsAttribute(): array
    {
        return [
            'basic' => [
                'type' => $this->vehicle_type,
                'brand' => $this->brand,
                'model' => $this->model,
                'year' => $this->year,
                'color' => $this->color,
                'seats' => $this->seats,
            ],
            'technical' => [
                'fuel_type' => $this->fuel_type,
                'transmission' => $this->transmission,
                'engine_size' => $this->engine_size,
                'fuel_consumption' => $this->fuel_consumption,
                'mileage' => $this->mileage,
            ],
            'features' => $this->features ?? [],
            'additional' => $this->additional_features ?? [],
        ];
    }

    public function getBookingRequirementsAttribute(): array
    {
        return [
            'minimum_age' => $this->minimum_age_requirement,
            'minimum_experience' => $this->minimum_driving_experience,
            'special_license' => $this->requires_special_license,
            'minimum_hours' => $this->minimum_rental_hours,
            'maximum_days' => $this->maximum_rental_days,
            'advance_booking' => $this->advance_booking_required,
            'advance_hours' => $this->advance_booking_hours,
            'weekend_only' => $this->weekend_only,
        ];
    }

    // Methods
    public function calculateRentalCost(int $hours, array $extras = []): array
    {
        $days = ceil($hours / 24);
        $baseCost = $this->daily_rate * $days;

        $extrasCost = 0;
        $breakdown = ['base' => $baseCost];

        if (isset($extras['insurance']) && $extras['insurance'] && $this->insurance_daily_rate) {
            $insuranceCost = $this->insurance_daily_rate * $days;
            $extrasCost += $insuranceCost;
            $breakdown['insurance'] = $insuranceCost;
        }

        if (isset($extras['driver']) && $extras['driver'] && $this->driver_charge_per_hour) {
            $driverCost = $this->driver_charge_per_hour * $hours;
            $extrasCost += $driverCost;
            $breakdown['driver'] = $driverCost;
        }

        if (isset($extras['delivery']) && $extras['delivery'] && $this->delivery_charge) {
            $extrasCost += $this->delivery_charge;
            $breakdown['delivery'] = $this->delivery_charge;
        }

        if ($this->cleaning_fee) {
            $extrasCost += $this->cleaning_fee;
            $breakdown['cleaning'] = $this->cleaning_fee;
        }

        $totalCost = $baseCost + $extrasCost;

        return [
            'breakdown' => $breakdown,
            'subtotal' => $baseCost + $extrasCost,
            'deposit' => $this->security_deposit ?? 0,
            'total' => $totalCost,
            'currency' => $this->rentalCompany->currency ?? 'AED',
        ];
    }

    public function isAvailableForDates(\DateTime $startDate, \DateTime $endDate): bool
    {
        if (!$this->is_active || $this->status !== 'available') {
            return false;
        }

        // Check blackout dates
        if ($this->blackout_dates) {
            foreach ($this->blackout_dates as $blackoutDate) {
                $blackout = new \DateTime($blackoutDate);
                if ($blackout >= $startDate && $blackout <= $endDate) {
                    return false;
                }
            }
        }

        // Check weekend only restriction
        if ($this->weekend_only) {
            $isWeekend = in_array($startDate->format('N'), [6, 7]); // Saturday = 6, Sunday = 7
            if (!$isWeekend) {
                return false;
            }
        }

        return true;
    }

    public function hasFeature(string $feature): bool
    {
        return in_array($feature, $this->features ?? []);
    }

    public function needsService(): bool
    {
        return $this->next_service_due && $this->next_service_due <= now()->addDays(7);
    }

    public function updateRevenue(float $amount): void
    {
        $this->increment('revenue_to_date', $amount);
        $this->increment('total_bookings');
    }
}