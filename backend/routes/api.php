<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentApprovalController;
use Illuminate\Support\Facades\Storage;

Route::group(["prefix" => "v0.1"], function(){
    //Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        //Admin Routes (HR only)
        Route::group(["prefix" => "admin", "middleware" => "isAdmin"], function(){
            Route::get('/dashboard', [UserController::class, "getUsers"]);
            Route::get('/attendance', [AttendanceController::class, 'getEmployeeAttendance']);
            
            // Document approval routes for HR
            Route::get('/documents', [DocumentApprovalController::class, 'index']);
            Route::get('/documents/statistics', [DocumentApprovalController::class, 'statistics']);
            Route::post('/documents/{id}/approve', [DocumentApprovalController::class, 'approve']);
            Route::post('/documents/{id}/reject', [DocumentApprovalController::class, 'reject']);

            Route::delete('/documents/{id}', [DocumentApprovalController::class, 'destroy']);
        });

        // Attendance routes (accessible to all authenticated users)
        Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
        Route::get('/attendance/status', [AttendanceController::class, 'getStatus']);
        
        // Document routes for all authenticated users
        Route::get('/documents', [DocumentController::class, 'index']);
        Route::post('/documents', [DocumentController::class, 'store']);
        Route::get('/documents/{id}', [DocumentController::class, 'show']);
        Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    });

    //Unauthenticated routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);

        Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
        Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
    });
});