<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Support\Facades\Hash;
// use Laravel\Sanctum\HasApiTokens;

// class Admin extends Authenticatable
// {
//     use HasApiTokens, HasFactory;

//     protected $table = 'admins';

//     protected $fillable = [
//         'name',
//         'email',
//         'password',
//         'designation',
//         'phone_no',
//         'address',
//         'verification_code',
//     ];

//     protected $hidden = [
//         'password',
//         'remember_token',
//     ];

//     protected $casts = [
//         'email_verified_at' => 'datetime',
//     ];

//     public function setPasswordAttribute($value)
//     {
//         $this->attributes['password'] = Hash::make($value);
//     }
// }

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'admins';

    protected $fillable = [
        'name',
        'email',
        'password',
        'designation',
        'phone_no',
        'address',
        'verification_code',
        'password_reset_token',            // Added reset_token field
        'password_reset_token_expires_at',     // Added reset_token_expiry field
    ];

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
