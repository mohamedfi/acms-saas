<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class RentalCompany extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'business_hours',
        'primary_email',
        'primary_phone',
        'website',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'registration_number',
        'tax_id',
        'license_number',
        'license_expiry',
        'services_offered',
        'coverage_areas',
        'minimum_rental_hours',
        'offers_insurance',
        'offers_delivery',
        'delivery_fee',
        'security_deposit',
        'payment_methods',
        'currency',
        'cancellation_fee',
        'cancellation_hours',
        'terms_and_conditions',
        'cancellation_policy',
        'damage_policy',
        'rating',
        'total_reviews',
        'is_active',
        'is_verified',
        'is_featured',
        'additional_info',
        'internal_notes',
    ];

    protected $casts = [
        'business_hours' => 'array',
        'services_offered' => 'array',
        'coverage_areas' => 'array',
        'payment_methods' => 'array',
        'additional_info' => 'array',
        'minimum_rental_hours' => 'decimal:2',
        'offers_insurance' => 'boolean',
        'offers_delivery' => 'boolean',
        'delivery_fee' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'cancellation_fee' => 'decimal:2',
        'cancellation_hours' => 'integer',
        'rating' => 'decimal:2',
        'total_reviews' => 'integer',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'license_expiry' => 'date',
    ];

    protected $appends = [
        'display_name',
        'full_address',
        'status_badge',
        'rating_stars',
        'contact_info',
        'total_vehicles',
        'available_vehicles',
    ];

    // Relationships
    public function vehicles(): HasMany
    {
        return $this->hasMany(CompanyVehicle::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(CompanyContact::class);
    }

    public function activeVehicles(): HasMany
    {
        return $this->hasMany(CompanyVehicle::class)->where('is_active', true);
    }

    public function availableVehicles(): HasMany
    {
        return $this->hasMany(CompanyVehicle::class)
            ->where('is_active', true)
            ->where('status', 'available');
    }

    public function primaryContact(): HasMany
    {
        return $this->hasMany(CompanyContact::class)
            ->where('is_primary', true)
            ->where('is_active', true);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('is_verified', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCity(Builder $query, string $city): Builder
    {
        return $query->where('city', $city);
    }

    public function scopeByRating(Builder $query, float $minRating = 3.0): Builder
    {
        return $query->where('rating', '>=', $minRating);
    }

    public function scopeWithVehicles(Builder $query): Builder
    {
        return $query->has('vehicles');
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        return $this->name;
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }

    public function getStatusBadgeAttribute(): array
    {
        if (!$this->is_active) {
            return [
                'text' => 'Inactive',
                'color' => 'red',
                'class' => 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            ];
        }

        if (!$this->is_verified) {
            return [
                'text' => 'Pending Verification',
                'color' => 'yellow',
                'class' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
            ];
        }

        if ($this->is_featured) {
            return [
                'text' => 'Featured Partner',
                'color' => 'purple',
                'class' => 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
            ];
        }

        return [
            'text' => 'Active',
            'color' => 'green',
            'class' => 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
        ];
    }

    public function getRatingStarsAttribute(): string
    {
        if (!$this->rating) {
            return 'No ratings yet';
        }

        $fullStars = floor($this->rating);
        $halfStar = ($this->rating - $fullStars) >= 0.5;
        $emptyStars = 5 - $fullStars - ($halfStar ? 1 : 0);

        return str_repeat('⭐', $fullStars) . 
               ($halfStar ? '⭐' : '') . 
               str_repeat('☆', $emptyStars) . 
               ' (' . number_format($this->rating, 1) . ')';
    }

    public function getContactInfoAttribute(): array
    {
        return [
            'email' => $this->primary_email,
            'phone' => $this->primary_phone,
            'website' => $this->website,
        ];
    }

    public function getTotalVehiclesAttribute(): int
    {
        return $this->vehicles()->count();
    }

    public function getAvailableVehiclesAttribute(): int
    {
        return $this->availableVehicles()->count();
    }

    // Methods
    public function generateSlug(): void
    {
        $this->slug = Str::slug($this->name);
    }

    public function updateRating(): void
    {
        // This would calculate average rating from vehicle reviews
        // For now, just update the total_reviews count
        $this->total_reviews = $this->vehicles()->sum('total_reviews');
        $this->save();
    }

    public function isOpenNow(): bool
    {
        if (!$this->business_hours) {
            return true; // Assume 24/7 if no hours specified
        }

        $currentDay = strtolower(now()->format('l'));
        $currentTime = now()->format('H:i');

        if (!isset($this->business_hours[$currentDay])) {
            return false;
        }

        $hours = $this->business_hours[$currentDay];
        if ($hours === 'closed') {
            return false;
        }

        [$open, $close] = explode('-', $hours);
        return $currentTime >= $open && $currentTime <= $close;
    }

    public function hasService(string $service): bool
    {
        return in_array($service, $this->services_offered ?? []);
    }

    public function coversArea(string $area): bool
    {
        return in_array($area, $this->coverage_areas ?? []);
    }

    public function getLowestDailyRate(): ?float
    {
        return $this->vehicles()
            ->where('is_active', true)
            ->where('status', 'available')
            ->min('daily_rate');
    }

    public function getHighestDailyRate(): ?float
    {
        return $this->vehicles()
            ->where('is_active', true)
            ->where('status', 'available')
            ->max('daily_rate');
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($company) {
            if (empty($company->slug)) {
                $company->generateSlug();
            }
        });

        static::updating(function ($company) {
            if ($company->isDirty('name')) {
                $company->generateSlug();
            }
        });
    }
}