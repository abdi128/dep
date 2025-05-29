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
use App\Models\Schedule;
use App\Models\TimeSlot;

use Illuminate\Http\Request;
use App\Models\LabTechnician;
use App\Models\MedicalRecord;
use App\Models\PaymentOption;
use App\Models\MedicalRecordAccess;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{

/*********************************************************************
 * start of patient dashboard
*********************************************************************/
public function patientDashboardIndex()
{
    $patient = auth()->user()->patient;
    return Inertia::render('patient/dashboard', [
        'stats' => [
            'appointments' => $patient->appointments()->count(),
            'doctors' => \App\Models\Doctor::count(),
            'labtests' => $patient->labTests()->count(),
            'medicalrecords' => $patient->medicalRecords()->count(),
        ],
    ]);
}

/*********************************************************************
 * end of patient dashboard
*********************************************************************/



/*********************************************************************
 * start of patient laboratory
*********************************************************************/
    public function patientLaboratoryIndex()
    {
        $patient = auth()->user()->patient;
        $labTests = LabTest::with(['doctor', 'labtechnician'])
            ->where('patient_id', $patient->id)
            ->orderBy('request_date', 'desc')->latest()
            ->get();
        return inertia('patient/laboratory', [
            'labTests' => $labTests,
        ]);
    }
/*********************************************************************
 * end of patient laboratory
*********************************************************************/


/*********************************************************************
 * start of patient appointments
*********************************************************************/

   public function patientDoctorsIndex(Request $request)
    {
        $query = Doctor::with('user');

        if ($search = $request->input('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('license_number', 'like', "%{$search}%");
        }

        $doctors = $query->get()->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'name' => $doctor->first_name . ' ' . $doctor->last_name,
                'specialty' => $doctor->specialty,
                'license_number' => $doctor->license_number,
                'phone_number' => $doctor->phone_number,
            ];
        });

        return Inertia::render('patient/doctors', [
            'doctors' => $doctors,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show appointment booking page for a specific doctor.
*/
public function patientAppointmentBookingIndex(Request $request, $doctorId, $appointmentId = null)
{
    $doctor = Doctor::with(['schedules.timeSlots' => function($query) {
        $query->where('is_available', true);
    }])->findOrFail($doctorId);

    $patient = auth()->user()->patient;

    $appointments = Appointment::where('doctor_id', $doctor->id)
        ->where('patient_id', $patient->id)
        ->with(['timeSlot.schedule'])
        ->orderBy('created_at', 'desc')
        ->get();

    $appointmentToReschedule = null;
    if ($appointmentId) {
        $appointmentToReschedule = $appointments->firstWhere('id', $appointmentId);
    }

    return Inertia::render('patient/appointmentbooking', [
        'doctor' => [
            'id' => $doctor->id,
            'first_name' => $doctor->first_name,
            'last_name' => $doctor->last_name,
            'schedules' => $doctor->schedules->map(function($schedule) {
                return [
                    'id' => $schedule->id,
                    'date' => $schedule->date,
                    'time_slots' => $schedule->timeSlots->map(function($timeSlot) {
                        return [
                            'id' => $timeSlot->id,
                            'start_time' => $timeSlot->start_time,
                            'end_time' => $timeSlot->end_time,
                            'is_available' => $timeSlot->is_available,
                        ];
                    }),
                ];
            }),
        ],
        'patient' => $patient,
        'appointments' => $appointments->map(function($appointment) {
            return [
                'id' => $appointment->id,
                'timeSlot' => [
                    'id' => $appointment->timeSlot->id,
                    'start_time' => $appointment->timeSlot->start_time,
                    'end_time' => $appointment->timeSlot->end_time,
                    'schedule' => [
                        'id' => $appointment->timeSlot->schedule->id,
                        'date' => $appointment->timeSlot->schedule->date,
                    ],
                ],
                'status' => $appointment->status,
                'reason' => $appointment->reason,
                'created_at' => $appointment->created_at,
            ];
        }),
        'appointmentToReschedule' => $appointmentToReschedule ? [
            'id' => $appointmentToReschedule->id,
            'time_slot_id' => $appointmentToReschedule->time_slot_id,
            'reason' => $appointmentToReschedule->reason,
            'timeSlot' => [
                'id' => $appointmentToReschedule->timeSlot->id,
                'schedule' => [
                    'date' => $appointmentToReschedule->timeSlot->schedule->date,
                ],
            ],
        ] : null,
    ]);
}

public function bookAppointment(Request $request, $doctorId)
{
    $patient = auth()->user()->patient;
    $doctor = Doctor::findOrFail($doctorId);

    $validated = $request->validate([
        'time_slot_id' => 'required|exists:time_slots,id',
        'reason' => 'nullable|string|max:500',
        'appointment_id' => 'nullable|exists:appointments,id',
    ]);

    $timeSlot = TimeSlot::with('schedule')->findOrFail($validated['time_slot_id']);

    // Verify the time slot belongs to this doctor and is available
    if ($timeSlot->schedule->doctor_id !== $doctor->id || !$timeSlot->is_available) {
        return back()->withErrors(['time_slot_id' => 'The selected time is not available.']);
    }

    // Check for existing appointment at this time (excluding current appointment if rescheduling)
    $existingAppointment = Appointment::where('doctor_id', $doctor->id)
        ->where('time_slot_id', $timeSlot->id)
        ->where('status', 'approved')
        ->when($validated['appointment_id'], function($query, $appointmentId) {
            return $query->where('id', '!=', $appointmentId);
        })
        ->first();

    if ($existingAppointment) {
        return back()->withErrors(['time_slot_id' => 'The selected time is already booked.']);
    }

    if (!empty($validated['appointment_id'])) {
        // Reschedule existing appointment
        $appointment = Appointment::where('id', $validated['appointment_id'])
            ->where('patient_id', $patient->id)
            ->firstOrFail();

        if ($appointment->status === 'cancelled') {
            return back()->withErrors(['appointment_id' => 'Cancelled appointments cannot be rescheduled.']);
        }

        // Free up the old time slot
        TimeSlot::where('id', $appointment->time_slot_id)->update(['is_available' => true]);

        $appointment->update([
            'time_slot_id' => $timeSlot->id,
            'reason' => $validated['reason'] ?? $appointment->reason,
            'status' => 'approved',
        ]);

        // Mark new time slot as unavailable
        $timeSlot->update(['is_available' => false]);

        return redirect()->route('patient.appointmentbooking', [
            'doctor' => $doctor->id,
        ])->with('success', 'Appointment rescheduled successfully.');
    } else {
        // Create new appointment
        Appointment::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'time_slot_id' => $timeSlot->id,
            'reason' => $validated['reason'] ?? null,
            'status' => 'approved',
        ]);

        // Mark time slot as unavailable
        $timeSlot->update(['is_available' => false]);

        return redirect()->route('patient.appointmentbooking', [
            'doctor' => $doctor->id,
        ])->with('success', 'Appointment booked successfully.');
    }
}
    /**
     * List all appointments for the authenticated patient, with optional search.
     */
    public function patientAppointmentsIndex(Request $request)
    {
        $patient = auth()->user()->patient;
        $query = $patient->appointments()->with(['doctor', 'timeSlot.schedule'])->orderBy('created_at', 'desc');

        if ($search = $request->input('search')) {
            $query->whereHas('doctor.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('doctor', function ($q) use ($search) {
                $q->where('license_number', 'like', "%{$search}%");
            });
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'doctor_name' => $appointment->doctor->first_name . ' ' . $appointment->doctor->last_name,
                'doctor_license_number' => $appointment->doctor->license_number,
                'date' => $appointment->timeSlot->schedule->date,
                'start_time' => $appointment->timeSlot->start_time,
                'end_time' => $appointment->timeSlot->end_time,
                'status' => $appointment->status,
                'reason' => $appointment->reason,
                'created_at' => $appointment->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('patient/appointments', [
            'appointments' => $appointments,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Cancel an appointment by the authenticated patient.
     */
    public function cancelAppointment(Request $request, $appointmentId)
    {
        $patient = auth()->user()->patient;
        $appointment = $patient->appointments()->findOrFail($appointmentId);

        if ($appointment->status !== 'cancelled') {
            $appointment->status = 'cancelled';
            $appointment->save();
        }

        return redirect()->back()->with('success', 'Appointment cancelled successfully.');
    }
/*********************************************************************
 * end of patient appointments
*********************************************************************/


/*********************************************************************
 * start of patient medicalrecords
*********************************************************************/
    public function patientMedicalrecordsIndex()
    {
        $user = auth()->user();
        $patient = $user->patient; // Assuming User hasOne Patient

        // All medical records of this patient
        $medicalRecords = $patient->medicalRecords()->with('creator')->get();

        // Doctors who have been granted access (excluding creator)
        $grantedAccesses = MedicalRecordAccess::with('doctor', 'medicalRecord')
            ->whereHas('medicalRecord', fn($q) => $q->where('patient_id', $patient->id))
            ->where('status', 'granted')
            ->get();

        // Pending requests
        $pendingAccesses = \App\Models\MedicalRecordAccess::with('doctor', 'medicalRecord')
            ->whereHas('medicalRecord', fn($q) => $q->where('patient_id', $patient->id))
            ->where('status', 'pending')
            ->get();

        return Inertia::render('patient/medicalrecords', [
            'medicalRecords' => $medicalRecords,
            'grantedAccesses' => $grantedAccesses,
            'pendingAccesses' => $pendingAccesses,
        ]);
    }

    public function grantMedicalRecordAccess($accessId)
    {
        $access = \App\Models\MedicalRecordAccess::findOrFail($accessId);
        $access->update(['status' => 'granted']);
        return back();
    }

    public function rejectMedicalRecordAccess($accessId)
    {
        $access = \App\Models\MedicalRecordAccess::findOrFail($accessId);
        $access->update(['status' => 'rejected']);
        return back();
    }

    public function revokeMedicalRecordAccess($accessId)
    {
        $access = \App\Models\MedicalRecordAccess::findOrFail($accessId);
        $access->delete();
        return back();
    }

/*********************************************************************
 * end of patient medicalrecords
*********************************************************************/



/*********************************************************************
 * start of patient prescriptions
*********************************************************************/
    public function patientPrescriptionsIndex()
    {
        $patient = auth()->user()->patient;

        $prescriptions = Prescription::with(['doctor', 'patient'])
            ->where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('patient/prescriptions', [
            'prescriptions' => $prescriptions,
        ]);
    }
/*********************************************************************
 * end of patient prescriptions
*********************************************************************/



/*********************************************************************
 * start of patient doctors
*********************************************************************/
/*public function patientDoctorsIndex()
{
    $doctors = \App\Models\Doctor::with('user')->orderBy('created_at', 'desc')->get();
    return inertia('patient/doctors', [
        'doctors' => $doctors,
    ]);
}*/

/*********************************************************************
 * end of patient doctors
*********************************************************************/



/*********************************************************************
 * start of patient messages
*********************************************************************/

    public function patientMessagesIndex(Request $request)
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

        return Inertia::render('patient/messages', [
            'users' => $users,
            'messages' => $messages,
            'selectedUserId' => $selectedUserId,
            'search' => $search,
            'authUserId' => $user->id,
        ]);
    }

    public function patientMessagesSend(Request $request)
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
 * end of patient messages
*********************************************************************/




/*********************************************************************
 * start of patient notifications
*********************************************************************/
    public function patientNotificationsIndex()
    {
        $user = auth()->user();

        $incoming = $user->notifications()->wherePivot('read', false)->orderByDesc('notifications.created_at')->get();
        $read = $user->notifications()->wherePivot('read', true)->orderByDesc('notifications.created_at')->get();

        return Inertia::render('patient/notifications', [
            'incoming' => $incoming,
            'read' => $read,
        ]);
    }

    public function patientMarkNotificationRead($notificationId)
    {
        $user = auth()->user();
        $user->notifications()->updateExistingPivot($notificationId, [
            'read' => true,
            'read_at' => now(),
        ]);
        return back();
    }
/*********************************************************************
 * end of patient notifications
*********************************************************************/


/*********************************************************************
 * start of patient billing
*********************************************************************/

public function patientBillingIndex(Request $request)
{
    $bills = auth()->user()->patient->bills()
        ->with(['billable', 'paymentOption'])
        ->when($request->search, fn($q, $search) => $q->where('id', $search))
        ->when($request->status, fn($q, $status) => $q->where('status', $status))
        ->orderByDesc('created_at')
        ->paginate(15)
        ->withQueryString();

    $paymentOptions = PaymentOption::latest()->get();

    return Inertia::render('patient/billing', [
        'bills' => $bills,
        'paymentOptions' => $paymentOptions,
        'filters' => $request->only(['search', 'status']),
    ]);
}


public function verifyPayment(Request $request, Bill $bill)
{
    $request->validate([
        'payment_option_id' => 'required|exists:payment_options,id',
        'payment_proof' => 'required|image|max:4096',
    ]);

    $bill->update([
        'payment_option_id' => $request->payment_option_id,
        'payment_proof_path' => $request->file('payment_proof')->store('payment_proofs', 'public'),
        'status' => 'Paid',
        'paid_at' => now(),
    ]);

    return redirect()->back()->with('success', 'Payment submitted for verification.');
}

/*********************************************************************
 * end of patient billing
*********************************************************************/


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
