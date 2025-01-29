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
    
            $defaultProfilePicture = url('/uploads/profile_pictures/');
    
            // Fetch employees and join with overtime_rules
            $employees = DB::table('employees')
                ->select(
                    'employees.id',
                    'employees.name',
                    'employees.designation',
                    'employees.contact',
                    'employees.email',
                    'employees.joining_date',
                    'employees.location',
                    'employees.department',
                    'employees.employment_type',
                    'employees.cnic',
                    DB::raw("IFNULL(CONCAT('" . url('/') . "/', employees.profile), '$defaultProfilePicture') as profile"),
                    DB::raw("IFNULL(CONCAT('" . url('/') . "/', employees.employee_card), null) as employee_card"),
                    DB::raw("IFNULL(CONCAT('" . url('/') . "/', employees.additional_file), null) as additional_file"),
                    'employees.break_type',
                    'overtime_rules.monthly_rate',
                    'overtime_rules.daily_rate'
                )
                ->leftJoin('overtime_rules', 'employees.id', '=', 'overtime_rules.employee_id')
                ->where('organization_id', $organizationId)
                ->get();
    
            return response()->json($employees, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching employees', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function show($id)
{
    $employee = DB::table('employees')
        ->select(
            'name',
            'email',
            'contact',
            'location',
            'joining_date',
            'cnic',
            'Designation', // Uppercase 'Designation'
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

    // Generate URLs for images
    $employee->profile = $employee->profile
        ? asset($employee->profile)
        : url('/uploads/profile_pictures/default.png');

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


    public function downloadFile($employeeId)
    {
        try {
            $employee = DB::table('employees')
                ->select('additional_file')
                ->where('id', $employeeId)
                ->first();
    
            if (!$employee || !$employee->additional_file) {
                return response()->json(['message' => 'File not found.'], 404);
            }
    
            $filePath = public_path($employee->additional_file);
    
            if (!file_exists($filePath)) {
                return response()->json(['message' => 'File does not exist on the server.'], 404);
            }
    
            return response()->download($filePath, basename($filePath), [
                'Content-Type' => mime_content_type($filePath),
                'Content-Disposition' => 'attachment; filename="' . basename($filePath) . '"'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error downloading file', 'error' => $e->getMessage()], 500);
        }
    }
    


    public function destroy($id)
    {
        try {
            $employee = DB::table('employees')->where('id', $id)->first();

            if (!$employee) {
                return response()->json(['message' => 'Employee not found'], 404);
            }
            DB::beginTransaction();
            DB::table('time_tracking')->where('employee_id', $id)->delete();
            DB::table('overtime_rules')->where('employee_id', $id)->delete();
            DB::table('employees')->where('id', $id)->delete();
            DB::commit();

            return response()->json(['message' => 'Employee and related data deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error deleting employee', 'error' => $e->getMessage()], 500);
        }
    }
}
