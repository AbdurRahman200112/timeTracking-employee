<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    public function index()
    {
        return view('app'); // Assuming your Blade file is named app.blade.php
    }
    public function profile()
    {
        return view('profile');
    }
}
