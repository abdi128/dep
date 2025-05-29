<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Bill;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Doctor;
use App\Models\LabTest;
use App\Models\Message;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Prescription;

use Illuminate\Http\Request;
use App\Models\LabTechnician;
use App\Models\MedicalRecord;
use App\Models\PaymentOption;
use App\Models\AppointmentPricing;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;


class AdminController extends Controller
{
/*********************************************************************
 * start of Admin dashboard
*********************************************************************/
    public function adminDashboardIndex()
{
    return Inertia::render('admin/dashboard', [
        'stats' => [
            'patients' => Patient::count(),
            'doctors' => Doctor::count(),
            'labtechnicians' => LabTechnician::count(),
            'appointments' => Appointment::count(),
            'prescriptions' => Prescription::count(),
            'labtests' => LabTest::count(),
        ],
    ]);
}
/*********************************************************************
 * end of Admin dashboard
*********************************************************************/


/*********************************************************************
 * start of Admin patients
*********************************************************************/
public function adminPatientsIndex(Request $request)
    {
        $search = $request->input('search');

        $query = Patient::with('user')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhere('registration_number', 'like', "%{$search}%");
            });
        }

        $patients = $query->get();

        return Inertia::render('admin/patients', [
            'patients' => $patients,
            'filters' => $request->only('search'),
        ]);
    }

    // Store new patient
    public function adminPatientsStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
            'address' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'gender' => ['required', 'in:Male,Female'],
        ]);

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

        return redirect()->route('admin.patients.index')->with('success', 'Patient Created Successfully.');
    }

    // Update existing patient
    public function adminPatientsUpdate(Request $request, Patient $patient)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $patient->user_id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
            'address' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'gender' => ['required', 'in:Male,Female'],
        ]);

        $user = $patient->user;
        $user->name = $request->name;
        $user->email = strtolower($request->email);
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        $patient->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'gender' => $request->gender,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
        ]);

        return redirect()->route('admin.patients.index')->with('success', 'Patient Updated Successfully.');
    }

    // Delete patient
    public function adminPatientsDestroy(Patient $patient)
    {
        $patient->user()->delete();
        return redirect()->route('admin.patients.index')->with('success', 'Patient deleted.');
    }
/*********************************************************************
 * end of Admin patients
*********************************************************************/


/*********************************************************************
 * start of Admin doctors
*********************************************************************/
 public function adminDoctorsIndex(Request $request)
    {
        $search = $request->input('search');

        $query = Doctor::with('user')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('specialty', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhere('license_number', 'like', "%{$search}%");
            });
        }

        $doctors = $query->get();

        return Inertia::render('admin/doctors', [
            'doctors' => $doctors,
            'filters' => $request->only('search'),
        ]);
    }

    // Store new doctor
    public function adminDoctorsStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
            'specialty' => 'required|string|max:255',
        ]);

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

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor created successfully.');
    }

    // Update existing doctor
    public function adminDoctorsUpdate(Request $request, Doctor $doctor)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $doctor->user_id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
            'specialty' => 'required|string|max:255',
        ]);

        $user = $doctor->user;
        $user->name = $request->name;
        $user->email = strtolower($request->email);
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        $doctor->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'specialty' => $request->specialty,
            'phone_number' => $request->phone_number,
        ]);

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor updated successfully.');
    }

    // Delete doctor
    public function adminDoctorsDestroy(Doctor $doctor)
    {
        $doctor->user()->delete();
        return redirect()->route('admin.doctors.index')->with('success', 'Doctor deleted successfully.');
    }
/*********************************************************************
 * end of Admin doctors
*********************************************************************/



/*********************************************************************
 * start of Admin labtechnicians
*********************************************************************/

   public function adminLabtechniciansIndex(Request $request)
    {
        $search = $request->input('search');

        $query = LabTechnician::with('user')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhere('license_number', 'like', "%{$search}%");
            });
        }

        $labtechnicians = $query->get();

        return Inertia::render('admin/labtechnicians', [
            'labtechnicians' => $labtechnicians,
            'filters' => $request->only('search'),
        ]);
    }

    // Store new lab technician
    public function adminLabtechniciansStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
        ]);

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

        return redirect()->route('admin.labtechnicians.index')->with('success', 'Lab Technician created successfully.');
    }

    // Update existing lab technician
    public function adminLabtechniciansUpdate(Request $request, LabTechnician $labtechnician)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $labtechnician->user_id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'first_name'=> 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number'=>'required|string|max:30',
        ]);

        $user = $labtechnician->user;
        $user->name = $request->name;
        $user->email = strtolower($request->email);
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        $labtechnician->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone_number' => $request->phone_number,
        ]);

        return redirect()->route('admin.labtechnicians.index')->with('success', 'Lab Technician updated successfully.');
    }

    // Delete lab technician
    public function adminLabtechniciansDestroy(LabTechnician $labtechnician)
    {
        $labtechnician->user()->delete();
        return redirect()->route('admin.labtechnicians.index')->with('success', 'Lab Technician deleted successfully.');
    }

/*********************************************************************
 * end of Admin labtechnicians
*********************************************************************/



/*********************************************************************
 * start of Admin appointments
*********************************************************************/
public function adminAppointmentsIndex()
{
    $appointments = \App\Models\Appointment::with([
        'doctor.user',
        'patient.user',
        'timeSlot.schedule'
    ])
    ->latest()
    ->get()
    ->map(function ($appt) {
        return [
            'id' => $appt->id,
            'doctor' => [
                'first_name' => $appt->doctor->first_name,
                'last_name' => $appt->doctor->last_name,
            ],
            'patient' => [
                'first_name' => $appt->patient->first_name,
                'last_name' => $appt->patient->last_name,
            ],
            'date' => optional($appt->timeSlot->schedule)->date,
            'start_time' => $appt->timeSlot->start_time ?? null,
            'end_time' => $appt->timeSlot->end_time ?? null,
            'appointment_status' => $appt->status,
            'notes' => $appt->reason,
            'duration' => $appt->timeSlot ? (
                (strtotime($appt->timeSlot->end_time) - strtotime($appt->timeSlot->start_time)) / 60
            ) : null,
            'doctor_status' => $appt->status, // You can adjust if you have more fields
            'patient_status' => $appt->status, // You can adjust if you have more fields
        ];
    });

    return inertia('admin/appointments', [
        'appointments' => $appointments,
    ]);
}

/*********************************************************************
 * start of Admin appointments
*********************************************************************/


/*********************************************************************
 * start of Admin presctiptions
*********************************************************************/
public function adminPrescriptionsIndex()
{
    $prescriptions = \App\Models\Prescription::with(['patient', 'doctor'])
        ->orderBy('created_at', 'desc')->latest()
        ->get();

    return inertia('admin/prescriptions', [
        'prescriptions' => $prescriptions,
    ]);
}
/*********************************************************************
 * end of Admin presctiptions
*********************************************************************/



/*********************************************************************
 * start of Admin laboratory
*********************************************************************/
    public function adminLaboratoryIndex()
    {
        $labTests = \App\Models\LabTest::with(['patient', 'doctor', 'labtechnician'])
            ->orderBy('request_date', 'desc')->latest()
            ->get();
        return inertia('admin/laboratory', [
            'labTests' => $labTests,
        ]);
    }
/*********************************************************************
 * end of Admin laboratory
*********************************************************************/


/*********************************************************************
 * start of Admin messages
*********************************************************************/
    public function adminMessagesIndex(Request $request)
    {
        $search = $request->query('search', '');
        $user = auth()->user();

        // Search users by name or email, exclude self
        $users = User::when($search, function($q) use ($search) {
            $q->where('name', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%");
        })
        ->where('id', '!=', $user->id)
        ->limit(10)
        ->get(['id', 'name', 'email', 'role']);

        // If a user is selected, fetch the conversation
        $selectedUserId = $request->query('user');
        $messages = [];
        if ($selectedUserId) {
            $messages = Message::where(function($q) use ($user, $selectedUserId) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $selectedUserId);
                })
                ->orWhere(function($q) use ($user, $selectedUserId) {
                    $q->where('sender_id', $selectedUserId)->where('receiver_id', $user->id);
                })
                ->orderBy('created_at')
                ->get();
        }

        return Inertia::render('admin/messages', [
            'users' => $users,
            'messages' => $messages,
            'selectedUserId' => $selectedUserId,
            'search' => $search,
            'authUserId' => $user->id,
        ]);
    }

    public function adminMessagesSend(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string|max:2000',
        ]);
        $user = auth()->user();

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->receiver_id,
            'body' => $request->body,
        ]);

        return back()->with('success', 'Message sent!');
    }
/*********************************************************************
 * end of Admin messages
*********************************************************************/



/*********************************************************************
 * start of Admin notifications
*********************************************************************/
    public function adminNotificationsIndex()
    {
        $user = auth()->user();

        $incoming = $user->notifications()->wherePivot('read', false)->orderByDesc('notifications.created_at')->get();
        $read = $user->notifications()->wherePivot('read', true)->orderByDesc('notifications.created_at')->get();

        return Inertia::render('admin/notifications', [
            'incoming' => $incoming,
            'read' => $read,
        ]);
    }

        public function adminNotificationsSend(Request $request)
        {
            $request->validate([
                'title' => 'required|string|max:255',
                'body'  => 'required|string',
                'roles' => 'required|array|min:1',
            ]);

            $roles = $request->roles;

            // If 'all' is checked, send to all roles (including admin)
            if (in_array('all', $roles)) {
                $roles = ['patient', 'doctor', 'labtechnician', 'admin'];
            }

            $adminId = auth()->id();

            foreach ($roles as $role) {
                $notification = Notification::create([
                    'title' => $request->title,
                    'body' => $request->body,
                    'role' => $role,
                ]);
                // Attach to all users of this role
                $users = User::where('role', $role)->get();
                foreach ($users as $user) {
                    $notification->users()->attach($user->id);
                }
            }

            return redirect()->route('admin.notifications.index')->with('success', 'Notification sent!');
        }


    public function adminMarkNotificationRead($notificationId)
    {
        $user = auth()->user();
        $user->notifications()->updateExistingPivot($notificationId, [
            'read' => true,
            'read_at' => now(),
        ]);
        return back();
    }
/*********************************************************************
 * start of Admin notifications
*********************************************************************/



/*********************************************************************
 * start of Admin billing
*********************************************************************/

    public function adminBillingIndex(Request $request)
    {
        // Bills with search/filters
        $bills = Bill::with(['patient.user', 'billable', 'paymentOption'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('patient.user', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%$search%")
                    ->orWhere('last_name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        // Payment options and pricings for the second tab
        $paymentOptions = PaymentOption::latest()->get();
        $appointmentPricings = AppointmentPricing::orderBy('min_minutes')->get();

        return Inertia::render('admin/billing', [
            'bills' => $bills,
            'paymentOptions' => $paymentOptions,
            'appointmentPricings' => $appointmentPricings,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

public function updateBillStatus(Request $request, Bill $bill)
{
    $bill->update([
        'status' => $request->status,
        'verified_at' => $request->status === 'Verified' ? now() : null,
        'verified_by' => $request->status === 'Verified' ? auth()->id() : null,
    ]);
    return redirect()->back()->with('success', 'Bill status updated.');
}

public function createPaymentOption(Request $request)
{
    $data = $request->validate([
        'payment_method' => 'required|string|max:255',
        'account_holder_name' => 'required|string|max:255',
        'account_number' => 'required|string|max:255',
        'logo' => 'nullable|image|max:2048',
    ]);
    if ($request->hasFile('logo')) {
        $data['logo_path'] = $request->file('logo')->store('payment_logos', 'public');
    }
    PaymentOption::create($data);
    return redirect()->back()->with('success', 'Payment option created.');
}

public function updatePaymentOption(Request $request, \App\Models\PaymentOption $option)
{
    $data = $request->validate([
        'payment_method' => 'sometimes|string|max:255',
        'account_holder_name' => 'sometimes|string|max:255',
        'account_number' => 'sometimes|string|max:255',
        'logo' => 'nullable|image|max:2048',
    ]);
    if ($request->hasFile('logo')) {
        $data['logo_path'] = $request->file('logo')->store('payment_logos', 'public');
    }
    $option->update($data);
    return redirect()->back()->with('success', 'Payment option updated.');
}

public function deletePaymentOption(\App\Models\PaymentOption $option)
{
    $option->delete();
    return redirect()->back()->with('success', 'Payment option deleted.');
}

public function setAppointmentPricing(Request $request)
{
    $data = $request->validate([
        'min_minutes' => 'required|integer|min:0',
        'max_minutes' => 'required|integer|min:1',
        'price' => 'required|numeric|min:0',
    ]);
    \App\Models\AppointmentPricing::updateOrCreate(
        [
            'min_minutes' => $data['min_minutes'],
            'max_minutes' => $data['max_minutes'],
        ],
        ['price' => $data['price']]
    );
    return redirect()->back()->with('success', 'Appointment pricing updated.');
}



/*********************************************************************
 * end of Admin billing
*********************************************************************/


/***
 *  analytics 
 */


 public function adminReportsIndex(Request $request)
{
    // Get date range filters with defaults
    $startDate = $request->input('start_date', now()->subMonth()->format('Y-m-d'));
    $endDate = $request->input('end_date', now()->format('Y-m-d'));
    
    // Convert to Carbon instances for querying
    $start = Carbon::parse($startDate)->startOfDay();
    $end = Carbon::parse($endDate)->endOfDay();
    
    // Main statistics
    $stats = [
        'total_patients' => Patient::count(),
        'total_doctors' => Doctor::count(),
        'total_appointments' => Appointment::count(),
        'total_prescriptions' => Prescription::count(),
        'total_lab_tests' => LabTest::count(),
        'total_revenue' => Bill::where('status', 'Verified')->sum('amount'),
    ];
    
    // Time-based statistics
    $timeStats = [
        'new_patients' => Patient::whereBetween('created_at', [$start, $end])->count(),
        'completed_appointments' => Appointment::whereBetween('created_at', [$start, $end])
            ->where('status', 'Completed')
            ->count(),
        'pending_prescriptions' => Prescription::whereBetween('created_at', [$start, $end])
            ->where('status', 'Pending')
            ->count(),
        'revenue' => Bill::whereBetween('created_at', [$start, $end])
            ->where('status', 'Verified')
            ->sum('amount'),
    ];
    
    // Appointment trends by status
    $appointmentTrends = Appointment::selectRaw('status, COUNT(*) as count')
        ->whereBetween('created_at', [$start, $end])
        ->groupBy('status')
        ->get()
        ->pluck('count', 'status');
    
    // Revenue by payment method
    $revenueByPayment = Bill::selectRaw('payment_options.payment_method, SUM(bills.amount) as total')
        ->join('payment_options', 'bills.payment_option_id', '=', 'payment_options.id')
        ->whereBetween('bills.created_at', [$start, $end])
        ->where('bills.status', 'Verified')
        ->groupBy('payment_options.payment_method')
        ->get()
        ->pluck('total', 'payment_method');
    
    // Patient demographics
    $patientDemographics = [
        'gender' => Patient::selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->get()
            ->pluck('count', 'gender'),
        'age_groups' => [
            '0-18' => Patient::where('date_of_birth', '>=', now()->subYears(18))->count(),
            '19-35' => Patient::whereBetween('date_of_birth', [now()->subYears(35), now()->subYears(19)])->count(),
            '36-55' => Patient::whereBetween('date_of_birth', [now()->subYears(55), now()->subYears(36)])->count(),
            '56+' => Patient::where('date_of_birth', '<', now()->subYears(55))->count(),
        ],
    ];
    
    // Doctor statistics
    $doctorStats = Doctor::withCount(['appointments' => function($query) use ($start, $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }])
        ->orderBy('appointments_count', 'desc')
        ->limit(5)
        ->get();
    
    return Inertia::render('admin/reports', [
        'stats' => $stats,
        'timeStats' => $timeStats,
        'appointmentTrends' => $appointmentTrends,
        'revenueByPayment' => $revenueByPayment,
        'patientDemographics' => $patientDemographics,
        'doctorStats' => $doctorStats,
        'filters' => [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ],
    ]);
}

public function adminExportData(Request $request)
{
    $type = $request->input('type', 'csv');
    $dataType = $request->input('data_type');
    $startDate = $request->input('start_date', now()->subMonth()->format('Y-m-d'));
    $endDate = $request->input('end_date', now()->format('Y-m-d'));
    
    $start = Carbon::parse($startDate)->startOfDay();
    $end = Carbon::parse($endDate)->endOfDay();
    
    switch ($dataType) {
        case 'patients':
            $data = Patient::with('user')
                ->whereBetween('created_at', [$start, $end])
                ->get()
                ->map(function($patient) {
                    return [
                        'ID' => $patient->id,
                        'Registration Number' => $patient->registration_number,
                        'Full Name' => $patient->first_name . ' ' . $patient->last_name,
                        'Gender' => $patient->gender,
                        'Date of Birth' => $patient->date_of_birth,
                        'Phone' => $patient->phone_number,
                        'Address' => $patient->address,
                        'Email' => $patient->user->email,
                        'Registered At' => $patient->created_at,
                    ];
                });
            $filename = 'patients_' . now()->format('Ymd_His');
            break;
            
        case 'appointments':
            $data = Appointment::with(['patient.user', 'doctor.user', 'timeSlot.schedule'])
                ->whereBetween('created_at', [$start, $end])
                ->get()
                ->map(function($appointment) {
                    return [
                        'ID' => $appointment->id,
                        'Patient' => $appointment->patient->user->name,
                        'Doctor' => $appointment->doctor->user->name,
                        'Date' => $appointment->timeSlot->schedule->date ?? 'N/A',
                        'Time' => ($appointment->timeSlot->start_time ?? 'N/A') . ' - ' . ($appointment->timeSlot->end_time ?? 'N/A'),
                        'Status' => $appointment->status,
                        'Reason' => $appointment->reason,
                        'Created At' => $appointment->created_at,
                    ];
                });
            $filename = 'appointments_' . now()->format('Ymd_His');
            break;
            
        case 'billing':
            $data = Bill::with(['patient.user', 'paymentOption'])
                ->whereBetween('created_at', [$start, $end])
                ->get()
                ->map(function($bill) {
                    return [
                        'ID' => $bill->id,
                        'Patient' => $bill->patient->user->name,
                        'Amount' => $bill->amount,
                        'Payment Method' => $bill->paymentOption->payment_method,
                        'Status' => $bill->status,
                        'Billable Type' => $bill->billable_type,
                        'Created At' => $bill->created_at,
                        'Verified At' => $bill->verified_at,
                    ];
                });
            $filename = 'billing_' . now()->format('Ymd_His');
            break;
            
        default:
            return response()->json(['error' => 'Invalid data type'], 400);
    }
    
    if ($type === 'csv') {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
        ];
        
        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            
            // Add headers
            if (!empty($data)) {
                fputcsv($file, array_keys($data[0]));
            }
            
            // Add data
            foreach ($data as $row) {
                fputcsv($file, $row);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    } elseif ($type === 'pdf') {
        $pdf = \PDF::loadView('exports.pdf', ['data' => $data, 'title' => ucfirst($dataType) . ' Report']);
        return $pdf->download($filename . '.pdf');
    } elseif ($type === 'excel') {
        return \Excel::download(new \App\Exports\GenericExport($data), $filename . '.xlsx');
    }
    
    return response()->json(['error' => 'Invalid export type'], 400);
}
}
