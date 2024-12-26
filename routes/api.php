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

// Route::post('/organizations', [OrganizationController::class, 'store']);
// Route::get('/organizations', [OrganizationController::class, 'index']);
// Route::get('/organizations/count', [OrganizationController::class, 'count']);
// Route::put('/organizations/{id}', [OrganizationController::class, 'update']);
Route::post('/signup-organization', [OrganizationController::class, 'register']);

Route::get('/admins', [AdminController::class, 'index']);
Route::post('/admins', [AdminController::class, 'store']);

// Route::post('/login', [OrganizationController::class, 'login']);
Route::post('/verify-code', [OrganizationController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/admins/{id}', [AdminController::class, 'show']);
Route::put('/admins/{id}', [AdminController::class, 'update']);
Route::get('/employeeShow/{id}', [EmployeeDetails::class, 'show']);

// Update employee details
Route::put('/approval/update-status/{id}', [ApprovalController::class, 'update']);
// Route::get('/showApproval/{id}', [ApprovalController::class, 'show']);
Route::delete('/employee/{id}', [TimeTrackingController::class, 'deleteEmployee']);

Route::get('/showApproval/{id}', [ApprovalController::class, 'show']);
// Route::put('/approval/update-status/{id}', [ApprovalController::class, 'updateStatus']);
Route::post('/approval/disapprove/{id}', [ApprovalController::class, 'disapprove']);

Route::get('/status-options', [ApprovalController::class, 'statusOptions']);

Route::put('/approval/updates/{id}', [ApprovalController::class, 'update']);


// Route::post('/add-employee', [EmployeeController::class, 'store']);
// Route::post('/add-employee/{userId?}', [OrganizationController::class, 'store']);

Route::get('/organization/{organizationId}/employees', [EmployeeController::class, 'getEmployeesByOrganization']);

Route::post('/approval/resubmit/{id}', [ApprovalController::class, 'updateStatusToResubmit']);

Route::get('/admins/{id}', [OrganizationController::class, 'show']);
Route::post('/admins/{id}', [OrganizationController::class, 'update']);
Route::middleware('web')->group(function () {
    Route::post('/login', [OrganizationController::class, 'login']);
    Route::get('/organization/data/{userId?}', [OrganizationController::class, 'getOrganizationData']);
    // Route::post('/add-employee/{userId?}', [OrganizationController::class, 'store']);
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

});
// Route::get('/worker-rules', [WorkerProfileController::class, 'getWorkerRules']);
// Route::post('/worker-rules', [WorkerProfileController::class, 'saveWorkerRules']);
// Route::put('/worker-rules/{id}', [WorkerProfileController::class, 'updateWorkerRules']);
// Route::delete('/worker-rules/{id}', [WorkerProfileController::class, 'deleteWorkerRules']);

Route::get('/employees/getAllEmployees', [WorkerProfileController::class, 'getAllEmployees']);
Route::get('/employees/overTimeRules', [WorkerProfileController::class, 'overTimeRules']);
Route::post('/organization/storeRules', [CreateRulesController::class, 'storeRules']);
Route::get('/organization/overTimeRules', [CreateRulesController::class, 'overTimeRules']);

// Store rules for an employee (by name)
Route::post('/employees/storeRules', [WorkerProfileController::class, 'storeRules']);
Route::get('/export/pdf', [TimeTrackingController::class, 'exportToPDF']);
Route::get('/export/csv', [TimeTrackingController::class, 'exportToCSV']);
Route::delete('/organization/rules/{id}', [CreateRulesController::class, 'deleteRules']);
Route::put('/organization/rules/{id}', [CreateRulesController::class, 'updateRules']);