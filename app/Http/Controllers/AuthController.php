<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Mail\VerificationCodeMail;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle organization login and send a verification code.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact_email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $organization = Organization::where('contact_email', $request->contact_email)->first();

        if ($organization && Hash::check($request->password, $organization->password)) {
            $verificationCode = random_int(100000, 999999); // Generate 6-digit code
            Log::info("Verification Code for {$organization->contact_email}: {$verificationCode}");

            $organization->verification_code = $verificationCode;
            $organization->save();

            Mail::to($organization->contact_email)->send(new VerificationCodeMail($verificationCode));

            return response()->json(['message' => 'Verification code sent to your email'], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    /**
     * Verify the verification code.
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

        $organization = Organization::where('contact_email', $request->contact_email)->first();

        if ($organization && $organization->verification_code == $request->code) {
            $token = $organization->createToken('authToken')->plainTextToken;

            $organization->verification_code = null; // Clear verification code
            $organization->save();

            return response()->json([
                'message' => 'Code verified successfully',
                'token' => $token
            ], 200);
        }

        return response()->json(['message' => 'Invalid verification code'], 401);
    }

    /**
     * Handle forgot password functionality.
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact_email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $organization = Organization::where('contact_email', $request->contact_email)->first();

        if (!$organization) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $token = bin2hex(random_bytes(30)); // Generate a strong random token
        $organization->password_reset_token = $token;
        $organization->password_reset_token_expires_at = now()->addHour();
        $organization->save();

        $resetLink = url("/auth/reset-password?token={$token}");
        Mail::to($organization->contact_email)->send(new ResetPasswordMail($resetLink));

        return response()->json(['message' => 'Reset link sent to your email'], 200);
    }

    /**
     * Reset the password using the provided token.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $organization = Organization::where('password_reset_token', $request->token)
            ->where('password_reset_token_expires_at', '>', now())
            ->first();

        if (!$organization) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $organization->password = Hash::make($request->password);
        $organization->password_reset_token = null;
        $organization->password_reset_token_expires_at = null;
        $organization->save();

        return response()->json(['message' => 'Password reset successfully'], 200);
    }
}
