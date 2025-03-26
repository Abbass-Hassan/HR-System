<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Training\CourseController;
use App\Http\Controllers\Training\EnrollmentController;
use App\Http\Controllers\Training\ModuleController;
use App\Http\Controllers\Training\AssessmentController;
use App\Http\Controllers\Training\CertificationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentApprovalController;
use App\Http\Controllers\SupportController;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\SlackController;
use App\Http\Controllers\API\EmployeeLeaveController;
use App\Http\Controllers\API\HRLeaveController;


Route::group(["prefix" => "v0.1"], function(){
    // Support Chatbot Route - Available without authentication
    Route::post('/support', [SupportController::class, 'getResponse']);
    
    // Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        // Admin Routes (HR only)
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

         //Training Routes
         Route::group(["prefix" => "training"], function(){
            // Course routes
            Route::get('/courses', [CourseController::class, 'index']);
            Route::get('/courses/search', [CourseController::class, 'search']);
            Route::get('/courses/{id}', [CourseController::class, 'show']);
            Route::get('/courses/available', [CourseController::class, 'available']);
            Route::get('/courses/featured', [CourseController::class, 'featured']);

            // Enrollment routes
            Route::get('/enrollments', [EnrollmentController::class, 'index']);
            Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
            Route::post('/courses/{id}/enroll', [EnrollmentController::class, 'enroll']);

            // Module routes
            Route::get('/modules/{id}', [ModuleController::class, 'show']);
            Route::post('/modules/{id}/complete', [ModuleController::class, 'markComplete']);
            Route::post('/modules/{id}/access', [ModuleController::class, 'trackAccess']);

            // Assessment routes
            Route::get('/assessments/{id}', [AssessmentController::class, 'show']);
            Route::post('/assessments/{id}/submit', [AssessmentController::class, 'submit']);
            Route::get('/assessments/{id}/result', [AssessmentController::class, 'result']);

            // Certification routes
            Route::get('/certifications', [CertificationController::class, 'index']);
            Route::get('/certifications/{id}', [CertificationController::class, 'show']);
            Route::get('/certifications/available', [CertificationController::class, 'availableCertifications']);
            Route::get('/certifications/popular', [CertificationController::class, 'getPopularCertifications']);
        });
                    // Employee Leave Routes
           Route::group(['prefix' => 'leave', 'middleware' => 'auth:api'], function() {
                Route::get('/', [EmployeeLeaveController::class, 'index']);
                Route::get('/statistics', [EmployeeLeaveController::class, 'statistics']);
                Route::get('/{id}', [EmployeeLeaveController::class, 'show']);
                Route::post('/', [EmployeeLeaveController::class, 'store']);
                Route::post('/{id}/cancel', [EmployeeLeaveController::class, 'cancel']);
});

            // HR Leave Management Routes
            Route::group(['prefix' => 'admin/leave', 'middleware' => ['auth:api', 'isAdmin']], function() {
                Route::get('/', [HRLeaveController::class, 'index']);
                Route::get('/pending', [HRLeaveController::class, 'pending']);
                Route::get('/statistics', [HRLeaveController::class, 'statistics']);
                Route::get('/{id}', [HRLeaveController::class, 'show']);
                Route::post('/{id}/approve', [HRLeaveController::class, 'approve']);
                Route::post('/{id}/reject', [HRLeaveController::class, 'reject']);
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

        //Employee
        Route::post('/employee/editprofile/{change_password?}', [UserController::class, "employeeEditProfile"]);
        Route::get("/profile", [UserController::class,"userProfile"]);
        Route::post('/employee/editprofileimage', [UserController::class, "updateProfileImage"]);

    });

    // Unauthenticated routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);

         // Public training routes
         Route::get('/courses/featured', [CourseController::class, 'featured']);
         Route::get('/certifications/popular', [CertificationController::class, 'popular']);
         
        Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
        Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});
