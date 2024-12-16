<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeDetails extends Controller
{
    public function index()
    {
        // Fetch all employees
        $employees = DB::table('employees')->select(
            'id',
            'name',
            'designation',
            'contact',
            'email',
            'joining_date',
            'status',
            'location',
            'department',
            'employment_type',
            'cnic',
            'profile',
            'employee_card'
        )->get();

        return response()->json($employees);
    }

    public function show($id)
    {
        // Fetch a single employee by ID
        $employee = DB::table('employees')->select(
            'id',
            'name',
            'designation',
            'contact',
            'email',
            'joining_date',
            'status',
            'location',
            'department',
            'employment_type',
            'cnic',
            'profile',
            'employee_card'
        )->where('id', $id)->first();

        if ($employee) {
            return response()->json($employee);
        } else {
            return response()->json(['message' => 'Employee not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        // Fetch the employee to ensure it exists
        $employee = DB::table('employees')->where('id', $id)->first();
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
    
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact' => 'required|string|max:15',
            'location' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'employment_type' => 'nullable|string|in:Full-Time,Part-Time,Adhoc',
            'cnic' => 'nullable|string|max:20',
            'status' => 'nullable|string|in:Approve,Pending',
            'profile' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'employee_card' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        // Handle file uploads
        if ($request->hasFile('profile')) {
            $profilePath = $request->file('profile')->store('profiles', 'public');
            $validated['profile'] = $profilePath;
        }
    
        if ($request->hasFile('employee_card')) {
            $employeeCardPath = $request->file('employee_card')->store('employee_cards', 'public');
            $validated['employee_card'] = $employeeCardPath;
        }
    
        // Update the employee
        try {
            DB::table('employees')->where('id', $id)->update($validated);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating employee', 'error' => $e->getMessage()], 500);
        }
    
        return response()->json(['message' => 'Employee updated successfully']);
    }
    
    public function destroy($id)
    {
        // Delete employee by ID
        $employee = DB::table('employees')->where('id', $id)->first();

        if ($employee) {
            DB::table('employees')->where('id', $id)->delete();
            return response()->json(['message' => 'Employee deleted successfully', 'employee' => $employee]);
        } else {
            return response()->json(['message' => 'Employee not found'], 404);
        }
    }
}
