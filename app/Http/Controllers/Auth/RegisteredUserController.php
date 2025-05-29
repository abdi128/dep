<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Admin;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\LabTechnician;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    // Show Admin registration form
    public function createAdmin()
    {
        return Inertia::render('admin/register');
    }

    // Handle Admin registration
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        Admin::create(['user_id' => $user->id]);

        event(new Registered($user));
        //auth()->login($user);

        return to_route('admin.login');
    }


    // Show Patient registration form
    public function createPatient()
    {
        return Inertia::render('patient/register');
    }

    // Handle Patient registration
    public function storePatient(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
            'address' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'gender' => ['required', 'in:Male,Female'],
        ]);

        // Generate unique registration number
        do {
            $registrationNumber = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (Patient::where('registration_number', $registrationNumber)->exists());

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'patient',
        ]);

        Patient::create([
            'user_id' => $user->id,
            'registration_number' => $registrationNumber,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'gender' => $request->gender,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
        ]);

        event(new Registered($user));

        return to_route('patient.login');
    }


    // Show Doctor registration form
    public function createDoctor()
    {
        return Inertia::render('doctor/register');
    }

    // Handle Doctor registration
    public function storeDoctor(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
            'specialty' => 'required|string|max:255',
        ]);

        // Generate unique license number
        do {
            $licenseNumber = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (Doctor::where('license_number', $licenseNumber)->exists());

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'doctor',
        ]);

        Doctor::create([
            'user_id' => $user->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'specialty' => $request->specialty,
            'phone_number' => $request->phone_number,
            'license_number' => $licenseNumber,
        ]);

        event(new Registered($user));
        //auth()->login($user);

        return to_route('doctor.login');
    }

    // Show Lab Technician registration form
    public function createLabTechnician()
    {
        return Inertia::render('labtechnician/register');
    }

    // Handle Lab Technician registration
    public function storeLabTechnician(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
        ]);

        // Generate unique license number
        do {
            $licenseNumberLab = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (LabTechnician::where('license_number', $licenseNumberLab)->exists());

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'labtechnician',
        ]);

        LabTechnician::create([
            'user_id' => $user->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone_number' => $request->phone_number,
            'license_number' => $licenseNumberLab,
        ]);

        event(new Registered($user));
        //auth()->login($user);

        return to_route('labtechnician.login');
    }
}
