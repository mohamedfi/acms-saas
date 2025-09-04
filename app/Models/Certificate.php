<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Certificate extends Model
{
    protected $fillable = [
        'certificate_number',
        'course_name',
        'participant_name',
        'participant_email',
        'company_name',
        'completion_date',
        'issue_date',
        'description',
        'background_image',
        'orientation',
        'custom_fields',
        'customization',
        'status',
        'notes',
    ];

    protected $casts = [
        'completion_date' => 'date',
        'issue_date' => 'date',
        'custom_fields' => 'array',
        'customization' => 'array',
    ];

    /**
     * Generate a unique certificate number
     */
    public static function generateCertificateNumber()
    {
        $prefix = 'CERT';
        $year = date('Y');
        $month = date('m');

        // Get the last certificate number for this month
        $lastCertificate = self::where('certificate_number', 'like', $prefix . $year . $month . '%')
            ->orderBy('certificate_number', 'desc')
            ->first();

        if ($lastCertificate) {
            $lastNumber = (int) substr($lastCertificate->certificate_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $year . $month . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get the certificate status display
     */
    public function getStatusDisplayAttribute()
    {
        return match ($this->status) {
            'active' => 'Active',
            'revoked' => 'Revoked',
            'expired' => 'Expired',
            default => 'Unknown'
        };
    }

    /**
     * Check if certificate is valid
     */
    public function getIsValidAttribute()
    {
        return $this->status === 'active';
    }

    /**
     * Get formatted completion date
     */
    public function getFormattedCompletionDateAttribute()
    {
        return $this->completion_date ? $this->completion_date->format('F j, Y') : null;
    }

    /**
     * Get formatted issue date
     */
    public function getFormattedIssueDateAttribute()
    {
        return $this->issue_date ? $this->issue_date->format('F j, Y') : null;
    }

    /**
     * Scope for active certificates
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for certificates by course
     */
    public function scopeByCourse($query, $courseName)
    {
        return $query->where('course_name', $courseName);
    }

    /**
     * Scope for certificates by participant
     */
    public function scopeByParticipant($query, $participantName)
    {
        return $query->where('participant_name', 'like', '%' . $participantName . '%');
    }

    /**
     * Scope for certificates by company
     */
    public function scopeByCompany($query, $companyName)
    {
        return $query->where('company_name', 'like', '%' . $companyName . '%');
    }
}
