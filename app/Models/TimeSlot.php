<?php

namespace App\Models;

use App\Models\Schedule;
use App\Models\Appointment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = ['schedule_id', 'start_time', 'end_time', 'is_available'];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
