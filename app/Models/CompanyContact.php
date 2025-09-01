<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class CompanyContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_company_id',
        'name',
        'title',
        'department',
        'email',
        'phone',
        'mobile',
        'whatsapp',
        'direct_line',
        'extension',
        'contact_type',
        'specializations',
        'languages_spoken',
        'working_hours',
        'timezone',
        'available_weekends',
        'available_holidays',
        'emergency_contact',
        'preferred_contact_methods',
        'preferred_language',
        'notes',
        'office_location',
        'city',
        'region',
        'is_active',
        'is_primary',
        'priority_level',
        'response_time_hours',
        'customer_rating',
        'total_interactions',
        'last_contact_date',
        'linkedin',
        'skype',
        'teams',
    ];

    protected $casts = [
        'specializations' => 'array',
        'languages_spoken' => 'array',
        'working_hours' => 'array',
        'preferred_contact_methods' => 'array',
        'available_weekends' => 'boolean',
        'available_holidays' => 'boolean',
        'emergency_contact' => 'boolean',
        'is_active' => 'boolean',
        'is_primary' => 'boolean',
        'priority_level' => 'integer',
        'response_time_hours' => 'decimal:2',
        'customer_rating' => 'decimal:2',
        'total_interactions' => 'integer',
        'last_contact_date' => 'datetime',
    ];

    protected $appends = [
        'display_name',
        'contact_methods',
        'availability_status',
        'performance_summary',
        'full_contact_info',
    ];

    // Contact type options
    const CONTACT_TYPES = [
        'primary' => 'Primary Contact',
        'sales' => 'Sales Representative',
        'support' => 'Customer Support',
        'billing' => 'Billing/Finance',
        'emergency' => 'Emergency Contact',
        'fleet_manager' => 'Fleet Manager',
        'maintenance' => 'Maintenance Coordinator',
        'insurance' => 'Insurance Specialist',
    ];

    // Language options
    const LANGUAGES = [
        'English' => 'English',
        'Arabic' => 'العربية',
        'French' => 'Français',
        'Spanish' => 'Español',
        'Other' => 'Other',
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

    public function scopePrimary(Builder $query): Builder
    {
        return $query->where('is_primary', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('contact_type', $type);
    }

    public function scopeByCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('rental_company_id', $companyId);
    }

    public function scopeEmergency(Builder $query): Builder
    {
        return $query->where('emergency_contact', true);
    }

    public function scopeAvailableNow(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('working_hours')
                  ->orWhere(function ($subQuery) {
                      // This would need more complex logic to check current time against working hours
                      $subQuery->whereNotNull('working_hours');
                  });
            });
    }

    public function scopeByPriority(Builder $query, int $maxPriority = 3): Builder
    {
        return $query->where('priority_level', '<=', $maxPriority);
    }

    public function scopeTopPerformers(Builder $query): Builder
    {
        return $query->where('customer_rating', '>=', 4.0)
            ->where('response_time_hours', '<=', 2);
    }

    // Accessors
    public function getDisplayNameAttribute(): string
    {
        $parts = [$this->name];
        
        if ($this->title) {
            $parts[] = '(' . $this->title . ')';
        }
        
        return implode(' ', $parts);
    }

    public function getContactMethodsAttribute(): array
    {
        $methods = [];
        
        if ($this->email) {
            $methods['email'] = [
                'type' => 'email',
                'value' => $this->email,
                'label' => 'Email',
                'icon' => '📧'
            ];
        }
        
        if ($this->phone) {
            $methods['phone'] = [
                'type' => 'phone',
                'value' => $this->phone,
                'label' => 'Phone',
                'icon' => '📞'
            ];
        }
        
        if ($this->mobile) {
            $methods['mobile'] = [
                'type' => 'mobile',
                'value' => $this->mobile,
                'label' => 'Mobile',
                'icon' => '📱'
            ];
        }
        
        if ($this->whatsapp) {
            $methods['whatsapp'] = [
                'type' => 'whatsapp',
                'value' => $this->whatsapp,
                'label' => 'WhatsApp',
                'icon' => '💬'
            ];
        }
        
        if ($this->direct_line) {
            $methods['direct'] = [
                'type' => 'direct',
                'value' => $this->direct_line . ($this->extension ? ' ext. ' . $this->extension : ''),
                'label' => 'Direct Line',
                'icon' => '☎️'
            ];
        }
        
        return $methods;
    }

    public function getAvailabilityStatusAttribute(): array
    {
        if (!$this->is_active) {
            return [
                'status' => 'inactive',
                'message' => 'Currently inactive',
                'available' => false
            ];
        }

        if ($this->emergency_contact) {
            return [
                'status' => 'emergency',
                'message' => '24/7 Emergency Contact',
                'available' => true
            ];
        }

        $currentDay = strtolower(Carbon::now($this->timezone ?? config('app.timezone'))->format('l'));
        $currentTime = Carbon::now($this->timezone ?? config('app.timezone'))->format('H:i');

        if (!$this->working_hours || !isset($this->working_hours[$currentDay])) {
            return [
                'status' => 'hours_not_set',
                'message' => 'Working hours not specified',
                'available' => true // Assume available if no hours set
            ];
        }

        $todayHours = $this->working_hours[$currentDay];
        
        if ($todayHours === 'closed') {
            return [
                'status' => 'closed',
                'message' => 'Closed today',
                'available' => false
            ];
        }

        [$open, $close] = explode('-', $todayHours);
        $isOpen = $currentTime >= $open && $currentTime <= $close;

        return [
            'status' => $isOpen ? 'available' : 'outside_hours',
            'message' => $isOpen ? 'Available now' : "Available {$open}-{$close}",
            'available' => $isOpen,
            'hours' => $todayHours
        ];
    }

    public function getPerformanceSummaryAttribute(): array
    {
        return [
            'rating' => $this->customer_rating ? number_format($this->customer_rating, 1) . '/5.0' : 'No rating',
            'response_time' => $this->response_time_hours ? number_format($this->response_time_hours, 1) . ' hours' : 'Not tracked',
            'total_interactions' => $this->total_interactions,
            'last_contact' => $this->last_contact_date ? $this->last_contact_date->diffForHumans() : 'Never',
            'priority' => $this->priority_level,
        ];
    }

    public function getFullContactInfoAttribute(): array
    {
        return [
            'basic' => [
                'name' => $this->name,
                'title' => $this->title,
                'department' => $this->department,
                'type' => $this->contact_type,
                'company' => $this->rentalCompany->name ?? null,
            ],
            'contact' => $this->contact_methods,
            'location' => [
                'office' => $this->office_location,
                'city' => $this->city,
                'region' => $this->region,
                'timezone' => $this->timezone,
            ],
            'preferences' => [
                'methods' => $this->preferred_contact_methods,
                'language' => $this->preferred_language,
                'languages_spoken' => $this->languages_spoken,
            ],
            'availability' => $this->availability_status,
            'specializations' => $this->specializations,
            'social' => array_filter([
                'linkedin' => $this->linkedin,
                'skype' => $this->skype,
                'teams' => $this->teams,
            ]),
        ];
    }

    // Methods
    public function isAvailableNow(): bool
    {
        return $this->availability_status['available'];
    }

    public function canHandle(string $specialization): bool
    {
        return in_array($specialization, $this->specializations ?? []);
    }

    public function speaksLanguage(string $language): bool
    {
        return in_array($language, $this->languages_spoken ?? []);
    }

    public function prefersContactMethod(string $method): bool
    {
        return in_array($method, $this->preferred_contact_methods ?? []);
    }

    public function recordInteraction(): void
    {
        $this->increment('total_interactions');
        $this->update(['last_contact_date' => now()]);
    }

    public function updatePerformance(float $rating, float $responseHours): void
    {
        // Calculate new average rating
        if ($this->customer_rating && $this->total_interactions > 0) {
            $totalRating = $this->customer_rating * $this->total_interactions;
            $newTotal = $this->total_interactions + 1;
            $this->customer_rating = ($totalRating + $rating) / $newTotal;
        } else {
            $this->customer_rating = $rating;
        }

        // Calculate new average response time
        if ($this->response_time_hours && $this->total_interactions > 0) {
            $totalResponseTime = $this->response_time_hours * $this->total_interactions;
            $newTotal = $this->total_interactions + 1;
            $this->response_time_hours = ($totalResponseTime + $responseHours) / $newTotal;
        } else {
            $this->response_time_hours = $responseHours;
        }

        $this->recordInteraction();
        $this->save();
    }

    public function getWorkingHoursForDay(string $day): ?string
    {
        return $this->working_hours[strtolower($day)] ?? null;
    }

    public function isWorkingDay(string $day): bool
    {
        $hours = $this->getWorkingHoursForDay($day);
        return $hours && $hours !== 'closed';
    }

    public function getContactTypeLabel(): string
    {
        return self::CONTACT_TYPES[$this->contact_type] ?? ucfirst($this->contact_type);
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        // Ensure only one primary contact per company
        static::saving(function ($contact) {
            if ($contact->is_primary) {
                static::where('rental_company_id', $contact->rental_company_id)
                    ->where('id', '!=', $contact->id)
                    ->update(['is_primary' => false]);
            }
        });
    }
}