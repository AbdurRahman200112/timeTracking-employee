<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CreateRulesController extends Controller
{

    // Store rules for an employee (using name)
    public function storeRules(Request $request)
    {
        $validatedData = $request->validate([
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
            'overtime_rules.employement_type' => 'required|string|max:255',
        ]);
    
        $employmentType = $validatedData['overtime_rules']['employement_type'];
    
        // Apply conditions based on employment type
        switch ($employmentType) {
            case 'Full-Time':
                $this->validateFullTimeRules($validatedData['overtime_rules']);
                break;
    
            case 'Part-Time':
                $this->validatePartTimeRules($validatedData['overtime_rules']);
                break;
    
            case 'Adhoc':
                $this->validateAdhocRules($validatedData['overtime_rules']);
                break;
    
            default:
                return response()->json(['error' => 'Invalid employment type'], 400);
        }
    
        // Insert Break Rules
        foreach ($validatedData['break_rules'] as $breakRule) {
            DB::table('break_rules')->insert([
                'duration' => $breakRule['duration'],
                'subtract_from_total' => $breakRule['subtract_from_total'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    
        // Insert Overtime Rules
        DB::table('overtime_rules')->insert([
            'toggle_overtime' => $validatedData['overtime_rules']['toggle_overtime'],
            'monthly_rate' => $validatedData['overtime_rules']['monthly_rate'] ?? null,
            'weekly_rate' => $validatedData['overtime_rules']['weekly_rate'] ?? null,
            'daily_start_time' => $validatedData['overtime_rules']['daily_start_time'] ?? null,
            'daily_rate' => $validatedData['overtime_rules']['daily_rate'] ?? null,
            'early_start_time' => $validatedData['overtime_rules']['early_start_time'] ?? null,
            'early_start_rate' => $validatedData['overtime_rules']['early_start_rate'] ?? null,
            'saturday_rate' => $validatedData['overtime_rules']['saturday_rate'] ?? null,
            'saturday_is_working_day' => $validatedData['overtime_rules']['saturday_is_working_day'],
            'employement_type' => $employmentType,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    
        return response()->json(['message' => 'Rules created successfully for employee'], 201);
    }
    
    private function validateFullTimeRules($overtimeRules)
    {
        if (is_null($overtimeRules['monthly_rate'])) {
            throw ValidationException::withMessages(['monthly_rate' => 'Monthly rate is required for Full-Time workers.']);
        }
    }
    
    private function validatePartTimeRules($overtimeRules)
    {
        if (is_null($overtimeRules['weekly_rate'])) {
            throw ValidationException::withMessages(['weekly_rate' => 'Weekly rate is required for Part-Time workers.']);
        }
    }
    
    private function validateAdhocRules($overtimeRules)
    {
        if (is_null($overtimeRules['daily_rate'])) {
            throw ValidationException::withMessages(['daily_rate' => 'Daily rate is required for Adhoc workers.']);
        }
    }
    
    public function overTimeRules()
    {
        // Default total work hours per day (e.g., 8 hours/day)
        $defaultWorkHours = 8;
    
        // Fetch rules only where employement_type exists (not null or empty)
        $rules = DB::table('break_rules')
            ->join('overtime_rules', 'break_rules.id', '=', 'overtime_rules.id') // Join on primary and foreign key
            ->select(
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
                'overtime_rules.saturday_is_working_day',
                'overtime_rules.employement_type'
            )
            ->whereNotNull('overtime_rules.employement_type') // Ensure employement_type exists
            ->where('overtime_rules.employement_type', '!=', '') // Exclude empty strings
            ->get()
            ->map(function ($rule) use ($defaultWorkHours) {
                // Calculate total work hours
                $breakDurationInHours = isset($rule->break_duration) ? $rule->break_duration / 60 : 0;
                $totalWorkHours = $defaultWorkHours - ($rule->subtract_from_total ? $breakDurationInHours : 0);
    
                // Add totalWorkHours to the response
                $rule->total_work_hours = $totalWorkHours;
    
                return $rule;
            });
    
        return response()->json($rules, 200);
    }
    public function deleteRules($id)
    {
        // Check if records exist in both tables
        $breakRule = DB::table('break_rules')->where('id', $id)->exists();
        $overtimeRule = DB::table('overtime_rules')->where('id', $id)->exists();
    
        if (!$breakRule && !$overtimeRule) {
            return response()->json(['error' => 'No matching records found in both tables'], 404);
        }
    
        // Delete break rule if it exists
        if ($breakRule) {
            DB::table('break_rules')->where('id', $id)->delete();
        }
    
        // Delete overtime rule if it exists
        if ($overtimeRule) {
            DB::table('overtime_rules')->where('id', $id)->delete();
        }
    
        return response()->json(['message' => 'Record(s) deleted successfully'], 200);
    }


    public function updateRules(Request $request, $id)
{
    $validatedData = $request->validate([
        'break_duration' => 'nullable|integer',
        'subtract_from_total' => 'nullable|boolean',
        'toggle_overtime' => 'nullable|boolean',
        'monthly_rate' => 'nullable|numeric',
        'weekly_rate' => 'nullable|numeric',
        'daily_start_time' => 'nullable|date_format:H:i',
        'daily_rate' => 'nullable|numeric',
        'early_start_time' => 'nullable|date_format:H:i',
        'early_start_rate' => 'nullable|numeric',
        'saturday_rate' => 'nullable|numeric',
        'saturday_is_working_day' => 'nullable|boolean',
        'employement_type' => 'nullable|string|max:255',
    ]);

    $breakRule = DB::table('break_rules')->where('id', $id)->first();
    $overtimeRule = DB::table('overtime_rules')->where('id', $id)->first();

    if (!$breakRule && !$overtimeRule) {
        return response()->json(['error' => 'No matching records found'], 404);
    }

    if ($breakRule) {
        DB::table('break_rules')->where('id', $id)->update([
            'duration' => $validatedData['break_duration'] ?? $breakRule->duration,
            'subtract_from_total' => $validatedData['subtract_from_total'] ?? $breakRule->subtract_from_total,
            'updated_at' => now(),
        ]);
    }

    if ($overtimeRule) {
        DB::table('overtime_rules')->where('id', $id)->update([
            'toggle_overtime' => $validatedData['toggle_overtime'] ?? $overtimeRule->toggle_overtime,
            'monthly_rate' => $validatedData['monthly_rate'] ?? $overtimeRule->monthly_rate,
            'weekly_rate' => $validatedData['weekly_rate'] ?? $overtimeRule->weekly_rate,
            'daily_start_time' => $validatedData['daily_start_time'] ?? $overtimeRule->daily_start_time,
            'daily_rate' => $validatedData['daily_rate'] ?? $overtimeRule->daily_rate,
            'early_start_time' => $validatedData['early_start_time'] ?? $overtimeRule->early_start_time,
            'early_start_rate' => $validatedData['early_start_rate'] ?? $overtimeRule->early_start_rate,
            'saturday_rate' => $validatedData['saturday_rate'] ?? $overtimeRule->saturday_rate,
            'saturday_is_working_day' => $validatedData['saturday_is_working_day'] ?? $overtimeRule->saturday_is_working_day,
            'employement_type' => $validatedData['employement_type'] ?? $overtimeRule->employement_type,
            'updated_at' => now(),
        ]);
    }

    return response()->json(['message' => 'Records updated successfully'], 200);
}

    
}
