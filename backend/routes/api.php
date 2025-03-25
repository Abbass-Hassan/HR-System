<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\AttendanceController;

Route::group(["prefix" => "v0.1"], function(){
    //Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        //Admin Routes
        Route::group(["prefix" => "admin", "middleware" => "isAdmin"], function(){
            Route::get('/dashboard', [UserController::class, "getUsers"]);
        });
        
        // Attendance routes (accessible to all authenticated users)
        Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
        Route::get('/attendance/status', [AttendanceController::class, 'getStatus']);
    });

    //Unauthenticated routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);
    });
});