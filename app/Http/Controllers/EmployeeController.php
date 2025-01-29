<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function getEmployeesWithLocation()
    {
        // Fetch the active organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with the correct session key

        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch employees associated with the logged-in organization
        $employees = Employee::select('id', 'name', 'latitude', 'longitude', 'location')
            ->where('organization_id', $organizationId) // Filter by organization_id
            ->whereNotNull('latitude') // Exclude null latitudes
            ->whereNotNull('longitude') // Exclude null longitudes
            ->whereNotNull('location') // Exclude null locations
            ->where('location', '!=', '') // Exclude empty string locations
            ->get();

        return response()->json($employees, 200);
    }


    public function store(Request $request)
    {
        // Get organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with your session key
    
        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        // Validate the request
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
            'break_type' => 'required|string|in:Self Paid,Paid by Organization',
            'break_duration' => 'nullable|integer|min:1|max:120',
            'additional_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'additional_expiry_date' => 'nullable|date',
            'additional_description' => 'nullable|string|max:1000',
        ]);
    
        try {
            // Handle file uploads manually
            $profilePicturePath = null;
            $employeeCardPath = null;
            $additionalFilePath = null;
    
            if ($request->hasFile('profile')) {
                $profilePicture = $request->file('profile');
                $profilePicturePath = 'uploads/profile_pictures/' . uniqid() . '.' . $profilePicture->getClientOriginalExtension();
                $profilePicture->move(public_path('uploads/profile_pictures'), $profilePicturePath);
            }
    
            if ($request->hasFile('employee_card')) {
                $employeeCard = $request->file('employee_card');
                $employeeCardPath = 'uploads/employee_cards/' . uniqid() . '.' . $employeeCard->getClientOriginalExtension();
                $employeeCard->move(public_path('uploads/employee_cards'), $employeeCardPath);
            }
    
            if ($request->hasFile('additional_file')) {
                $additionalFile = $request->file('additional_file');
                $additionalFilePath = 'uploads/additional_files/' . uniqid() . '.' . $additionalFile->getClientOriginalExtension();
                $additionalFile->move(public_path('uploads/additional_files'), $additionalFilePath);
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
                'profile' => $profilePicturePath,
                'employee_card' => $employeeCardPath,
                'break_type' => $validatedData['break_type'],
                'break_duration' => $validatedData['break_duration'] ?? null,
                'additional_file' => $additionalFilePath,
                'additional_expiry_date' => $validatedData['additional_expiry_date'] ?? null,
                'additional_description' => $validatedData['additional_description'] ?? null,
                'organization_id' => $organizationId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    
            return response()->json(['message' => 'Employee added successfully'], 201);
    
        } catch (\Exception $e) {
            \Log::error('File upload or database operation failed: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while processing the request.'], 500);
        }
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
    public function getRecentEmployees()
    {
        try {
            // Fetch the active organization_id from the session
            $organizationId = session('user_id'); // Replace 'user_id' with the correct session key

            if (!$organizationId) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }

            // Calculate the date for one week ago
            $oneWeekAgo = now()->subWeek();

            // Fetch employees created in the last week
            $recentEmployees = DB::table('employees')
                ->where('organization_id', $organizationId)
                ->where('created_at', '>=', $oneWeekAgo)
                ->select('id', 'name', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($recentEmployees, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching recent employees.', 'error' => $e->getMessage()], 500);
        }
    }
}
