<?php

namespace App\Models;

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
use App\Models\MedicalRecord;
use App\Models\PaymentOption;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'billable_type', 'billable_id', 'amount', 'status',
        'payment_option_id', 'payment_proof_path', 'paid_at', 'verified_by'
    ];

    // Relationship to Patient
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    // Polymorphic relation to Appointment, LabTest, or Prescription
    public function billable()
    {
        return $this->morphTo();
    }

    // Relationship to PaymentOption
    public function paymentOption()
    {
        return $this->belongsTo(PaymentOption::class);
    }

    // Admin who verified the payment
    public function verifier()
    {
        return $this->belongsTo(Admin::class, 'verified_by');
    }
}
