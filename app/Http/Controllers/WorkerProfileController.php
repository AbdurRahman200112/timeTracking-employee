<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkerProfileController extends Controller
{
    // Get all employees (for dropdown)
    public function getAllEmployees()
    {
        $employees = DB::table('employees')->select('name')->get();
        return response()->json($employees, 200);
    }

    // Store rules for an employee (using name)
    public function storeRules(Request $request)
    {
        $validatedData = $request->validate([
            'employee_name' => 'required|exists:employees,name',
            'break_rules' => 'required|array',
            'break_rules.*.duration' => 'required|integer',
            'break_rules.*.subtract_from_total' => 'required|boolean',
            'overtime_rules' => 'required|array',
            'overtime_rules.toggle_overtime' => 'required|boolean',
            'overtime_rules.monthly_rate' => 'nullable|numeric',
            'overtime_rules.weekly_rate' => 'nullable|numeric',
            'overtime_rules.daily_start_time' => 'nullable|date_format:H:i',
            'overtime_rules.daily_rate' => 'nullable|numeric',
            'overtime_rules.early_start_time' => 'nullable|date_format:H:i',
            'overtime_rules.early_start_rate' => 'nullable|numeric',
            'overtime_rules.saturday_rate' => 'nullable|numeric',
            'overtime_rules.saturday_is_working_day' => 'required|boolean',
        ]);

        // Insert Break Rules with employee name
        foreach ($validatedData['break_rules'] as $breakRule) {
            DB::table('break_rules')->insert([
                'employee_name' => $validatedData['employee_name'],
                // 'type' => $breakRule['type'],
                'duration' => $breakRule['duration'],
                'subtract_from_total' => $breakRule['subtract_from_total'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert Overtime Rules with employee name
        DB::table('overtime_rules')->insert([
            'employee_name' => $validatedData['employee_name'],
            'toggle_overtime' => $validatedData['overtime_rules']['toggle_overtime'],
            'monthly_rate' => $validatedData['overtime_rules']['monthly_rate'],
            'weekly_rate' => $validatedData['overtime_rules']['weekly_rate'],
            'daily_start_time' => $validatedData['overtime_rules']['daily_start_time'],
            'daily_rate' => $validatedData['overtime_rules']['daily_rate'],
            'early_start_time' => $validatedData['overtime_rules']['early_start_time'],
            'early_start_rate' => $validatedData['overtime_rules']['early_start_rate'],
            'saturday_rate' => $validatedData['overtime_rules']['saturday_rate'],
            'saturday_is_working_day' => $validatedData['overtime_rules']['saturday_is_working_day'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Rules created successfully for employee'], 201);
    }
    public function overTimeRules()
    {
        // Default total work hours per day (e.g., 8 hours/day)
        $defaultWorkHours = 8;

        // Fetch employees with associated rules
        $employees = DB::table('employees')
            ->leftJoin('break_rules', 'employees.name', '=', 'break_rules.employee_name')
            ->leftJoin('overtime_rules', 'employees.name', '=', 'overtime_rules.employee_name')
            ->select(
                'employees.name as employee_name',
                'employees.break_type as break_type',
                'break_rules.duration as break_duration',
                'break_rules.subtract_from_total',
                'overtime_rules.toggle_overtime',
                'overtime_rules.monthly_rate',
                'overtime_rules.weekly_rate',
                'overtime_rules.daily_start_time',
                'overtime_rules.daily_rate',
                'overtime_rules.early_start_time',
                'overtime_rules.early_start_rate',
                'overtime_rules.saturday_rate',
                'overtime_rules.saturday_is_working_day'
            )
            ->get()
            ->map(function ($employee) use ($defaultWorkHours) {
                // Calculate total work hours
                $breakDurationInHours = isset($employee->break_duration) ? $employee->break_duration / 60 : 0;
                $totalWorkHours = $defaultWorkHours - ($employee->subtract_from_total ? $breakDurationInHours : 0);

                // Add totalWorkHours to the response
                $employee->total_work_hours = $totalWorkHours;

                return $employee;
            });

        return response()->json($employees, 200);
    }
}
