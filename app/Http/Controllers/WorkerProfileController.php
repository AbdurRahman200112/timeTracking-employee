<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkerProfileController extends Controller
{
    // Get all employees (for dropdown)
    public function getAllEmployees()
    {
        $employees = DB::table('employees')->select('id', 'name')->get();
        return response()->json($employees, 200);
    }

    // Store rules for an employee (using employee ID)
    public function storeRules(Request $request)
    {
        $validatedData = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'break_rules' => 'required|array',
            'break_rules.*.duration' => 'required|integer',
            'break_rules.*.subtract_from_total' => 'required|boolean',
            'overtime_rules' => 'required|array',
            'overtime_rules.toggle_overtime' => 'required|boolean',
            'overtime_rules.monthly_overtime_start' => 'nullable|numeric',
            'overtime_rules.weekly_overtime_start' => 'nullable|numeric',
            'overtime_rules.monthly_rate' => 'nullable|numeric',
            'overtime_rules.weekly_rate' => 'nullable|numeric',
            'overtime_rules.daily_start_time' => 'nullable|date_format:H:i',
            'overtime_rules.daily_rate' => 'nullable|numeric',
            'overtime_rules.early_start_time' => 'nullable|date_format:H:i',
            'overtime_rules.early_start_rate' => 'nullable|numeric',
            'overtime_rules.saturday_rate' => 'nullable|numeric',
            'overtime_rules.saturday_is_working_day' => 'required|boolean',
        ]);

        // Insert Break Rules with employee ID
        foreach ($validatedData['break_rules'] as $breakRule) {
            DB::table('break_rules')->insert([
                'employee_id' => $validatedData['employee_id'],
                'duration' => $breakRule['duration'],
                'subtract_from_total' => $breakRule['subtract_from_total'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert Overtime Rules with employee ID
        DB::table('overtime_rules')->insert([
            'employee_id' => $validatedData['employee_id'],

            'toggle_overtime' => $validatedData['overtime_rules']['toggle_overtime'],
            'monthly_overtime_start' => $validatedData['overtime_rules']['monthly_overtime_start'] ?? null,
            'weekly_overtime_start' => $validatedData['overtime_rules']['weekly_overtime_start'] ?? null,
            'monthly_rate' => $validatedData['overtime_rules']['monthly_rate'] ?? null,
            'weekly_rate' => $validatedData['overtime_rules']['weekly_rate'] ?? null,
            'daily_start_time' => $validatedData['overtime_rules']['daily_start_time'] ?? null,
            'daily_rate' => $validatedData['overtime_rules']['daily_rate'] ?? null,
            'early_start_time' => $validatedData['overtime_rules']['early_start_time'] ?? null,
            'early_start_rate' => $validatedData['overtime_rules']['early_start_rate'] ?? null,
            'saturday_rate' => $validatedData['overtime_rules']['saturday_rate'] ?? null,
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
            ->leftJoin('break_rules', 'employees.id', '=', 'break_rules.employee_id')
            ->leftJoin('overtime_rules', 'employees.id', '=', 'overtime_rules.employee_id')
            ->select(
                'employees.id as id',
                'employees.name as employee_name',
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
                $breakDurationInHours = isset($employee->break_duration) ? $employee->break_duration / 60 : 0;
                $totalWorkHours = $defaultWorkHours - ($employee->subtract_from_total ? $breakDurationInHours : 0);
                $employee->total_work_hours = $totalWorkHours;
                return $employee;
            });

        return response()->json($employees, 200);
    }

    public function getRule($id)
    {
        $overtimeRule = DB::table('overtime_rules')->where('employee_id', $id)->first();
        if (!$overtimeRule) {
            Log::error("Overtime rule not found for Employee ID: $id");
            return response()->json(['error' => 'No matching records found'], 404);
        }

        // Fetch employee data
        $employee = DB::table('employees')->where('id', $id)->first();
        if (!$employee) {
            Log::error("Employee not found for ID: $id");
            return response()->json(['error' => 'No employee records found'], 404);
        }

        // Fetch break rules
        $breakRule = DB::table('break_rules')->where('employee_id', $id)->first();
        Log::info("Break Rule", ['breakRule' => $breakRule]);

        $rule = [
            'employee_id' => $id,
            'employee_name' => $employee->name ?? null,
            'break_duration' => $breakRule->duration ?? null,
            'subtract_from_total' => $breakRule->subtract_from_total ?? null,
            'toggle_overtime' => $overtimeRule->toggle_overtime,
            'monthly_overtime_start' => $overtimeRule->monthly_overtime_start,
            'weekly_overtime_start' => $overtimeRule->weekly_overtime_start,
            'monthly_rate' => $overtimeRule->monthly_rate,
            'weekly_rate' => $overtimeRule->weekly_rate,
            'daily_start_time' => $overtimeRule->daily_start_time,
            'daily_rate' => $overtimeRule->daily_rate,
            'early_start_time' => $overtimeRule->early_start_time,
            'early_start_rate' => $overtimeRule->early_start_rate,
            'saturday_rate' => $overtimeRule->saturday_rate,
            'saturday_is_working_day' => $overtimeRule->saturday_is_working_day,
        ];

        return response()->json($rule, 200);
    }

    public function updateRule(Request $request, $id)
    {
        // Log the incoming request payload
        Log::info('Update Payload:', $request->all());

        // Find the overtime rule for the given ID
        $overtimeRule = DB::table('overtime_rules')->where('id', $id)->first();
        if (!$overtimeRule) {
            return response()->json(['error' => 'No matching records found'], 404);
        }

        // Update break rules (if provided in the request)
        if ($request->hasAny(['break_duration', 'subtract_from_total'])) {
            DB::table('break_rules')
                ->where('employee_id', $overtimeRule->employee_id)
                ->update([
                    'duration' => $request->input('break_duration', DB::raw('duration')),
                    'subtract_from_total' => $request->input('subtract_from_total', DB::raw('subtract_from_total')),
                    'updated_at' => now(),
                ]);
        }

        // Filter the request data to include only the fields we need
        $allowedFields = [
            'toggle_overtime',
            'monthly_overtime_start',
            'weekly_overtime_start',
            'monthly_rate',
            'weekly_rate',
            'daily_start_time',
            'daily_rate',
            'early_start_time',
            'early_start_rate',
            'saturday_rate',
            'saturday_is_working_day',
        ];

        $updateData = $request->only($allowedFields);
        $updateData['updated_at'] = now();

        // Update the overtime rule
        DB::table('overtime_rules')
            ->where('employee_id', $id)
            ->update($updateData);

        return response()->json(['message' => 'Rules updated successfully'], 200);
    }

    public function deleteRule($id)
    {
        try {
            $overtimeRule = DB::table('overtime_rules')->where('id', $id)->first();
            if (!$overtimeRule) {
                Log::error("Delete Rule: No matching record found", ['id' => $id]);
                return response()->json(['error' => 'No matching record found'], 404);
            }

            $employee = DB::table('employees')->where('id', $overtimeRule->employee_id)->first();

            $breakRuleDeleted = DB::table('break_rules')->where('employee_id', $overtimeRule->employee_id)->delete();
            Log::info("Break rule deleted", ['employee_id' => $overtimeRule->employee_id, 'status' => $breakRuleDeleted]);

            $overtimeRuleDeleted = DB::table('overtime_rules')->where('id', $id)->delete();
            Log::info("Overtime rule deleted", ['id' => $id, 'status' => $overtimeRuleDeleted]);

            return response()->json(['message' => 'Rules deleted successfully', 'employee_name' => $employee->name ?? ''], 200);
        } catch (\Exception $e) {
            Log::error("Delete Rule Error", [
                'id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An error occurred while deleting the rule'], 500);
        }
    }
}
