<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivedCourseFinance extends Model
{
    protected $fillable = [
        'archived_course_id',
        'expense_type',
        'amount',
        'currency',
        'description',
        'approved_by',
        'approval_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'approval_date' => 'date',
    ];

    public function archivedCourse(): BelongsTo
    {
        return $this->belongsTo(ArchivedCourse::class);
    }
}
