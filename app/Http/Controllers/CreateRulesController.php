<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateRulesController extends Controller
{
    // Store new rules
    public function storeRules(Request $request)
    {
        try {
            // Log the incoming request
            Log::info('Incoming request data:', $request->all());

            // Insert data into oraganization_rules table
            DB::table('oraganization_rules')->insert([
                'toggle_overtime' => $request->input('toggle_overtime', false),
                'break_duration' => $request->input('break_duration'),
                'monthly_rate' => $request->input('monthly_rate'),
                'weekly_rate' => $request->input('weekly_rate'),
                'monthly_overtime_start' => $request->input('monthly_overtime_start'),
                'weekly_overtime_start' => $request->input('weekly_overtime_start'),
                'daily_start_time' => $request->input('daily_start_time'),
                'daily_rate' => $request->input('daily_rate'),
                'early_start_time' => $request->input('early_start_time'),
                'early_start_rate' => $request->input('early_start_rate'),
                'saturday_rate' => $request->input('saturday_rate'),
                'saturday_is_working_day' => $request->input('saturday_is_working_day', false),
                'employement_type' => $request->input('employement_type'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Log success
            Log::info('Rule inserted successfully.');

            return response()->json(['message' => 'Rule created successfully'], 201);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error while storing rule:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'An error occurred while creating the rule.'], 500);
        }
    }

    // Fetch all rules
    public function overTimeRules()
    {
        $defaultWorkHours = 8;

        $rules = DB::table('oraganization_rules')
            ->select(
                'id',
                'toggle_overtime',
                'break_duration',
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
                'employement_type'
            )
            ->get()
            ->map(function ($rule) use ($defaultWorkHours) {
                // Calculate total work hours
                $breakDurationInHours = $rule->break_duration ? $rule->break_duration / 60 : 0;
                $rule->total_work_hours = $defaultWorkHours - $breakDurationInHours;

                return $rule;
            });

        return response()->json($rules, 200);
    }

    // Fetch a specific rule by ID
    public function getRule($id)
    {
        $rule = DB::table('oraganization_rules')->where('id', $id)->first();

        if (!$rule) {
            return response()->json(['error' => 'No matching record found'], 404);
        }

        return response()->json($rule, 200);
    }

    // Update a rule by ID
    public function updateRule(Request $request, $id)
    {
        try {
            // Fetch the existing record
            $rule = DB::table('oraganization_rules')->where('id', $id)->first();

            if (!$rule) {
                return response()->json(['error' => 'No matching record found'], 404);
            }

            // Prepare data for update
            $updateData = array_filter([
                'toggle_overtime' => $request->input('toggle_overtime'),
                'break_duration' => $request->input('break_duration'),
                'monthly_rate' => $request->input('monthly_rate'),
                'weekly_rate' => $request->input('weekly_rate'),
                'monthly_overtime_start' => $request->input('monthly_overtime_start'),
                'weekly_overtime_start' => $request->input('weekly_overtime_start'),
                'daily_start_time' => $request->input('daily_start_time'),
                'daily_rate' => $request->input('daily_rate'),
                'early_start_time' => $request->input('early_start_time'),
                'early_start_rate' => $request->input('early_start_rate'),
                'saturday_rate' => $request->input('saturday_rate'),
                'saturday_is_working_day' => $request->input('saturday_is_working_day'),
                'employement_type' => $request->input('employement_type'),
                'updated_at' => now(),
            ], function ($value) {
                return !is_null($value);
            });

            // Update the record
            DB::table('oraganization_rules')->where('id', $id)->update($updateData);

            return response()->json(['message' => 'Rule updated successfully'], 200);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error while updating rule:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'An error occurred while updating the rule.'], 500);
        }
    }

    // Delete a rule by ID
    public function deleteRules($id)
    {
        try {
            // Check if the record exists
            $ruleExists = DB::table('oraganization_rules')->where('id', $id)->exists();

            if (!$ruleExists) {
                Log::warning("No matching record found for ID: {$id}");
                return response()->json(['error' => 'No matching record found'], 404);
            }

            // Delete the record
            DB::table('oraganization_rules')->where('id', $id)->delete();

            Log::info("Deleted rule with ID: {$id}");

            return response()->json(['message' => 'Rule deleted successfully'], 200);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error while deleting rule:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'An error occurred while deleting the rule.'], 500);
        }
    }
}
