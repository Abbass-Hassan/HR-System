<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
<<<<<<< HEAD
use App\Http\Controllers\Training\CourseController;
use App\Http\Controllers\Training\EnrollmentController;
use App\Http\Controllers\Training\ModuleController;
use App\Http\Controllers\Training\AssessmentController;
use App\Http\Controllers\Training\CertificationController;
=======
use App\Http\Controllers\AttendanceController;
>>>>>>> de3618394c9dfc6668aeb403e2d94035b679ae2c

Route::group(["prefix" => "v0.1"], function(){
    //Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        //Admin Routes
        Route::group(["prefix" => "admin", "middleware" => "isAdmin"], function(){
            Route::get('/dashboard', [UserController::class, "getUsers"]);
            Route::get('/attendance', [AttendanceController::class, 'getEmployeeAttendance']);
        });

<<<<<<< HEAD
         //Training Routes
         Route::group(["prefix" => "training"], function(){
            // Course routes
            Route::get('/courses', [CourseController::class, 'index']);
            Route::get('/courses/search', [CourseController::class, 'search']);
            Route::get('/courses/{id}', [CourseController::class, 'show']);
            
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
        });
=======
        // Attendance routes (accessible to all authenticated users)
        Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut']);
        Route::get('/attendance/status', [AttendanceController::class, 'getStatus']);
>>>>>>> de3618394c9dfc6668aeb403e2d94035b679ae2c
    });

    //Unauthenticated routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);

<<<<<<< HEAD
         // Public training routes
         Route::get('/courses/featured', [CourseController::class, 'featured']);
         Route::get('/certifications/popular', [CertificationController::class, 'popular']);
=======
        Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
        Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
>>>>>>> de3618394c9dfc6668aeb403e2d94035b679ae2c
    });
});
