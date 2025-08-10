<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TypeController;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [userController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [UserController::class, 'user'])->middleware('auth:sanctum');

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);

Route::get('/types', [TypeController::class, 'index']);
Route::post('/types', [TypeController::class, 'store']);