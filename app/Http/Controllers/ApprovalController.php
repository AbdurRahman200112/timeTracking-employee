<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        // Fetch the active organization_id from the session
        $organizationId = session('user_id'); // Replace 'user_id' with the correct session key
    
        if (!$organizationId) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        // Build the query to fetch time tracking data
        $query = DB::table('time_tracking')
            ->join('employees', 'time_tracking.employee_id', '=', 'employees.id')
            ->where('time_tracking.organization_id', $organizationId) // Filter by organization_id
            ->select(
                'employees.id as employee_id',
                'employees.name as employee_name',
                'employees.email',
                'employees.employment_type',
                'time_tracking.entry_date',
                'time_tracking.start_time',
                'time_tracking.end_time',
                'time_tracking.working_hours',
                'time_tracking.overtime',
                'employees.status'
            );
    
        // Apply employment_type filter if provided
        if ($request->has('employment_type')) {
            $query->where('employees.employment_type', $request->employment_type);
        }
    
        // Execute the query and fetch results
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
                'employees.status'
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
            // Update the status in the employees table
            DB::table('employees')
                ->where('id', $id)
                ->update([
                    'status' => $request->status,
                ]);
    
            // Update the comment in the time_tracking table
            DB::table('time_tracking')
                ->where('employee_id', $id) // Assuming `employee_id` is the foreign key in `time_tracking`
                ->update([
                    'comments' => $request->comment,
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
            'status' => 'required|string|in:Approve,Disapprove,Resubmit for Approval', // Allow specific statuses
        ]);
    
        try {
            // Update only the status in the employees table
            DB::table('employees')
                ->where('id', $id)
                ->update(['status' => $request->status]);
    
            return response()->json(['message' => 'Status updated successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update status.'], 500);
        }
    }

    public function updateStatusToResubmit($id)
    {
        $updated = DB::table('employees')
            ->where('id', $id)
            ->update(['status' => 'Resubmit']);
    
        if ($updated) {
            return response()->json(["message" => "Status updated to Resubmit for Approval"]);
        }
        return response()->json(["message" => "Entry not found or update failed"], 404);
    }
}
