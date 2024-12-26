<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class BreakTypeController extends Controller
{
    public function getEmployeeDetails()
    {
        // Get the organization ID from the session
        $organizationId = session('user_id'); // Replace 'user_id' with the correct session key
    
        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        // Fetch employees associated with the logged-in organization
        $employees = DB::table('employees')
            ->leftJoin('time_tracking', 'employees.id', '=', 'time_tracking.employee_id')
            ->select(
                'employees.id',
                'employees.name',
                'employees.designation',
                'employees.joining_date',
                'employees.status',
                'employees.latitude',
                'employees.longitude',
                'employees.location',
                'employees.employment_type',
                'employees.break_duration',
                'time_tracking.self_paid_break',
                'time_tracking.break_subtracted',
                'time_tracking.paid_break',
                'time_tracking.paid_break_duration',
                'time_tracking.full_time',
                'time_tracking.part_time',
                'time_tracking.ad_hoc',
                'time_tracking.full_time_hours_per_month',
                'time_tracking.part_time_hours_per_week',
                'time_tracking.hourly_rate',
                'time_tracking.saturday_working',
                'time_tracking.ot1_3_rate',
                'time_tracking.daily_overtime_rate',
                'time_tracking.monthly_overtime_rate'

            )
            ->where('employees.organization_id', $organizationId) // Filter by organization_id
            ->get();
    
        return response()->json($employees, 200);
    }
    
}
