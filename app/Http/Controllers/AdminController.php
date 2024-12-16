<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        $admin = Admin::findOrFail($id);
        return response()->json($admin);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);
        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
            'designation' => $request->designation,
            'phone_no' => $request->phone_no,
            'address' => $request->address,
        ]);

        return response()->json($admin);
    }
}
