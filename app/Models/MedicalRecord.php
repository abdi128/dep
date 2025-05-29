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
use App\Models\MedicalRecordAccess;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'doctor_id', 'title', 'diagnosis', 'treatment', 'notes'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function creator()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function accesses()
    {
        return $this->hasMany(MedicalRecordAccess::class);
    }
}
