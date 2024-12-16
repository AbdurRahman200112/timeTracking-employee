<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Organization extends Authenticatable
{
    use HasFactory;

    use HasApiTokens, HasFactory;
    protected $table = 'signed_up_organizations';

    // Attributes that can be mass assigned
    protected $fillable = [
        'date_signed_up',
        'company_name',
        'contact_email',
        'password',
        'contact_phone',
        'monthly_plan',
        'manager_name',
        'manager_phone',
        'website',
        'address',
        'address2',
        'state',
        'city',
        'country',
        'zip_code',
        'verification_code',
        'password_reset_token',
        'password_reset_token_expires_at',
    ];

    // Attribute casting
    protected $hidden = [
        'password',
        'remember_token',
        'reset_token',            // Hide reset_token from API responses
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'reset_token_expiry' => 'datetime', // Cast reset_token_expiry to a Carbon instance
    ];

    /**
     * Automatically hash the password when setting it.
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * Check if the reset token is valid.
     *
     * @return bool
     */
    public function isResetTokenValid()
    {
        return $this->reset_token && $this->reset_token_expiry && $this->reset_token_expiry->isFuture();
    }
}
