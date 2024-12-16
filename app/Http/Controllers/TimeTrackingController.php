<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeTrackingController extends Controller
{
    public function index()
    {
        // Fetch time tracking data with employee details
        $timeTrackingData = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->select(
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'employees.designation',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime'
            )
            ->get();

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
    public function FullTime()
    {
        // Fetch time tracking data with employee details
        $timeTrackingData = DB::table('time_tracking')
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
            )
            ->where('employees.employment_type', 'Full-Time') // Add condition for Full-Time employment type
            ->get();

        return response()->json($timeTrackingData);
    }
    public function PartTime()
    {
        // Fetch time tracking data with employee details
        $timeTrackingData = DB::table('time_tracking')
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
            )
            ->where('employees.employment_type', 'Part-Time') // Add condition for Full-Time employment type
            ->get();

        return response()->json($timeTrackingData);
    }
    public function Adhoc()
    {
        // Fetch time tracking data with employee details
        $timeTrackingData = DB::table('time_tracking')
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
            )
            ->where('employees.employment_type', 'Adhoc') // Add condition for Full-Time employment type
            ->get();

        return response()->json($timeTrackingData);
    }
    public function deleteEmployee($id)
    {
        try {
            // Delete employee from the employees table
            DB::table('employees')->where('id', $id)->delete();

            // Delete associated time tracking records
            DB::table('time_tracking')->where('id', $id)->delete();

            return response()->json(['message' => 'Employee deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting employee.'], 500);
        }
    }
}
