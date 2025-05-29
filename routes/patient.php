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


// sidebar routes for patient

Route::prefix('patient')->middleware(['role:patient', 'auth.custom', 'verified'])->group(function () {


    Route::get('dashboard', [PatientController::class, 'patientDashboardIndex'])
        ->name('patient.dashboard');

    Route::get('billing', [PatientController::class, 'patientBillingIndex'])
        ->name('patient.billing');

});



// Routes for patient appointments
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/patient/doctors', [PatientController::class, 'patientDoctorsIndex'])
        ->name('patient.doctors');
        
    Route::get('/patient/doctors/{doctor}/book', [PatientController::class, 'patientAppointmentBookingIndex'])
        ->name('patient.appointmentbooking');
        
    Route::get('/patient/doctors/{doctor}/book/{appointment}', [PatientController::class, 'patientAppointmentBookingIndex'])
        ->name('patient.appointmentbooking.reschedule');
        
    Route::post('/patient/doctors/{doctor}/book', [PatientController::class, 'bookAppointment'])
        ->name('patient.appointmentbooking.book');
        
    Route::get('/patient/appointments', [PatientController::class, 'patientAppointmentsIndex'])
        ->name('patient.appointments');
        
    Route::post('/patient/appointments/{appointment}/cancel', [PatientController::class, 'cancelAppointment'])
        ->name('patient.appointments.cancel');
});

//routes for patient laboratory

Route::prefix('patient')->middleware(['auth.custom', 'role:patient', 'verified'])->group(function () {
    Route::get('laboratory', [PatientController::class, 'patientLaboratoryIndex'])->name('patient.laboratory.index');
});



// Patient prescriptions
Route::prefix('patient')->middleware(['auth.custom', 'role:patient', 'verified'])->group(function () {
    Route::get('prescriptions', [PatientController::class, 'patientPrescriptionsIndex'])->name('patient.prescriptions.index');
});



// patient messages
Route::prefix('patient')->middleware(['auth.custom', 'role:patient', 'verified'])->group(function () {
    Route::get('messages', [PatientController::class, 'patientMessagesIndex'])->name('patient.messages.index');
    Route::post('messages/send', [PatientController::class, 'patientMessagesSend'])->name('patient.messages.send');
});


// patient notifications
Route::prefix('patient')->middleware(['auth.custom', 'role:patient', 'verified'])->group(function () {
    Route::get('notifications', [PatientController::class, 'patientNotificationsIndex'])->name('patient.notifications.index');
    Route::post('notifications/read/{notification}', [PatientController::class, 'patientMarkNotificationRead'])->name('patient.notifications.read');
});


// patient medical records

Route::prefix('patient')->middleware(['auth.custom', 'role:patient', 'verified'])->group(function () {
    Route::get('medicalrecords', [PatientController::class, 'patientMedicalrecordsIndex'])->name('patient.medicalrecords.index');
    Route::post('medicalrecords/access/{access}/grant', [PatientController::class, 'grantMedicalRecordAccess'])->name('patient.medicalrecords.access.grant');
    Route::post('medicalrecords/access/{access}/reject', [PatientController::class, 'rejectMedicalRecordAccess'])->name('patient.medicalrecords.access.reject');
    Route::post('medicalrecords/access/{access}/revoke', [PatientController::class, 'revokeMedicalRecordAccess'])->name('patient.medicalrecords.access.revoke');
});


//patient billing

// Patient Routes
Route::middleware(['auth.custom', 'role:patient', 'verified'])->prefix('patient')->group(function () {
    Route::get('billing', [PatientController::class, 'patientBillingIndex'])->name('patient.billing.index');
    Route::post('billing/{bill}/verify', [PatientController::class, 'verifyPayment'])->name('patient.billing.verify');
});
