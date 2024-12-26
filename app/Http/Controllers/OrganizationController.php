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
            Log::info('Organization registration process started.', [
                'organizationName' => $request->organizationName,
                'contactEmail' => $request->contact_email,
                'phoneNumber' => $request->phoneNumber,
            ]);

            $validator = Validator::make($request->all(), [
                'organizationName' => 'required|string',
                'contact_email' => 'required|email',
                'phoneNumber' => 'required|string',
                'companyAddress' => 'required|string',
                'password' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            DB::table('signed_up_organizations')->insert([
                'company_name' => $request->organizationName,
                'contact_email' => $request->contact_email,
                'contact_phone' => $request->phoneNumber,
                'company_address' => $request->companyAddress,
                'password' => Hash::make($request->password),
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
            Log::info('Login attempt started.', ['contactEmail' => $request->contact_email]);

            // Validate input
            if (empty($request->contact_email) || empty($request->password)) {
                return response()->json(['message' => 'Email and password are required.'], 400);
            }

            // Fetch user data from the database
            $user = DB::table('signed_up_organizations')
                ->where('contact_email', $request->contact_email)
                ->first();

            // Check if user exists and password matches
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid email or password.'], 401);
            }

            // Generate a verification code
            $verificationCode = random_int(100000, 999999);

            // Update the verification code in the database
            DB::table('signed_up_organizations')
                ->where('contact_email', $request->contact_email)
                ->update(['verification_code' => $verificationCode]);

            // Store the user's ID in the session
            session(['user_id' => $user->id]);

            // Send verification code to the user's email
            Mail::raw("Your verification code is: $verificationCode", function ($message) use ($request) {
                $message->to($request->contact_email)
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
            'contact_email' => 'required|email',
            'code' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = DB::table('signed_up_organizations')
            ->where('contact_email', $request->contact_email)
            ->first();

        if ($user && $user->verification_code == $request->code) {
            DB::table('signed_up_organizations')
                ->where('contact_email', $request->contact_email)
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
        $organization = DB::table('signed_up_organizations')
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
        // Fetch specific fields from the organization, including profile
        $organization = DB::table('signed_up_organizations')
            ->select('company_name', 'contact_email', 'contact_phone', 'monthly_plan', 'company_address', 'profile')
            ->where('id', $id)
            ->first();
    
        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }
    
        // Add full URL for profile image
        if ($organization->profile) {
            $organization->profile = asset('storage/uploads/' . $organization->profile);
        }
    
        return response()->json($organization, 200);
    }
    
    
    public function update(Request $request, $id)
    {
        // Log the start of the update method
        Log::info("Update method called for ID: $id");
    
        try {
            // Validate fields and file upload
            $validatedData = $request->validate([
                'company_name' => 'nullable|string|max:255',
                'contact_email' => 'nullable|email|max:255',
                'contact_phone' => 'nullable|string|max:20',
                'company_address' => 'nullable|string|max:255',
                'profile' => 'nullable|file|mimes:jpg,jpeg,png|max:2048', // Validate file type and size
            ]);
    
            // Log validated data
            Log::info("Validated data: ", $validatedData);
    
            // Check if organization exists
            $organization = DB::table('signed_up_organizations')->where('id', $id)->first();
            if (!$organization) {
                Log::error("Organization not found for ID: $id");
                return response()->json(['message' => 'Organization not found'], 404);
            }
    
            // Log organization details
            Log::info("Organization found: ", (array)$organization);
    
            // Handle file upload
            if ($request->hasFile('profile')) {
                Log::info("Profile file received: " . $request->file('profile')->getClientOriginalName());
    
                // Delete old profile image if exists
                if ($organization->profile) {
                    Storage::delete('public/uploads/' . $organization->profile);
                    Log::info("Old profile deleted: " . $organization->profile);
                }
    
                // Save new file
                $file = $request->file('profile');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/uploads', $fileName);
                Log::info("New profile saved as: " . $fileName);
    
                $validatedData['profile'] = $fileName;
            } else {
                Log::info("No profile file uploaded.");
            }
    
            // Update the database
            DB::table('signed_up_organizations')
                ->where('id', $id)
                ->update(array_merge($validatedData, ['updated_at' => now()]));
            Log::info("Database updated for ID: $id");
    
            // Fetch updated organization
            $updatedOrganization = DB::table('signed_up_organizations')
                ->select('company_name', 'contact_email', 'contact_phone', 'monthly_plan', 'company_address', 'profile')
                ->where('id', $id)
                ->first();
    
            Log::info("Updated organization: ", (array)$updatedOrganization);
    
            return response()->json([
                'message' => 'Organization updated successfully',
                'organization' => $updatedOrganization,
            ]);
        } catch (\Exception $e) {
            Log::error("Error in update method for ID: $id. Message: " . $e->getMessage());
            return response()->json(['message' => 'Error updating organization'], 500);
        }
    }
}
