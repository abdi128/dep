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
use App\Models\LabTest;
use App\Models\LabTechnician;
use App\Models\Message;
use App\Models\Prescription;
use App\Models\MedicalRecord;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'role',
    ];

    public function users() {
        return $this->belongsToMany(User::class)->withPivot('read', 'read_at')->withTimestamps();
    }
}
