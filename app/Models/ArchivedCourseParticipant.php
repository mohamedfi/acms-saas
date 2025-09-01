<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivedCourseParticipant extends Model
{
    protected $fillable = [
        'archived_course_id',
        'participant_name',
        'participant_email',
        'participant_phone',
        'organization',
        'nationality',
        'passport_no',
        'attendance_status',
        'evaluation_score',
        'evaluation_feedback',
        'certificate_issued',
        'certificate_issue_date',
    ];

    protected $casts = [
        'evaluation_score' => 'decimal:2',
        'certificate_issued' => 'boolean',
        'certificate_issue_date' => 'date',
    ];

    public function archivedCourse(): BelongsTo
    {
        return $this->belongsTo(ArchivedCourse::class);
    }
}
