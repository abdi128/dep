<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// At the top of AppServiceProvider.php
use App\Models\Appointment;
use App\Observers\AppointmentObserver;
use App\Models\LabTest;
use App\Observers\LabTestObserver;
use App\Models\Prescription;
use App\Observers\PrescriptionObserver;

// In the AppServiceProvider class:

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */

    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Appointment::observe(AppointmentObserver::class);
        LabTest::observe(LabTestObserver::class);
        Prescription::observe(PrescriptionObserver::class);
    }
}
