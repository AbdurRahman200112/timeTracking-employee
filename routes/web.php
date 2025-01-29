<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('app');
// });

// Route::get('/dashboard/home', function () {
//     return view('app');
// });

// Route::get('/dashboard/AddEmployee', function () {
//     return view('add.emoloyee');
// });

Route::get('/{any}', function () {
    return view('app'); // Ensure 'app.blade.php' is configured to load your React app
})->where('any', '.*');

Route::get('/auth/reset-password', function () {
    return view('auth.reset-password');
});

