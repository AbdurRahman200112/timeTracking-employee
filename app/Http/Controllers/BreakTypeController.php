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

            )
            ->where('employees.organization_id', $organizationId) // Filter by organization_id
            ->get();
    
        return response()->json($employees, 200);
    }
    
}
