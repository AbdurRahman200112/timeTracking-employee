<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function getEmployeesWithLocation()
    {
        return response()->json(Employee::select('id', 'name', 'latitude', 'longitude', 'location')->get());
    }

    // public function store(Request $request)
    // {
    //     // Validate only the dynamic fields
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //         'employment_type' => 'required|string|max:255',
    //         'contact' => 'required|string|max:15',
    //         'location' => 'nullable|string|max:255',
    //         'dob' => 'nullable|date',
    //         'cnic' => 'nullable|string|max:20',
    //         'designation' => 'nullable|string|max:255',
    //         'department' => 'nullable|string|max:255',
    //     ]);

    //     // Insert employee data into the database
    //     DB::table('employees')->insert([
    //         'name' => $validatedData['name'],
    //         'email' => $validatedData['email'],
    //         'employment_type' => $validatedData['employment_type'],
    //         'contact' => $validatedData['contact'],
    //         'location' => $validatedData['location'] ?? null,
    //         'dob' => $validatedData['dob'] ?? null,
    //         'cnic' => $validatedData['cnic'] ?? null,
    //         'designation' => $validatedData['designation'] ?? null,
    //         'department' => $validatedData['department'] ?? null,
    //         'created_at' => now(),
    //         'updated_at' => now(),
    //     ]);

    //     return response()->json(['message' => 'Employee added successfully'], 201);
    // }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'employment_type' => 'required|string|max:255',
            'contact' => 'required|string|max:15',
            'location' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'cnic' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'profile' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'employee_card' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Handle file uploads
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $request->file('profile_picture')->store('uploads', 'public');
        }

        $employeeCardPath = null;
        if ($request->hasFile('employee_card')) {
            $employeeCardPath = $request->file('employee_card')->store('uploads', 'public');
        }

        // Insert employee data into the database
        DB::table('employees')->insert([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'employment_type' => $validatedData['employment_type'],
            'contact' => $validatedData['contact'],
            'location' => $validatedData['location'] ?? null,
            'joining_date' => $validatedData['joining_date'] ?? null,
            'cnic' => $validatedData['cnic'] ?? null,
            'designation' => $validatedData['designation'] ?? null,
            'department' => $validatedData['department'] ?? null,
            'profile' => $profilePicturePath, // Store the profile picture path
            'employee_card' => $employeeCardPath, // Store the employee card path
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Employee added successfully'], 201);
    }

    public function getEmployeesByOrganization($organizationId)
    {
        try {
            // Fetch employees by organization ID
            $employees = DB::table('signed_up_organizations')
                ->where('id', $organizationId)
                ->select('company_name', 'contact_email', 'contact_phone')
                ->get();

            if ($employees->isEmpty()) {
                return response()->json(['message' => 'No employees found for this organization.'], 404);
            }

            return response()->json($employees, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching employees.', 'error' => $e->getMessage()], 500);
        }
    }
}
