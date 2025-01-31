<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TimeTrackingController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeDetails;
use App\Http\Controllers\BreakTypeController;
use App\Http\Controllers\WorkerProfileController;
use App\Http\Controllers\CreateRulesController;
use App\Models\Organization;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/signup-employees', [OrganizationController::class, 'register']);

// Route::get('/admins', [AdminController::class, 'index']);
// Route::post('/admins', [AdminController::class, 'store']);

// Route::post('/login', [OrganizationController::class, 'login']);
Route::post('/verify-code', [OrganizationController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Route::get('/admins/{id}', [AdminController::class, 'show']);
// Route::put('/admins/{id}', [AdminController::class, 'update']);
Route::get('/employeeShow/{id}', [EmployeeDetails::class, 'show']);

// Update employee details
Route::put('/approval/update-status/{id}', [ApprovalController::class, 'update']);
Route::delete('/employee/{id}', [TimeTrackingController::class, 'deleteEmployee']);

Route::get('/showApproval/{id}', [ApprovalController::class, 'show']);
Route::post('/approval/disapprove/{id}', [ApprovalController::class, 'disapprove']);

Route::get('/status-options', [ApprovalController::class, 'statusOptions']);

Route::put('/approval/updates/{id}', [ApprovalController::class, 'update']);

Route::get('/organization/{organizationId}/employees', [EmployeeController::class, 'getEmployeesByOrganization']);

Route::post('/approval/resubmit/{id}', [ApprovalController::class, 'updateStatusToResubmit']);
Route::delete('/employee/{id}', [EmployeeDetails::class, 'destroy']);
// POST to start the timer (insert row w/ start_time, lat, long, location)
Route::post('/time-tracking/start', [TrackingController::class, 'start']);

// POST to stop the timer (update row w/ end_time)
Route::post('/time-tracking/stop', [TrackingController::class, 'stop']);

Route::get('/admins/{id}', [OrganizationController::class, 'show']);
Route::put('/updateAdmin/{id}', [OrganizationController::class, 'update']);
Route::middleware('web')->group(function () {
    Route::post('/login', [OrganizationController::class, 'login']);
    Route::get('/organization/data/{userId?}', [OrganizationController::class, 'getOrganizationData']);
    Route::get('/employee-details', [EmployeeDetails::class, 'index']);
    Route::get('/time-tracking', [TimeTrackingController::class, 'index']);
    Route::get('/approval', [ApprovalController::class, 'index']);
    Route::get('/employees/locations', [EmployeeController::class, 'getEmployeesWithLocation']);
    Route::get('/full-time', [TimeTrackingController::class, 'FullTime']);
    Route::get('/part-time', [TimeTrackingController::class, 'PartTime']);
    Route::get('/adhoc', [TimeTrackingController::class, 'Adhoc']);
    Route::post('/add-employee', [EmployeeController::class, 'store'])->name('employee.store');
    Route::get('/employee-counts', [TimeTrackingController::class, 'countByEmploymentType']);
    Route::get('/time-trackings', [TimeTrackingController::class, 'index']);
    Route::get('/break-details', [BreakTypeController::class, 'getEmployeeDetails']);
    Route::get('/recent-employees', [EmployeeController::class, 'getRecentEmployees']);
    Route::put('/updateEmployee/{id}', [EmployeeDetails::class, 'update']);
    Route::post('/time-tracking/start', [TrackingController::class, 'start']);

// POST to stop the timer (update row w/ end_time)
Route::post('/time-tracking/stop', [TrackingController::class, 'stop']);

});

Route::get('/employees/getAllEmployees', [WorkerProfileController::class, 'getAllEmployees']);
Route::get('/employees/overTimeRules', [WorkerProfileController::class, 'overTimeRules']);
Route::post('/organization/storeRules', [CreateRulesController::class, 'storeRules']);
Route::get('/organization/overTimeRules', [CreateRulesController::class, 'overTimeRules']);
Route::post('/employees/storeRules', [WorkerProfileController::class, 'storeRules']);
Route::get('/export/pdf', [TimeTrackingController::class, 'exportToPDF']);
Route::get('/export/csv', [TimeTrackingController::class, 'exportToCSV']);
Route::delete('/organization/deleteRules/{id}', [CreateRulesController::class, 'deleteRules']);
Route::get('/organization/getRules/{id}', [CreateRulesController::class, 'getRule']);
Route::put('/organization/updateRule/{id}', [CreateRulesController::class, 'updateRule']);
Route::get('/employees/getRule/{id}', [WorkerProfileController::class, 'getRule']);
Route::put('/employees/updateRule/{id}', [WorkerProfileController::class, 'updateRule']);
Route::delete('/employees/deleteRule/{id}', [WorkerProfileController::class, 'deleteRule']);
Route::get('/employees/{id}/download', [EmployeeDetails::class, 'downloadFile']);
