<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/continue', function () {
    return Inertia::render('continue');
})->name('continue');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/patient.php';
require __DIR__.'/doctor.php';
require __DIR__.'/labtechnician.php';
