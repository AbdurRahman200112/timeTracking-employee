<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class OrganizationController extends Controller
{
    /**
     * Handle organization signup.
     */
    public function register(Request $request)
    {
        try {
            Log::info('Employee registration process started.', [
                'name' => $request->name,
                'email' => $request->email,
                'contact' => $request->contact,
            ]);
    
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email',
                'contact' => 'required|string',
                'password' => 'required|string|min:8',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }
    
            DB::table('employees')->insert([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'organization_id' => 6 ,
                'verification_code' => random_int(100000, 999999),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    
            return response()->json(['message' => 'Organization registered successfully!'], 201);
        } catch (\Exception $e) {
            Log::error('Error registering organization.', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error registering organization.'], 500);
        }
    }
    

    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        try {
            Log::info('Login attempt started.', ['email' => $request->email]);

            // Validate input
            if (empty($request->email) || empty($request->password)) {
                return response()->json(['message' => 'Email and password are required.'], 400);
            }

            // Fetch user data from the database
            $user = DB::table('employees')
                ->where('email', $request->email)
                ->first();

            // Check if user exists and password matches
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid email or password.'], 401);
            }

            // Generate a verification code
            $verificationCode = random_int(100000, 999999);

            // Update the verification code in the database
            DB::table('employees')
                ->where('email', $request->email)
                ->update(['verification_code' => $verificationCode]);

            // Store the user's ID in the session
            session(['user_id' => $user->id]);

            // Send verification code to the user's email
            Mail::raw("Your verification code is: $verificationCode", function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Your Verification Code');
            });

            // Return success response with user_id
            return response()->json([
                'message' => 'Login successful. Verification code sent to your email.',
                'user_id' => $user->id, // Include user_id in the response
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error during login.', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'An error occurred during login.'], 500);
        }
    }


    /**
     * Verify OTP code.
     */
    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = DB::table('employees')
            ->where('email', $request->email)
            ->first();

        if ($user && $user->verification_code == $request->code) {
            DB::table('employees')
                ->where('email', $request->email)
                ->update(['verification_code' => null]);

            return response()->json(['message' => 'Code verified successfully.'], 200);
        }

        return response()->json(['message' => 'Invalid verification code.'], 401);
    }

    /**
     * Get employees for the logged-in organization.
     */
    public function getOrganizationData($userId = null)
    {
        // If $userId is not provided, try to fetch it from the session
        if (!$userId) {
            $userId = session('user_id');
        }

        // Check if the user ID is available
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch the organization based on the user ID
        $organization = DB::table('employees')
            ->where('id', $userId)
            ->first();

        // If no organization is found, return an error
        if (!$organization) {
            return response()->json(['message' => 'Organization not found.'], 404);
        }
        if ($organization->profile) {
            $organization->profile = asset('storage/uploads/' . $organization->profile);
        }
    

        // Return the organization data as JSON
        return response()->json($organization, 200);
    }

    

    public function show($id)
    {
        // Fetch specific fields from the employee table
        $employee = DB::table('employees')
            ->select('name', 'email', 'contact', 'profile')
            ->where('id', $id)
            ->first();
    
        // If the employee is not found, return a 404 error
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
    
        // Check if a profile image exists; otherwise, use a default image
        if (!empty($employee->profile)) {
            $employee->profile = asset('public/uploads' . $employee->profile);
        } else {
            $employee->profile = asset('storage/uploads/default.png'); // Ensure this file exists
        }
    
        return response()->json($employee, 200);
    }
    
    public function update(Request $request, $id)
    {
        Log::info("Update method called for ID: $id");
    
        try {
            // Validate input data
            $validatedData = $request->validate([
                'name'    => 'nullable|string|max:255',
                'email'   => 'nullable|email|max:255',
                'contact' => 'nullable|string|max:20',
                'profile' => 'nullable|file|mimes:jpg,jpeg,png|max:2048', // Validate image type & size
            ]);
    
            // Fetch existing employee record
            $employee = DB::table('employees')->where('id', $id)->first();
            if (!$employee) {
                Log::error("Employee not found for ID: $id");
                return response()->json(['message' => 'Employee not found'], 404);
            }
    
            Log::info("Employee found: ", (array) $employee);
    
            // Handle profile image upload if present
            if ($request->hasFile('profile')) {
                Log::info("New profile image uploaded: " . $request->file('profile')->getClientOriginalName());
    
                // Delete old image if it exists and is not the default
                if (!empty($employee->profile) && Storage::exists('uploads/' . $employee->profile)) {
                    Storage::delete('uploads/' . $employee->profile);
                    Log::info("Old profile image deleted: " . $employee->profile);
                }
    
                // Store new image
                $file = $request->file('profile');
                $fileName = time() . '_' . $file->getClientOriginalName();
                
                // Store file in 'storage/app/public/uploads' so it can be accessed via storage link
                $file->storeAs('public/uploads', $fileName);
    
                Log::info("New profile image saved as: " . $fileName);
    
                // Save only the relative path in the database
                $validatedData['profile'] = 'uploads/' . $fileName;
            }
    
            // Perform the update
            DB::table('employees')
                ->where('id', $id)
                ->update(array_merge($validatedData, ['updated_at' => now()]));
    
            Log::info("Database updated for ID: $id");
    
            // Fetch updated record
            $updatedEmployee = DB::table('employees')
                ->select('id', 'name', 'email', 'contact', 'profile')
                ->where('id', $id)
                ->first();
    
            // Convert 'profile' field to full URL if it exists
            if (!empty($updatedEmployee->profile)) {
                $updatedEmployee->profile = asset('storage/' . $updatedEmployee->profile);
            }
    
            return response()->json([
                'message' => 'Profile updated successfully',
                'employee' => $updatedEmployee,
            ]);
        } catch (\Exception $e) {
            Log::error("Error in update method for ID: $id. Message: " . $e->getMessage());
            return response()->json(['message' => 'Error updating profile'], 500);
        }
    }
}