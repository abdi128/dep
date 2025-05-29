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


// sidebar routes for doctor

Route::prefix('doctor')->middleware(['role:doctor', 'auth.custom', 'verified'])->group(function () {

    Route::get('labtechnicians', [DoctorController::class, 'doctorLabtechniciansIndex'])
        ->name('doctor.labtechnicians');

    Route::get('dashboard', [DoctorController::class, 'doctorDashboardIndex'])
        ->name('doctor.dashboard');

});



// Routes for doctor appointments and schedule
Route::middleware(['auth.custom', 'role:doctor', 'verified'])->group(function () {

    // Doctor routes
    Route::prefix('doctor')->name('doctor.')->group(function () {
        Route::get('schedule', [DoctorController::class, 'doctorScheduleIndex'])->name('schedule');
        Route::post('schedule/update', [DoctorController::class, 'updateSchedule'])->name('schedule.update');

        Route::get('appointments', [DoctorController::class, 'doctorAppointmentsIndex'])->name('appointments');
        Route::post('appointments/{appointment}/cancel', [DoctorController::class, 'cancelAppointment'])->name('appointments.cancel');
    });

});



//routes for doctor laboratory

Route::prefix('doctor')->middleware(['auth.custom', 'role:doctor', 'verified'])->group(function () {
    Route::get('laboratory', [DoctorController::class, 'doctorLaboratoryIndex'])->name('doctor.laboratory.index');
    Route::post('laboratory/request', [DoctorController::class, 'doctorLaboratoryRequest'])->name('doctor.laboratory.request');
    Route::post('laboratory/{labTest}/cancel', [DoctorController::class, 'doctorLaboratoryCancel'])->name('doctor.laboratory.cancel');
});


// Doctor prescriptions
Route::prefix('doctor')->middleware(['auth.custom', 'role:doctor', 'verified'])->group(function () {
    Route::get('prescriptions', [DoctorController::class, 'doctorPrescriptionsIndex'])->name('doctor.prescriptions.index');
    Route::post('prescriptions', [DoctorController::class, 'doctorPrescriptionsStore'])->name('doctor.prescriptions.store');
    Route::post('prescriptions/{prescription}/cancel', [DoctorController::class, 'doctorPrescriptionsCancel'])->name('doctor.prescriptions.cancel');
});



// doctor  messages
Route::prefix('doctor')->middleware(['auth.custom', 'role:doctor', 'verified'])->group(function () {
    Route::get('messages', [DoctorController::class, 'doctorMessagesIndex'])->name('doctor.messages.index');
    Route::post('messages/send', [DoctorController::class, 'doctorMessagesSend'])->name('doctor.messages.send');
});


// doctor notifications
Route::prefix('doctor')->middleware(['auth.custom', 'role:doctor', 'verified'])->group(function () {
    Route::get('notifications', [DoctorController::class, 'doctorNotificationsIndex'])->name('doctor.notifications.index');
    Route::post('notifications/read/{notification}', [DoctorController::class, 'doctorMarkNotificationRead'])->name('doctor.notifications.read');
});



// doctor patients
Route::prefix('doctor')->middleware(['role:doctor', 'auth.custom', 'verified'])->group(function () {
    Route::get('patients', [DoctorController::class, 'doctorPatientsIndex'])
        ->name('doctor.patients');
});

//Route::middleware(['auth.custom', 'role:doctor', 'verified'])->get('/doctor/patient/{id}', [DoctorController::class, 'doctorPatientdetailIndex'])->name('doctor.patientdetail');



// Doctor patientdetail routes
Route::prefix('doctor')->middleware(['auth.custom', 'role:doctor', 'verified'])->group(function () {
    Route::get('patient/{id}', [DoctorController::class, 'doctorPatientdetailIndex'])->name('doctor.patientdetail');
    Route::post('patient/{id}/medicalrecords', [DoctorController::class, 'createMedicalRecord'])->name('doctor.medicalrecords.create');
    Route::post('medicalrecords/{record}/request-access', [DoctorController::class, 'requestMedicalRecordAccess'])->name('doctor.medicalrecords.request_access');
});
