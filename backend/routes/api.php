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
            Route::get('/attendance', [AttendanceController::class, 'getEmployeeAttendance']);
        });

        // Attendance routes (accessible to all authenticated users)
        Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
        Route::get('/attendance/status', [AttendanceController::class, 'getStatus']);

        //Employee
        Route::post('/employee/editprofile/{change_password?}', [UserController::class, "employeeEditProfile"]);
        Route::get("/profile", [UserController::class,"userProfile"]);
        Route::post('/employee/editprofileimage', [UserController::class, "updateProfileImage"]);

    });

    //Unauthenticated routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);

        Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
        Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
    });
});
