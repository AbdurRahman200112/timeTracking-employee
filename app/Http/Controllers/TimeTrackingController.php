<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response; // For CSV export
use Dompdf\Dompdf; // For PDF export
use Dompdf\Options;

class TimeTrackingController extends Controller
{
    public function index()
    {
        // Retrieve the organization_id from the session
        $organizationId = session('user_id'); // Ensure 'user_id' is correctly set in session
        
        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        // Fetch time tracking data along with employee and overtime rules
        $timeTrackingData = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->leftJoin('overtime_rules', 'employees.id', '=', 'overtime_rules.employee_id')
            ->where('employees.id', $organizationId) // Fetch only data for this session's user ID
            ->select(
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'employees.designation',
                'employees.break_duration',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.location',
                'overtime_rules.monthly_overtime_start',
                'overtime_rules.monthly_rate',
                'overtime_rules.weekly_overtime_start',
                'overtime_rules.weekly_rate',
                'overtime_rules.daily_start_time',
                'overtime_rules.daily_rate',
                'overtime_rules.early_start_time',
                'overtime_rules.early_start_rate',
                'overtime_rules.saturday_rate',
                'overtime_rules.saturday_is_working_day'
            )
            ->get();
    
        return response()->json($timeTrackingData, 200);
    }
    
    public function countByEmploymentType()
    {
        // Fetch the active organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with your actual session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Count employees by employment type for the logged-in organization
        $counts = DB::table('employees')
            ->select('employment_type', DB::raw('COUNT(*) as count'))
            ->where('organization_id', $organizationId) // Filter by organization_id
            ->groupBy('employment_type')
            ->get();

        return response()->json($counts, 200);
    }
    public function FullTime()
    {
        // Fetch the active organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with the correct session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch Full-Time time tracking data for the active organization
        $timeTrackingData = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id') // Join with employees table
            ->join('overtime_rules', 'time_tracking.employee_id', '=', 'overtime_rules.employee_id') // Join with overtime_rules table
            ->where('employees.organization_id', $organizationId) // Filter by organization_id
            ->where('employees.employment_type', 'Full-Time') // Filter for Full-Time employees
            ->select(
                // Employee fields
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',

                // Time tracking fields
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime',
                'time_tracking.break_duration',

                // Overtime rules fields
                'overtime_rules.monthly_overtime_start',
                'overtime_rules.monthly_rate',
                'overtime_rules.weekly_overtime_start',
                'overtime_rules.weekly_rate',
                'overtime_rules.daily_start_time',
                'overtime_rules.daily_rate',
                'overtime_rules.early_start_time',
                'overtime_rules.early_start_rate',
                'overtime_rules.saturday_rate',
                'overtime_rules.saturday_is_working_day'
            )
            ->get();

        return response()->json($timeTrackingData, 200);
    }

    // public function FullTime()
    // {
    //     // Fetch the active organization_id from the session
    //     $organizationId = session('user_id'); // Replace 'user_id' with the correct session key

    //     if (!$organizationId) {
    //         return response()->json(['message' => 'Unauthorized access.'], 403);
    //     }

    //     // Fetch Full-Time time tracking data for the active organization
    //     $timeTrackingData = DB::table('time_tracking')
    //         ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
    //         ->where('employees.organization_id', $organizationId) // Filter by organization_id
    //         ->where('employees.employment_type', 'Full-Time') // Filter for Full-Time employees
    //         ->select(
    //             'employees.id as employee_id',
    //             'employees.name as employee_name',
    //             'employees.email',
    //             'employees.employment_type',
    //             'time_tracking.entry_date',
    //             'time_tracking.start_time',
    //             'time_tracking.end_time',
    //             'time_tracking.working_hours',
    //             'time_tracking.overtime',
    //             'time_tracking.break_duration',
    //             // 'time_tracking.ot1_3_rate'
    //         )
    //         ->get();

    //     return response()->json($timeTrackingData, 200);
    // }

    public function PartTime()
    {
        // Fetch the active organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with the correct session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch Part-Time time tracking data for the active organization
        $timeTrackingData = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id') // Join with employees table
            ->join('overtime_rules', 'time_tracking.employee_id', '=', 'overtime_rules.employee_id') // Join with overtime_rules table
            ->where('employees.organization_id', $organizationId) // Filter by organization_id
            ->where('employees.employment_type', 'Part-Time') // Filter for Full-Time employees
            ->select(
                // Employee fields
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',

                // Time tracking fields
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime',
                'time_tracking.break_duration',

                // Overtime rules fields
                'overtime_rules.monthly_overtime_start',
                'overtime_rules.monthly_rate',
                'overtime_rules.weekly_overtime_start',
                'overtime_rules.weekly_rate',
                'overtime_rules.daily_start_time',
                'overtime_rules.daily_rate',
                'overtime_rules.early_start_time',
                'overtime_rules.early_start_rate',
                'overtime_rules.saturday_rate',
                'overtime_rules.saturday_is_working_day'
            )
            ->get();

        return response()->json($timeTrackingData, 200);
    }

    public function Adhoc()
    {
        // Fetch the active organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with the correct session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch Adhoc time tracking data for the active organization
        $timeTrackingData = DB::table('time_tracking')
        ->join('employees', 'time_tracking.employee_id', '=', 'employees.id') // Join with employees table
        ->join('overtime_rules', 'time_tracking.employee_id', '=', 'overtime_rules.employee_id') // Join with overtime_rules table
        ->where('employees.organization_id', $organizationId) // Filter by organization_id
        ->where('employees.employment_type', 'Adhoc') // Filter for Full-Time employees
        ->select(
            // Employee fields
            'employees.id as employee_id',
            'employees.name as employee_name',
            'employees.email',
            'employees.employment_type',
            
            // Time tracking fields
            'time_tracking.entry_date',
            'time_tracking.start_time',
            'time_tracking.end_time',
            'time_tracking.working_hours',
            'time_tracking.overtime',
            'time_tracking.break_duration',
            
            // Overtime rules fields
            'overtime_rules.monthly_overtime_start',
            'overtime_rules.monthly_rate',
            'overtime_rules.weekly_overtime_start',
            'overtime_rules.weekly_rate',
            'overtime_rules.daily_start_time',
            'overtime_rules.daily_rate',
            'overtime_rules.early_start_time',
            'overtime_rules.early_start_rate',
            'overtime_rules.saturday_rate',
            'overtime_rules.saturday_is_working_day'
        )
        ->get();

    return response()->json($timeTrackingData, 200);
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
    public function exportToCSV()
    {
        $organizationId = session('user_id'); // Replace with correct session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch employee data
        $employees = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->where('employees.organization_id', $organizationId)
            ->select(
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                // 'time_tracking.overtime'
            )
            ->get();

        // Create CSV headers
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=employees.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        // Add column names
        $columns = [
            'Employee Name',
            'Email',
            'Employment Type',
            'Entry Date',
            'Start Time',
            'End Time',
            'Working Hours',
            'Overtime'
        ];

        $callback = function () use ($employees, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($employees as $employee) {
                fputcsv($file, [
                    $employee->employee_name,
                    $employee->email,
                    $employee->employment_type,
                    $employee->entry_date,
                    $employee->start_time,
                    $employee->end_time,
                    $employee->working_hours,
                    $employee->overtime
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
    public function exportToPDF()
    {
        $organizationId = session('user_id'); // Replace with correct session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch employee data
        $employees = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->where('employees.organization_id', $organizationId)
            ->select(
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                // 'time_tracking.overtime'
            )
            ->get();

        // Prepare HTML for the PDF
        $html = '
            <h2>Employee Time Tracking Data</h2>
            <table border="1" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Email</th>
                        <th>Employment Type</th>
                        <th>Entry Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Working Hours</th>
                        <th>Overtime</th>
                    </tr>
                </thead>
                <tbody>';

        foreach ($employees as $employee) {
            $html .= '<tr>
                <td>' . $employee->employee_name . '</td>
                <td>' . $employee->email . '</td>
                <td>' . $employee->employment_type . '</td>
                <td>' . $employee->entry_date . '</td>
                <td>' . $employee->start_time . '</td>
                <td>' . $employee->end_time . '</td>
                <td>' . $employee->working_hours . '</td>
                <td>' . $employee->overtime . '</td>
            </tr>';
        }

        $html .= '
                </tbody>
            </table>';

        // Set up Dompdf
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        // Stream the PDF to the browser
        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="employees.pdf"');
    }
}
