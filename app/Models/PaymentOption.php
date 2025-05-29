<?php

namespace App\Models;

use App\Models\Bill;
use App\Models\User;

use App\Models\Admin;
use App\Models\LabTest;
use App\Models\Message;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\LabTechnician;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordAccess;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_method', 'account_holder_name', 'account_number', 'logo_path'
    ];

}
