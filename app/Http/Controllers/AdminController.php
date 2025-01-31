<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        return Admin::all();
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        // Create the admin
        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'designation' => $request->designation,
            'phone_no' => $request->phone_no,
            'address' => $request->address,
            'verification_code' => $request->verification_code, // Optional, can be generated if needed
        ]);

        return response()->json($admin, 201);
    }
    public function show($id)
    {
        // Get a single record from the 'admins' table using Query Builder
        $admin = DB::table('employees')
            ->where('id', $id)
            ->first();

        // If you want to emulate "findOrFail", you can manually handle the case where $admin is null
        if (!$admin) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($admin);
    }

    public function update(Request $request, $id)
    {
        // Update the record
        DB::table('employees')
            ->where('id', $id)
            ->update([
                'name'        => $request->input('name'),
                'email'       => $request->input('email'),
                'contact'    => $request->input('contact'),
            ]);

        // Return the updated record (or you can just return a success message)
        $updatedAdmin = DB::table('admins')
            ->where('id', $id)
            ->first();

        return response()->json($updatedAdmin);
    }
}
