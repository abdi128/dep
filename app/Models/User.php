<?php

namespace App\Models;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Admin;
use App\Models\Doctor;
use App\Models\Bill;
use App\Models\LabTest;
use App\Models\LabTechnician;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\MedicalRecord;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable //implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function patient()
    {
        return $this->hasOne(Patient::class);
    }

    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }

    public function labTechnician()
    {
        return $this->hasOne(LabTechnician::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function sentMessages() {
        return $this->hasMany(Message::class, 'sender_id');
    }
    public function receivedMessages() {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function notifications()
    {
        return $this->belongsToMany(Notification::class)->withPivot('read', 'read_at')->withTimestamps();
    }

}
