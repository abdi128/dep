<?php

namespace App\Models;

use App\Models\Bill;
use App\Models\User;

use App\Models\Admin;
use App\Models\Doctor;
use App\Models\LabTest;
use App\Models\Message;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\LabTechnician;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecordAccess extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'medical_record_id', 'doctor_id', 'status'
    ];

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
