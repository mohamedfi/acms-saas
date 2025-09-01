<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'file_path',
        'filename',
        'mime',
        'size_kb',
        'uploaded_by',
        'visibility',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getFileSizeAttribute(): string
    {
        if ($this->size_kb < 1024) {
            return $this->size_kb . ' KB';
        }

        return round($this->size_kb / 1024, 2) . ' MB';
    }
}
