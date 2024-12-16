<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

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

            if (
                empty($request->organizationName) ||
                empty($request->contact_email) ||
                empty($request->phoneNumber) ||
                empty($request->companyAddress) ||
                empty($request->password)
            ) {
                return response()->json(['message' => 'All fields are required.'], 400);
            }

            if (!filter_var($request->contact_email, FILTER_VALIDATE_EMAIL)) {
                return response()->json(['message' => 'Invalid email format.'], 400);
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

            if (empty($request->contact_email) || empty($request->password)) {
                return response()->json(['message' => 'Email and password are required.'], 400);
            }

            $user = DB::table('signed_up_organizations')
                ->where('contact_email', $request->contact_email)
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid email or password.'], 401);
            }

            $verificationCode = random_int(100000, 999999);
            DB::table('signed_up_organizations')
                ->where('contact_email', $request->contact_email)
                ->update(['verification_code' => $verificationCode]);

            // Send verification code via email
            Mail::raw("Your verification code is: $verificationCode", function ($message) use ($request) {
                $message->to($request->contact_email)
                    ->subject('Your Verification Code');
            });

            return response()->json([
                'message' => 'Verification code sent to your email.',
                'contact_email' => $request->contact_email,
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
}
