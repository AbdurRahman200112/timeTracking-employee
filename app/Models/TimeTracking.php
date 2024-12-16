<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTracking extends Model
{
    use HasFactory;

    protected $table = 'time_tracking';

    protected $fillable = [
        'employee_id',
        'entry_date',
        'start_time',
        'end_time',
        'working_hours',
        'overtime',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
