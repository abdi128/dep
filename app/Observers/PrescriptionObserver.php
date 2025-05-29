<?php

namespace App\Observers;

use App\Models\Bill;
use App\Models\Prescription;

class PrescriptionObserver
{
    /**
     * Handle the Prescription "created" event.
     */
    public function created(Prescription $prescription)
    {
        Bill::create([
            'patient_id' => $prescription->patient_id,
            'billable_type' => get_class($prescription),
            'billable_id' => $prescription->id,
            'amount' => $prescription->cost,
        ]);
    }

    /**
     * Handle the Prescription "updated" event.
     */
    public function updated(Prescription $prescription): void
    {
        //
    }

    /**
     * Handle the Prescription "deleted" event.
     */
    public function deleted(Prescription $prescription): void
    {
        //
    }

    /**
     * Handle the Prescription "restored" event.
     */
    public function restored(Prescription $prescription): void
    {
        //
    }

    /**
     * Handle the Prescription "force deleted" event.
     */
    public function forceDeleted(Prescription $prescription): void
    {
        //
    }
}
