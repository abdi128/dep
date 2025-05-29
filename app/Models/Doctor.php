<?php

namespace App\Models;

use App\Models\Bill;
use App\Models\User;

use App\Models\Admin;
use App\Models\LabTest;
use App\Models\Message;
use App\Models\Patient;
use App\Models\Schedule;
use App\Models\TimeSlot;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\LabTechnician;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordAccess;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone_number',
        'specialty',
        'license_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }



    public function labTests()
    {
        return $this->hasMany(LabTest::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function createdMedicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'doctor_id');
    }

    public function medicalRecordAccesses()
    {
        return $this->hasMany(MedicalRecordAccess::class);
    }
}
