<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AppointmentPolicy
{
    public function view(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->patient->user_id ||
               $user->id === $appointment->doctor->user_id;
    }

    public function update(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->patient->user_id;
    }

    public function cancel(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->patient->user_id ||
               $user->id === $appointment->doctor->user_id;
    }
}
