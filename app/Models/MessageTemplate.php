<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class MessageTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'subject',
        'content',
        'channel',              // email, sms, whatsapp, all
        'category',             // course, task, announcement, reminder
        'variables',            // JSON array of available variables
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'channel_icon',
        'category_icon',
    ];

    // Relationships
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'template_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByChannel($query, $channel)
    {
        return $query->where('channel', $channel)->orWhere('channel', 'all');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Methods
    public function getAvailableVariables(): array
    {
        return $this->variables ?? [];
    }

    public function hasVariable(string $variable): bool
    {
        return in_array($variable, $this->variables ?? []);
    }

    public function renderContent(array $data): string
    {
        $content = $this->content;

        foreach ($data as $key => $value) {
            $content = str_replace("{{" . $key . "}}", $value, $content);
        }

        return $content;
    }

    public function renderSubject(array $data): string
    {
        $subject = $this->subject;

        foreach ($data as $key => $value) {
            $subject = str_replace("{{" . $key . "}}", $value, $subject);
        }

        return $subject;
    }

    public function getChannelIconAttribute(): string
    {
        return match ($this->channel) {
            'email' => '📧',
            'sms' => '💬',
            'whatsapp' => '📱',
            'all' => '🌐',
            default => '📨',
        };
    }

    public function getCategoryIconAttribute(): string
    {
        return match ($this->category) {
            'course' => '📚',
            'task' => '📋',
            'announcement' => '📢',
            'reminder' => '⏰',
            'welcome' => '👋',
            'confirmation' => '✅',
            default => '📝',
        };
    }

    public function isMultiChannel(): bool
    {
        return $this->channel === 'all';
    }

    public function canUseForChannel(string $channel): bool
    {
        return $this->channel === $channel || $this->channel === 'all';
    }
}
