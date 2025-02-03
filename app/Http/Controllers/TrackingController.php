<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import the Log facade
use Illuminate\Support\Facades\Validator;

class TrackingController extends Controller
{
    public function index(Request $request)
    {
        // Fetch employees with optional employment type filtering
        $query = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->select(
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'time_tracking.entry_date',
                'time_tracking.break_duration',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime'
            );

        if ($request->has('employment_type')) {
            $query->where('employees.employment_type', $request->employment_type);
        }

        $timeTrackingData = $query->get();

        return response()->json($timeTrackingData);
    }

    public function countByEmploymentType()
    {
        // Count employees by employment type
        $counts = DB::table('employees')
            ->select('employment_type', DB::raw('COUNT(*) as count'))
            ->groupBy('employment_type')
            ->get();

        return response()->json($counts);
    }
    // public function store(Request $request)
    // {
    //     // Retrieve the organization_id from the session
    //     $employee_id = session('user_id'); // Ensure 'user_id' is correctly set in session
        
    //     if (!$employee_id) {
    //         return response()->json(['message' => 'Unauthorized access.'], 403);
    //     }
    //     $validated = $request->validate([
    //         'start_time' => 'required|date_format:H:i:s', 
    //         'latitude'   => 'required|numeric',
    //         'longitude'  => 'required|numeric',
    //         'location'   => 'nullable|string',
    //     ]);

    //     // Insert into the database
    //     DB::table('time_tracking')->insert([
    //         'entry_date' => now()->format('Y-m-d'),
    //         'start_time' => $validated['start_time'],
    //         'latitude'   => $validated['latitude'],
    //         'longitude'  => $validated['longitude'],
    //         'location'   => $validated['location'],
    //         'created_at' => now(),
    //         'updated_at' => now(),
    //     ]);

    //     return response()->json(['message' => 'Timer started successfully!'], 201);
    // }
    public function start(Request $request)
    {
        // Retrieve employee_id from the session
        $employee_id = session('user_id'); // Make sure 'user_id' is set during login
        if (!$employee_id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Validate required fields from the client
        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i:s',
            'latitude'   => 'required|numeric',
            'longitude'  => 'required|numeric',
            'location'   => 'nullable|string',
        ]);

        // Insert into time_tracking
        DB::table('time_tracking')->insert([
            'employee_id'     => $employee_id,
            'organization_id' => 6, // Hard-coded or retrieved from session if needed
            'entry_date'      => now()->format('Y-m-d'),
            'start_time'      => $validated['start_time'],
            'latitude'        => $validated['latitude'],
            'longitude'       => $validated['longitude'],
            'location'        => $validated['location'],
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);

        return response()->json(['message' => 'Timer started successfully'], 201);
    }

    /**
     * POST: Stop the timer.
     */

     public function stop(Request $request)
     {
         // Log the request input
         Log::info('Received stop timer request', $request->all());
     
         // Retrieve employee_id from session
         $employee_id = session('user_id');
         if (!$employee_id) {
             Log::warning('Unauthorized access: No user_id in session.');
             return response()->json(['message' => 'Unauthorized access.'], 403);
         }
     
         try {
             // Insert into time_tracking
             $inserted = DB::table('time_tracking')->insert([
                 'employee_id'     => $employee_id,
                 'organization_id' => 6, // Hardcoded for now
                 'entry_date'      => now()->format('Y-m-d'),
                 'start_time'      => $request->input('start_time'),
                 'end_time'        => $request->input('end_time'),
                 'latitude'        => $request->input('latitude'),
                 'longitude'       => $request->input('longitude'),
                 'location'        => $request->input('location'),
                 // New column for break duration:
                 'break_duration'  => $request->input('break_duration'), // e.g. "00:00:05"
                 'created_at'      => now(),
                 'updated_at'      => now(),
             ]);
     
             if ($inserted) {
                 Log::info('Timer data saved successfully', ['employee_id' => $employee_id]);
                 return response()->json(['message' => 'Timer stopped and data saved successfully'], 200);
             } else {
                 Log::error('Database insert failed');
                 return response()->json(['message' => 'Failed to save timer data.'], 500);
             }
         } catch (\Exception $e) {
             Log::error('Exception occurred while inserting data', ['error' => $e->getMessage()]);
             return response()->json(['message' => 'An error occurred while saving data.'], 500);
         }
     }
     public function getLatestLocation()
    {
        // Get the employee ID from the session
        $employeeId = session('user_id');

        if (!$employeeId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Fetch the latest location entry for the employee
        $latestLocation = DB::table('time_tracking')
            ->where('employee_id', $employeeId)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$latestLocation) {
            return response()->json(['message' => 'No location data found.'], 404);
        }

        return response()->json([
            'latitude' => $latestLocation->latitude,
            'longitude' => $latestLocation->longitude,
            'location' => $latestLocation->location,
        ]);
    }
}