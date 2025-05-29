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


// sidebar routes for admin

Route::prefix('admin')->middleware(['role:admin', 'auth.custom', 'verified'])->group(function () {

    Route::get('dashboard', [AdminController::class, 'adminDashboardIndex'])
        ->name('admin.dashboard');

});



// Admin appointments
Route::prefix('admin')->middleware(['role:admin', 'auth.custom', 'verified'])->group(function () {
    Route::get('/appointments', [AdminController::class, 'adminAppointmentsIndex'])->name('admin.appointments.index');
});


// Admin laboratory
Route::prefix('admin')->middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::get('/laboratory', [AdminController::class, 'adminLaboratoryIndex'])->name('admin.laboratory.index');
});


Route::middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('patients', [AdminController::class, 'adminPatientsIndex'])->name('patients.index');
        Route::post('patients', [AdminController::class, 'adminPatientsStore'])->name('patients.store');
        Route::put('patients/{patient}', [AdminController::class, 'adminPatientsUpdate'])->name('patients.update');
        Route::delete('patients/{patient}', [AdminController::class, 'adminPatientsDestroy'])->name('patients.destroy');
    });
});


// Admin doctors
Route::middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('doctors', [AdminController::class, 'adminDoctorsIndex'])->name('doctors.index');
        Route::post('doctors', [AdminController::class, 'adminDoctorsStore'])->name('doctors.store');
        Route::put('doctors/{doctor}', [AdminController::class, 'adminDoctorsUpdate'])->name('doctors.update');
        Route::delete('doctors/{doctor}', [AdminController::class, 'adminDoctorsDestroy'])->name('doctors.destroy');
    });
});



// Admin labtechnicians
Route::middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('labtechnicians', [AdminController::class, 'adminLabtechniciansIndex'])->name('labtechnicians.index');
        Route::post('labtechnicians', [AdminController::class, 'adminLabtechniciansStore'])->name('labtechnicians.store');
        Route::put('labtechnicians/{labtechnician}', [AdminController::class, 'adminLabtechniciansUpdate'])->name('labtechnicians.update');
        Route::delete('labtechnicians/{labtechnician}', [AdminController::class, 'adminLabtechniciansDestroy'])->name('labtechnicians.destroy');
    });
});


// Admin prescriptions
Route::prefix('admin')->middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::get('prescriptions', [AdminController::class, 'adminPrescriptionsIndex'])->name('admin.prescriptions.index');
});


// admin messages
Route::prefix('admin')->middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::get('messages', [AdminController::class, 'adminMessagesIndex'])->name('admin.messages.index');
    Route::post('messages/send', [AdminController::class, 'adminMessagesSend'])->name('admin.messages.send');
});


// admin notifications

Route::prefix('admin')->middleware(['auth.custom', 'role:admin', 'verified'])->group(function () {
    Route::get('notifications', [AdminController::class, 'adminNotificationsIndex'])->name('admin.notifications.index');
    Route::post('notifications/send', [AdminController::class, 'adminNotificationsSend'])->name('admin.notifications.send');
    Route::post('notifications/read/{notification}', [AdminController::class, 'adminMarkNotificationRead'])->name('admin.notifications.read');
});


// admin billing
Route::middleware(['auth.custom', 'role:admin', 'verified'])->prefix('admin')->group(function () {
    Route::get('billing', [AdminController::class, 'adminBillingIndex'])->name('admin.billing.index');
    Route::patch('billing/{bill}/status', [AdminController::class, 'updateBillStatus'])->name('admin.billing.update_status');
    Route::post('billing/payment-options', [AdminController::class, 'createPaymentOption'])->name('admin.billing.payment_options.create');
    Route::patch('billing/payment-options/{option}', [AdminController::class, 'updatePaymentOption'])->name('admin.billing.payment_options.update');
    Route::delete('billing/payment-options/{option}', [AdminController::class, 'deletePaymentOption'])->name('admin.billing.payment_options.delete');
    Route::post('billing/appointment-pricings', [AdminController::class, 'setAppointmentPricing'])->name('admin.billing.appointment_pricings.set');
});


// admin reports
Route::prefix('admin')->middleware(['auth.custom', 'verified', 'role:admin'])->group(function () {
    Route::get('/reports', [AdminController::class, 'adminReportsIndex'])->name('admin.reports.index');
    Route::get('/export-data', [AdminController::class, 'adminExportData'])->name('admin.export.data');
});