<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        $employeeId = session('user_id'); // Assuming 'user_id' in the session refers to the employee ID
        
        if (!$employeeId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        $query = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->where('time_tracking.employee_id', $employeeId)  // Filter by the employee ID from the session
            ->select(
                'employees.id as employee_id',
                'employees.email',
                'employees.employment_type',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime',
                'time_tracking.status'
            );
    
        if ($request->has('employment_type')) {
            $query->where('employees.employment_type', $request->employment_type);
        }
    
        $timeTrackingData = $query->get();
    
        return response()->json($timeTrackingData, 200);
    }
    
    public function show($id)
    {
        $employee = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->select(
                'employees.id as employee_id',
                'employees.name as employee_name',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.description',
                'time_tracking.comments',
                'time_tracking.status'
            )
            ->where('employees.id', $id)
            ->first();

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        return response()->json($employee);
    }

    public function disapprove(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Disapprove',
            'comment' => 'required|string|max:255',
        ]);
    
        DB::beginTransaction();
    
        try {
            // Update status and comments in time_tracking
            DB::table('time_tracking')
                ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
                ->where('employees.id', $id)
                ->update([
                    'time_tracking.status' => $request->status,
                    'time_tracking.comments' => $request->comment,
                ]);
    
            DB::commit();
    
            return response()->json(['message' => 'Status and comment updated successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update status and comment.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Approve,Disapprove,Resubmit for Approval',
        ]);
    
        try {
            // Update status in time_tracking
            DB::table('time_tracking')
                ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
                ->where('employees.id', $id)
                ->update(['time_tracking.status' => $request->status]);
    
            return response()->json(['message' => 'Status updated successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update status.'], 500);
        }
    }

    public function updateStatusToResubmit($id)
    {
        try {
            // Update status to 'Resubmit' in time_tracking
            DB::table('time_tracking')
                ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
                ->where('employees.id', $id)
                ->update(['time_tracking.status' => 'Resubmit']);
    
            return response()->json(["message" => "Status updated to Resubmit for Approval"]);
        } catch (\Exception $e) {
            return response()->json(["message" => "Entry not found or update failed"], 404);
        }
    }
}
