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

Route::post('/login', [OrganizationController::class, 'login']);
Route::post('/verify-code', [OrganizationController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/admins/{id}', [AdminController::class, 'show']);
Route::put('/admins/{id}', [AdminController::class, 'update']);
Route::get('/time-trackings', [TimeTrackingController::class, 'index']);
Route::get('/employee-counts', [TimeTrackingController::class, 'countByEmploymentType']);
Route::get('/full-time', [TimeTrackingController::class, 'FullTime']);
Route::get('/part-time', [TimeTrackingController::class, 'PartTime']);
Route::get('/adhoc', [TimeTrackingController::class, 'Adhoc']);
Route::get('/employeeShow/{id}', [EmployeeDetails::class, 'show']);

// Update employee details
Route::put('/employee/{id}', [EmployeeDetails::class, 'update']);
Route::get('/time-tracking', [TrackingController::class, 'index']);
Route::get('/approval', [ApprovalController::class, 'index']);
// Route::post('/approval/update-status', [ApprovalController::class, 'updateStatus']);
// Route::get('/showApproval/{id}', [ApprovalController::class, 'show']);

Route::get('/showApproval/{id}', [ApprovalController::class, 'show']);
// Route::put('/approval/update-status/{id}', [ApprovalController::class, 'updateStatus']);
Route::post('/approval/disapprove/{id}', [ApprovalController::class, 'disapprove']);

Route::get('/status-options', [ApprovalController::class, 'statusOptions']);
Route::get('/employees/locations', [EmployeeController::class, 'getEmployeesWithLocation']);

Route::get('/employee-details', [EmployeeDetails::class, 'index']);

Route::put('/approval/updates/{id}', [ApprovalController::class, 'update']);


Route::post('/add-employee', [EmployeeController::class, 'store']);
Route::get('/organization/{organizationId}/employees', [EmployeeController::class, 'getEmployeesByOrganization']);
