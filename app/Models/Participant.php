<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $fillable = [
        'full_name', 
        'email', 
        'phone', 
        'organization', 
        'passport_no', 
        'nationality', 
        'notes', 
        'profile_image', 
        'thumbnail',
        'qr_code',
        'passport_id_document',
        'visa_status'
    ];

    protected $casts = [
        'visa_status' => 'string',
    ];

    // Accessor for profile image URL
    public function getProfileImageUrlAttribute()
    {
        if ($this->profile_image) {
            return asset('storage/' . $this->profile_image);
        }
        return null;
    }

    // Accessor for thumbnail URL
    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail) {
            return asset('storage/' . $this->thumbnail);
        }
        return null;
    }

    // Accessor for passport/ID document URL
    public function getPassportIdDocumentUrlAttribute()
    {
        if ($this->passport_id_document) {
            return asset('storage/' . $this->passport_id_document);
        }
        return null;
    }

    // Method to get automatic visa status based on nationality
    public function getAutomaticVisaStatusAttribute()
    {
        if ($this->nationality && strtolower($this->nationality) === 'egyptian') {
            return 'not_required';
        }
        return 'required';
    }

    // Generate unique QR code for participant
    public static function generateQrCode()
    {
        do {
            $qrCode = 'PMEC-' . strtoupper(substr(md5(uniqid()), 0, 8));
        } while (static::where('qr_code', $qrCode)->exists());
        
        return $qrCode;
    }

    // Course relationships
    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_enrollments')
                    ->withPivot('status', 'enrollment_date', 'completion_date')
                    ->withTimestamps();
    }

    public function courseInstances()
    {
        return $this->belongsToMany(CourseInstance::class, 'course_enrollments')
                    ->withPivot('status', 'enrollment_date', 'completion_date')
                    ->withTimestamps();
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
