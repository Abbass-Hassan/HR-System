<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\User\UserController;

Route::group(["prefix" => "v0.1"], function(){
    // Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        // Admin Routes
        Route::group(["prefix" => "admin", "middleware" => "isAdmin"], function(){
            Route::get('/getusers/{count}/{page}/{id?}', [UserController::class, "getUsers"]);
            Route::delete('/deleteuser/{id}', [UserController::class, "deleteUser"]);
            Route::post('/addOrUpdateUser/{id?}', [UserController::class, "addOrUpdateUser"]);

        });

        // User Routes
        Route::group(["prefix" => "user"], function(){
            Route::get('/gettasks', [TaskController::class, "getTasks"]);
            Route::get('/viewfeedback/{taskId}', [TaskController::class, "viewFeedback"]);
            Route::post('/updatestatus/{taskId}', [TaskController::class, "updateStatus"]);

            // Manager Routes
            Route::group(["middleware" => "isManager"], function(){
                Route::post('/add_update_task/{id?}', [TaskController::class, "addOrUpdateTask"]);
                Route::delete('/delete_task/{id}', [TaskController::class, "deleteTask"]);
                Route::post('/add_feedback/{taskId}', [TaskController::class, "addFeedback"]);
                Route::get('/getusers/{count}/{page}/{id?}', [UserController::class, "getUsers"]);
            });
        });
    });

    // Unauthenticated routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);
    });
});
