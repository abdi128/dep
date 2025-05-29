<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Bill;
use App\Models\LabTest;
use App\Models\LabTechnician;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\MedicalRecord;

class Admin extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
