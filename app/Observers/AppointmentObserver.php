<?php

namespace App\Observers;

use App\Models\Bill;
use App\Models\Appointment;
use App\Models\AppointmentPricing;

class AppointmentObserver
{
    /**
     * Handle the Appointment "created" event.
     */
    public function created(Appointment $appointment): void
    {
        //
    }

    /**
     * Handle the Appointment "updated" event.
     */
    public function updated(Appointment $appointment)
    {
        if ($appointment->isDirty('appointment_status') && 
            $appointment->appointment_status === 'approved' && 
            !$appointment->bill
        ) {
            // Calculate price based on duration
            $pricing = AppointmentPricing::where('min_minutes', '<=', $appointment->duration)
                ->where('max_minutes', '>=', $appointment->duration)
                ->first();
            $amount = $pricing ? $pricing->price : 100.00;

            // Create bill
            Bill::create([
                'patient_id' => $appointment->patient_id,
                'billable_type' => get_class($appointment),
                'billable_id' => $appointment->id,
                'amount' => $amount,
            ]);
        }
    }

    /**
     * Handle the Appointment "deleted" event.
     */
    public function deleted(Appointment $appointment): void
    {
        //
    }

    /**
     * Handle the Appointment "restored" event.
     */
    public function restored(Appointment $appointment): void
    {
        //
    }

    /**
     * Handle the Appointment "force deleted" event.
     */
    public function forceDeleted(Appointment $appointment): void
    {
        //
    }
}
