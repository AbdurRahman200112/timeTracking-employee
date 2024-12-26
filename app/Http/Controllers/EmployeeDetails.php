<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeDetails extends Controller
{
    public function index()
    {
        try {
            // Get the active organization_id from the session
            $organizationId = session('user_id'); // Replace with actual session key storing organization ID
    
            if (!$organizationId) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }
    
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
                'employee_card',
                'break_type'
            )->where('organization_id', $organizationId)->get();
    
            return response()->json($employees, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching employees', 'error' => $e->getMessage()], 500);
        }
    }
    

    // public function show($id)
    // {
    //     // Fetch a single employee by ID
    //     $employee = DB::table('employees')->select(
    //         'id',
    //         'name',
    //         'designation',
    //         'contact',
    //         'email',
    //         'joining_date',
    //         'status',
    //         'location',
    //         'department',
    //         'employment_type',
    //         'cnic',
    //         'profile',
    //         'employee_card'
    //     )->where('id', $id)->first();

    //     if ($employee) {
    //         return response()->json($employee);
    //     } else {
    //         return response()->json(['message' => 'Employee not found'], 404);
    //     }
    // }
    public function show($id)
{
    // Fetch specific fields for the employee, including employee_card
    $employee = DB::table('employees')
        ->select(
            'name',
            'email',
            'contact',
            'location',
            'joining_date',
            'cnic',
            'designation',
            'department',
            'employment_type',
            'profile',
            'employee_card'
        )
        ->where('id', $id)
        ->first();

    if (!$employee) {
        return response()->json(['message' => 'Employee not found'], 404);
    }

    // Add full URL for profile and employee_card images
    if ($employee->profile) {
        $employee->profile = asset('storage/' . $employee->profile);
    }

    if ($employee->employee_card) {
        $employee->employee_card = asset('storage/' . $employee->employee_card);
    }

    return response()->json($employee, 200);
}


    public function update(Request $request, $id)
{
    // Fetch the existing data for the employee
    $employee = DB::table('employees')->where('id', $id)->first();

    if (!$employee) {
        return response()->json(['message' => 'Employee not found!'], 404);
    }

    // Prepare the updated data, keeping existing values for fields not in the request
    $updatedData = [
        'name' => $request->name ?? $employee->name,
        'email' => $request->email ?? $employee->email,
        'contact' => $request->contact ?? $employee->contact,
        'location' => $request->location ?? $employee->location,
        'joining_date' => $request->joining_date ?? $employee->joining_date,
        'cnic' => $request->cnic ?? $employee->cnic,
        'Designation' => $request->Designation ?? $employee->Designation,
        'department' => $request->department ?? $employee->department,
        'employment_type' => $request->employment_type ?? $employee->employment_type,
        'updated_at' => now(),
    ];

    // Update the 'employees' table directly using Query Builder
    DB::table('employees')
        ->where('id', $id)
        ->update($updatedData);

    return response()->json(['message' => 'Employee updated successfully!']);
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
