<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Common\AuthController;

Route::get('/',[AuthController::class,"getQuestions"]);
