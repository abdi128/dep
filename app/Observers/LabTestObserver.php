<?php

namespace App\Observers;

use App\Models\Bill;
use App\Models\LabTest;

class LabTestObserver
{
    /**
     * Handle the LabTest "created" event.
     */
    public function created(LabTest $labTest): void
    {
        //
    }

    /**
     * Handle the LabTest "updated" event.
     */
    public function updated(LabTest $labTest)
    {
        if ($labTest->isDirty('status') && 
            $labTest->status === 'Complete' && 
            !$labTest->bill
        ) {
            Bill::create([
                'patient_id' => $labTest->patient_id,
                'billable_type' => get_class($labTest),
                'billable_id' => $labTest->id,
                'amount' => $labTest->cost,
            ]);
        }
    }

    /**
     * Handle the LabTest "deleted" event.
     */
    public function deleted(LabTest $labTest): void
    {
        //
    }

    /**
     * Handle the LabTest "restored" event.
     */
    public function restored(LabTest $labTest): void
    {
        //
    }

    /**
     * Handle the LabTest "force deleted" event.
     */
    public function forceDeleted(LabTest $labTest): void
    {
        //
    }
}
