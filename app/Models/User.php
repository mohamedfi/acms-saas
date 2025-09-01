<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'employee_id',
        'phone',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function coordinatedCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'coordinator_id');
    }

    public function trainedCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'trainer_id');
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    public function uploadedMaterials(): HasMany
    {
        return $this->hasMany(Material::class, 'uploaded_by');
    }

    public function flightBookings(): HasMany
    {
        return $this->hasMany(FlightBooking::class, 'traveler_user_id');
    }

    public function hotelBookings(): HasMany
    {
        return $this->hasMany(HotelBooking::class, 'guest_user_id');
    }

    public function visaApplications(): HasMany
    {
        return $this->hasMany(VisaApplication::class, 'traveler_user_id');
    }

    public function perDiems(): HasMany
    {
        return $this->hasMany(PerDiem::class);
    }

    public function outboundMessages(): HasMany
    {
        return $this->hasMany(OutboundMessage::class, 'to_user_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'uploaded_by');
    }

    public function hasRole(string $role): bool
    {
        return $this->role->name === $role;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isCoordinator(): bool
    {
        return $this->hasRole('coordinator');
    }

    public function isTrainer(): bool
    {
        return $this->hasRole('trainer');
    }

    public function isFinance(): bool
    {
        return $this->hasRole('finance');
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
