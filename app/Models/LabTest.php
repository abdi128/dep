<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Admin;
use App\Models\Doctor;
use App\Models\Bill;
use App\Models\LabTechnician;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\MedicalRecord;

class LabTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'labtechnician_id',
        'test_type',
        'cost',
        'test_result',
        'request_date',
        'status',
        'notes',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function labTechnician()
    {
        return $this->belongsTo(LabTechnician::class, 'labtechnician_id');
    }

    public function bill()
    {
        return $this->morphOne(Bill::class, 'billable');
    }
}
