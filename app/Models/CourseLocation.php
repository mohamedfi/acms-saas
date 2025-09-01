<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type', // 'training_center', 'office', 'conference_room', 'hotel', 'client_site'
        'description',
        'address',
        'city',
        'country',
        'building',
        'floor',
        'room',
        'capacity',
        'facilities',
        'contact_person',
        'contact_email',
        'contact_phone',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'capacity' => 'integer',
        'facilities' => 'array',
    ];

    /**
     * Get all courses at this location
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'location_id');
    }

    /**
     * Scope for active locations
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered locations
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Scope for locations by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get the full address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->building,
            $this->floor,
            $this->room,
            $this->city,
            $this->country
        ]);

        return implode(', ', $parts) ?: $this->name;
    }

    /**
     * Get location type display name
     */
    public function getTypeDisplayAttribute(): string
    {
        $types = [
            'training_center' => 'Training Center',
            'office' => 'Office',
            'conference_room' => 'Conference Room',
            'hotel' => 'Hotel',
            'client_site' => 'Client Site',
        ];

        return $types[$this->type] ?? ucfirst(str_replace('_', ' ', $this->type));
    }

    /**
     * Get location icon based on type
     */
    public function getLocationIconAttribute(): string
    {
        $icons = [
            'training_center' => '🎓',
            'office' => '🏢',
            'conference_room' => '💼',
            'hotel' => '🏨',
            'client_site' => '📍',
        ];

        return $icons[$this->type] ?? '📍';
    }
}
