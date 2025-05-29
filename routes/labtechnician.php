<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\LabTechnicianController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;


// sidebar routes for labtechnician

Route::prefix('labtechnician')->middleware(['role:labtechnician', 'auth.custom', 'verified'])->group(function () {

    Route::get('patients', [LabTechnicianController::class, 'labtechnicianPatientsIndex'])
        ->name('labtechnician.patients');

    Route::get('doctors', [LabTechnicianController::class, 'labtechnicianDoctorsIndex'])
        ->name('labtechnician.doctors');

    Route::get('dashboard', [LabTechnicianController::class, 'labtechnicianDashboardIndex'])
        ->name('labtechnician.dashboard');

});



// routes for labtechnician Laboratory

Route::prefix('labtechnician')->middleware(['auth.custom', 'role:labtechnician', 'verified'])->group(function () {

    Route::get('laboratory', [LabTechnicianController::class, 'labtechnicianLaboratoryIndex'])->name('labtechnician.laboratory.index');
    Route::put('laboratory/{labTest}/update', [LabTechnicianController::class, 'labtechnicianLaboratoryUpdate'])->name('labtechnician.laboratory.update');
    Route::post('laboratory/{labTest}/cancel', [LabTechnicianController::class, 'labtechnicianLaboratoryCancel'])->name('labtechnician.laboratory.cancel');
});


// labtechnician messages

Route::prefix('labtechnician')->middleware(['auth.custom', 'role:labtechnician', 'verified'])->group(function () {
    Route::get('messages', [LabTechnicianController::class, 'labtechnicianMessagesIndex'])->name('labtechnician.messages.index');
    Route::post('messages/send', [LabTechnicianController::class, 'labtechnicianMessagesSend'])->name('labtechnician.messages.send');
});



// labtechnician notification

Route::prefix('labtechnician')->middleware(['auth.custom', 'role:labtechnician', 'verified'])->group(function () {
    Route::get('notifications', [LabTechnicianController::class, 'labtechnicianNotificationsIndex'])->name('labtechnician.notifications.index');
    Route::post('notifications/read/{notification}', [LabTechnicianController::class, 'labtechnicianMarkNotificationRead'])->name('labtechnician.notifications.read');
});