<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PotentialClient extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'position',
        'industry',
        'country',
        'notes',
        'status',
        'source',
        'estimated_value',
        'last_contact_date',
        'next_follow_up',
        'assigned_to',
    ];

    protected $casts = [
        'estimated_value' => 'decimal:2',
        'last_contact_date' => 'date',
        'next_follow_up' => 'date',
    ];

    // Accessor for status display
    public function getStatusDisplayAttribute()
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    // Accessor for source display
    public function getSourceDisplayAttribute()
    {
        return ucfirst(str_replace('_', ' ', $this->source));
    }

    // Scope for filtering by status
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Scope for filtering by source
    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
    }

    // Scope for overdue follow-ups
    public function scopeOverdueFollowUps($query)
    {
        return $query->where('next_follow_up', '<', now()->toDateString())
            ->where('status', '!=', 'closed_won')
            ->where('status', '!=', 'closed_lost');
    }
}
