<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Admin;
use App\Models\Doctor;
use App\Models\Bill;
use App\Models\LabTest;
use App\Models\LabTechnician;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Prescription;
use App\Models\MedicalRecord;

use App\Models\Schedule;
use App\Models\TimeSlot;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class DoctorController extends Controller
{
/*********************************************************************
 * start of Doctor dashboard
*********************************************************************/
    public function doctorDashboardIndex()
    {
        $doctor = auth()->user()->doctor;
        return Inertia::render('doctor/dashboard', [
            'stats' => [
                'patients' => \App\Models\Patient::count(), // Or only those assigned to doctor
                'medicalrecords' => \App\Models\MedicalRecord::where('doctor_id', $doctor->id)->count(),
                'labtests' => \App\Models\LabTest::where('doctor_id', $doctor->id)->count(),
                'prescriptions' => \App\Models\Prescription::where('doctor_id', $doctor->id)->count(),
            ],
        ]);
    }

/*********************************************************************
 * End of Doctor dashboard
*********************************************************************/



/*********************************************************************
 * start of Doctor patients
*********************************************************************/
    public function doctorPatientsIndex(Request $request)
    {
        $search = $request->input('search');

        $patients = \App\Models\Patient::with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('registration_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('email', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('doctor/patients', [
            'patients' => $patients,
            'search' => $search,
        ]);
    }
/*********************************************************************
 * End of Doctor patients
*********************************************************************/

/*********************************************************************
 * start of Doctor patientdetail
*********************************************************************/

    public function doctorPatientdetailIndex($id)
    {
        $doctor = auth()->user()->doctor;
        $patient = \App\Models\Patient::with('user')->findOrFail($id);

        // All medical records for this patient
        $medicalRecords = \App\Models\MedicalRecord::where('patient_id', $patient->id)
            ->with('creator')
            ->get()
            ->map(function ($record) use ($doctor) {
                // Check access
                $access = $record->accesses()->where('doctor_id', $doctor->id)->first();
                $record->access_status = null;
                if ($record->doctor_id == $doctor->id) {
                    $record->access_status = 'creator';
                } elseif ($access) {
                    $record->access_status = $access->status;
                }
                return $record;
            });

        return Inertia::render('doctor/patientdetail', [
            'patient' => $patient,
            'medicalRecords' => $medicalRecords,
        ]);
    }

    public function createMedicalRecord(Request $request, $patientId)
    {
        $doctor = auth()->user()->doctor;
        $patient = \App\Models\Patient::findOrFail($patientId);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'diagnosis' => 'required|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $record = \App\Models\MedicalRecord::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'title' => $data['title'],
            'diagnosis' => $data['diagnosis'],
            'treatment' => $data['treatment'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        // Creator has access by default (no entry needed in access table, or you can add one with 'granted' if you wish)
        return back();
    }

    public function requestMedicalRecordAccess($recordId)
    {
        $doctor = auth()->user()->doctor;
        $record = \App\Models\MedicalRecord::findOrFail($recordId);

        // Prevent duplicate requests
        $access = \App\Models\MedicalRecordAccess::firstOrCreate(
            [
                'medical_record_id' => $record->id,
                'doctor_id' => $doctor->id,
            ],
            [
                'status' => 'pending',
            ]
        );

        // If previously rejected, allow re-request
        if ($access->status === 'rejected') {
            $access->update(['status' => 'pending']);
        }

        return back();
    }

/*********************************************************************
 * End of Doctor patientdetail
*********************************************************************/



/*********************************************************************
 * start of Doctor laboratory
*********************************************************************/

    public function doctorLaboratoryIndex()
    {
        $doctor = auth()->user()->doctor;
        $patients = Patient::all(['id', 'first_name', 'last_name']);
        $labTechnicians = LabTechnician::all(['id', 'first_name', 'last_name']);
        $labTests = LabTest::with(['patient', 'doctor', 'labTechnician'])
            ->where('doctor_id', $doctor->id)
            ->orderBy('request_date', 'desc')->latest()
            ->get();

        return inertia('doctor/laboratory', [
            'labTests' => $labTests,
            'patients' => $patients,
            'labTechnicians' => $labTechnicians,
        ]);
    }

    public function doctorLaboratoryRequest(Request $request)
    {
        $doctor = auth()->user()->doctor;
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'labtechnician_id' => 'required|exists:lab_technicians,id',
            'test_type' => 'required|string|max:255',
            'cost' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);
        LabTest::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $request->patient_id,
            'labtechnician_id' => $request->labtechnician_id,
            'test_type' => $request->test_type,
            'test_result' => '',
            'request_date' => now()->toDateString(),
            'cost' => $request->cost,
            'status' => 'Pending',
            'notes' => $request->notes,
        ]);
        return redirect()->route('doctor.laboratory.index')->with('success', 'Lab test requested.');
    }

    public function doctorLaboratoryCancel(LabTest $labTest)
    {
        $doctor = auth()->user()->doctor;
        if ($labTest->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }
        $labTest->update(['status' => 'Cancelled']);
        return redirect()->route('doctor.laboratory.index')->with('success', 'Lab test cancelled.');
    }

/*********************************************************************
 * End of Doctor laboratory
*********************************************************************/



/*********************************************************************
 * start of Doctor prescriptions
*********************************************************************/
    public function doctorPrescriptionsIndex()
    {
        $doctor = auth()->user()->doctor;

        $prescriptions = Prescription::with(['patient', 'doctor'])
            ->where('doctor_id', $doctor->id)
            ->orderBy('created_at', 'desc')->latest()
            ->get();

        // Add this line to fetch patients
        $patients = Patient::with('user')->get();

        return Inertia::render('doctor/prescriptions', [
            'prescriptions' => $prescriptions,
            'patients' => $patients, // Pass patients to frontend
        ]);
    }

    public function doctorPrescriptionsStore(Request $request)
    {
        $doctor = auth()->user()->doctor;

        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medication_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'frequency' => 'required|string|max:255',
            'start_date' => 'required|date|before_or_equal:today',
            'cost' => 'required|string|max:255',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Prescription::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $request->patient_id,
            'medication_name' => $request->medication_name,
            'dosage' => $request->dosage,
            'frequency' => $request->frequency,
            'start_date' => $request->start_date,
            'cost' => $request->cost,
            'end_date' => $request->end_date,
        ]);

        return redirect()->route('doctor.prescriptions.index')->with('success', 'Prescription created successfully.');
    }

    public function doctorPrescriptionsCancel(Prescription $prescription)
    {
        $doctor = Auth::user()->doctor;

        if ($prescription->doctor_id !== $doctor->id) {
            abort(403, 'Unauthorized');
        }

        // Cancel by setting end_date to today if not already ended
        if (!$prescription->end_date || $prescription->end_date > now()->toDateString()) {
            $prescription->update(['end_date' => now()->toDateString()]);
        }

        return redirect()->route('doctor.prescriptions.index')->with('success', 'Prescription cancelled successfully.');
    }
/*********************************************************************
 * End of Doctor prescriptions
*********************************************************************/




/*********************************************************************
 * start of Doctor messages
*********************************************************************/

    public function doctorMessagesIndex(Request $request)
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

        return Inertia::render('doctor/messages', [
            'users' => $users,
            'messages' => $messages,
            'selectedUserId' => $selectedUserId,
            'search' => $search,
            'authUserId' => $user->id,
        ]);
    }

    public function doctorMessagesSend(Request $request)
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
 * End of Doctor messages
*********************************************************************/


/*********************************************************************
 * start of Doctor notifications
*********************************************************************/
    public function doctorNotificationsIndex()
    {
        $user = auth()->user();

        $incoming = $user->notifications()->wherePivot('read', false)->orderByDesc('notifications.created_at')->get();
        $read = $user->notifications()->wherePivot('read', true)->orderByDesc('notifications.created_at')->get();

        return Inertia::render('doctor/notifications', [
            'incoming' => $incoming,
            'read' => $read,
        ]);
    }

    public function doctorMarkNotificationRead($notificationId)
    {
        $user = auth()->user();
        $user->notifications()->updateExistingPivot($notificationId, [
            'read' => true,
            'read_at' => now(),
        ]);
        return back();
    }

/*********************************************************************
 * End of Doctor notifications
*********************************************************************/


/*********************************************************************
 * start of Doctor labtechnicians
*********************************************************************/
public function doctorLabtechniciansIndex()
{
    $labtechnicians = \App\Models\LabTechnician::with('user')->orderBy('created_at', 'desc')->get();
    return inertia('doctor/labtechnicians', [
        'labtechnicians' => $labtechnicians,
    ]);
}


/*********************************************************************
 * end of Doctor labtechnicians
*********************************************************************/




/*********************************************************************
 * start of Doctor appointments
*********************************************************************/
    // Show doctor schedule page with schedules & times
    public function doctorScheduleIndex()
    {
        $doctor = auth()->user()->doctor;

        $schedules = $doctor->schedules()
            ->with('timeSlots')
            ->where('date', '>=', now()->format('Y-m-d'))
            ->orderBy('date')
            ->get();

        return Inertia::render('doctor/schedule', [
            'schedules' => $schedules,
            'default_start_morning' => '09:00',
            'default_end_morning' => '12:30',
            'default_start_afternoon' => '13:30',
            'default_end_afternoon' => '17:00',
        ]);
    }

    // Update doctor schedule (dates + time slots)
    public function updateSchedule(Request $request)
    {
        $validated = $request->validate([
            'dates' => 'required|array|min:1',
            'dates.*' => 'date|after_or_equal:today',
            'morning_start' => 'required|date_format:H:i',
            'morning_end' => 'required|date_format:H:i|after:morning_start',
            'afternoon_start' => 'required|date_format:H:i|after:morning_end',
            'afternoon_end' => 'required|date_format:H:i|after:afternoon_start',
        ]);

        $doctor = auth()->user()->doctor;

        // Remove schedules not in new dates
        $doctor->schedules()
            ->whereNotIn('date', $validated['dates'])
            ->where('date', '>=', now()->format('Y-m-d'))
            ->each(function ($schedule) {
                $schedule->timeSlots()->delete();
                $schedule->delete();
            });

        foreach ($validated['dates'] as $date) {
            $schedule = $doctor->schedules()->firstOrCreate(['date' => $date]);
            $schedule->timeSlots()->delete();

            $this->createTimeSlots($schedule, $validated['morning_start'], $validated['morning_end'], 30);
            $this->createTimeSlots($schedule, $validated['afternoon_start'], $validated['afternoon_end'], 30);
        }

        return redirect()->back()->with('success', 'Schedule updated successfully.');
    }

    private function createTimeSlots($schedule, $start, $end, $interval)
    {
        $startTime = Carbon::parse($start);
        $endTime = Carbon::parse($end);

        while ($startTime < $endTime) {
            $slotEnd = (clone $startTime)->addMinutes($interval);
            if ($slotEnd > $endTime) {
                $slotEnd = $endTime;
            }

            $schedule->timeSlots()->create([
                'start_time' => $startTime->format('H:i:s'),
                'end_time' => $slotEnd->format('H:i:s'),
                'is_available' => true,
            ]);

            $startTime = $slotEnd;
        }
    }

    // Show doctor appointments with search functionality
    public function doctorAppointmentsIndex(Request $request)
    {
        $doctor = auth()->user()->doctor;
        $query = $doctor->appointments()->with(['patient', 'timeSlot.schedule'])->orderBy('created_at', 'desc');

        if ($search = $request->input('search')) {
            $query->whereHas('patient.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('patient', function ($q) use ($search) {
                $q->where('registration_number', 'like', "%{$search}%");
            });
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'patient_name' => $appointment->patient->first_name . ' ' . $appointment->patient->last_name,
                'patient_registration_number' => $appointment->patient->registration_number,
                'date' => $appointment->timeSlot->schedule->date,
                'start_time' => $appointment->timeSlot->start_time,
                'end_time' => $appointment->timeSlot->end_time,
                'status' => $appointment->status,
                'reason' => $appointment->reason,
                'created_at' => $appointment->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('doctor/appointments', [
            'appointments' => $appointments,
            'filters' => $request->only('search'),
        ]);
    }

    // Cancel appointment by doctor
    public function cancelAppointment(Request $request, $appointmentId)
    {
        $doctor = auth()->user()->doctor;
        $appointment = $doctor->appointments()->findOrFail($appointmentId);

        if ($appointment->status !== 'cancelled') {
            $appointment->status = 'cancelled';
            $appointment->save();
        }

        return redirect()->back()->with('success', 'Appointment cancelled successfully.');
    }

/*********************************************************************
 * End of Doctor Appointments
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
