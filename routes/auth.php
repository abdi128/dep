<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    /*Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);*/

    Route::get('patient/login', [AuthenticatedSessionController::class, 'createPatient'])->name('patient.login');
    Route::post('patient/login', [AuthenticatedSessionController::class, 'storePatient'])->name('patient.login.store');

    Route::get('doctor/login', [AuthenticatedSessionController::class, 'createDoctor'])->name('doctor.login');
    Route::post('doctor/login', [AuthenticatedSessionController::class, 'storeDoctor'])->name('doctor.login.store');

    Route::get('labtechnician/login', [AuthenticatedSessionController::class, 'createLabTechnician'])->name('labtechnician.login');
    Route::post('labtechnician/login', [AuthenticatedSessionController::class, 'storeLabTechnician'])->name('labtechnician.login.store');

    Route::get('admin/login', [AuthenticatedSessionController::class, 'createAdmin'])->name('admin.login');
    Route::post('admin/login', [AuthenticatedSessionController::class, 'storeAdmin'])->name('admin.login.store');

    // Optionally, a generic login page
    // Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    // Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');


    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth.custom')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});




// Registration Routes (Guest Middleware)
Route::middleware('guest')->group(function () {
    Route::get('admin/register', [RegisteredUserController::class, 'createAdmin'])->name('admin.register');
    Route::post('admin/register', [RegisteredUserController::class, 'storeAdmin'])->name('admin.store.register');

    Route::get('patient/register', [RegisteredUserController::class, 'createPatient'])->name('patient.register');
    Route::post('patient/register', [RegisteredUserController::class, 'storePatient'])->name('patient.store.register');

    //Route::get('doctor/register', [RegisteredUserController::class, 'createDoctor'])->name('doctor.register');
    //Route::post('doctor/register', [RegisteredUserController::class, 'storeDoctor'])->name('doctor.store.register');

    //Route::get('labtechnician/register', [RegisteredUserController::class, 'createLabTechnician'])->name('labtechnician.register');
    //Route::post('labtechnician/register', [RegisteredUserController::class, 'storeLabTechnician'])->name('labtechnician.store.register');

    // Add your login routes similarly here or separately
});
