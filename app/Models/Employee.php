<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'name',
        'email',
        'employment_type',
    ];

    public function timeTrackings()
    {
        return $this->hasMany(TimeTracking::class);
    }
}
