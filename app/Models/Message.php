<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\User;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_type',      // email, phone, whatsapp
        'recipient_value',     // email address or phone number
        'recipient_name',      // display name
        'subject',
        'content',
        'channel',             // email, sms, whatsapp, in_app
        'status',              // pending, sent, delivered, failed
        'template_id',
        'sender_id',           // who sent the message
        'scheduled_at',        // for scheduled messages
        'sent_at',
        'delivered_at',
        'failed_at',
        'failure_reason',
        'metadata',            // JSON data for API responses
        'cost',                // message cost if applicable
        'priority',            // low, normal, high, urgent
        'category',            // course, task, announcement, reminder
        'related_type',        // polymorphic relationship
        'related_id',          // polymorphic relationship
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'failed_at' => 'datetime',
        'metadata' => 'array',
        'cost' => 'decimal:4',
    ];

    // Relationships
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(MessageTemplate::class, 'template_id');
    }

    public function related(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeByChannel($query, $channel)
    {
        return $query->where('channel', $channel);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeScheduled($query)
    {
        return $query->whereNotNull('scheduled_at')->where('status', 'pending');
    }

    // Methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isSent(): bool
    {
        return $this->status === 'sent';
    }

    public function isDelivered(): bool
    {
        return $this->status === 'delivered';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function isScheduled(): bool
    {
        return $this->scheduled_at && $this->status === 'pending';
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function markAsDelivered(): void
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    public function markAsFailed(string $reason): void
    {
        $this->update([
            'status' => 'failed',
            'failed_at' => now(),
            'failure_reason' => $reason,
        ]);
    }

    public function getChannelIcon(): string
    {
        return match($this->channel) {
            'email' => '📧',
            'sms' => '💬',
            'whatsapp' => '📱',
            'in_app' => '🔔',
            default => '📨',
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            'pending' => 'text-yellow-600',
            'sent' => 'text-blue-600',
            'delivered' => 'text-green-600',
            'failed' => 'text-red-600',
            default => 'text-gray-600',
        };
    }
}
