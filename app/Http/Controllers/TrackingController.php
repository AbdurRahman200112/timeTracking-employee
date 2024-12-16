<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrackingController extends Controller
{
    public function index(Request $request)
    {
        // Fetch employees with optional employment type filtering
        $query = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->select(
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime'
            );

        if ($request->has('employment_type')) {
            $query->where('employees.employment_type', $request->employment_type);
        }

        $timeTrackingData = $query->get();

        return response()->json($timeTrackingData);
    }

    public function countByEmploymentType()
    {
        // Count employees by employment type
        $counts = DB::table('employees')
            ->select('employment_type', DB::raw('COUNT(*) as count'))
            ->groupBy('employment_type')
            ->get();

        return response()->json($counts);
    }
}
