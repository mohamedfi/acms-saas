<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArchivedCourseSection extends Model
{
    protected $fillable = [
        'archived_course_id',
        'section_name_en',
        'section_name_ar',
        'type',
        'description',
        'order',
        'is_required',
        'is_completed',
        'completion_notes',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_completed' => 'boolean',
    ];

    public function archivedCourse(): BelongsTo
    {
        return $this->belongsTo(ArchivedCourse::class);
    }

    public function files()
    {
        return $this->hasMany(ArchivedCourseSectionFile::class);
    }
}
