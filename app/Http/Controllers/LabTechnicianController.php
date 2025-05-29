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

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class LabTechnicianController extends Controller
{
/*********************************************************************
 * start of labtechnician dashboard
*********************************************************************/
public function labtechnicianDashboardIndex()
{
    $labTechnician = auth()->user()->labTechnician;
    return Inertia::render('labtechnician/dashboard', [
        'stats' => [
            'labtests' => \App\Models\LabTest::where('labtechnician_id', $labTechnician->id)->count(),
            'patients' => \App\Models\Patient::count(),
            'doctors' => \App\Models\Doctor::count(),
            'notifications' => auth()->user()->notifications()->wherePivot('read', false)->count(),
        ],
    ]);
}

/*********************************************************************
 * end of labtechnican dashboard
*********************************************************************/



/*********************************************************************
 * start of labtechnician laboratory
*********************************************************************/

    public function labtechnicianLaboratoryIndex()
    {
        $labTechnician = auth()->user()->labTechnician;
        if (!$labTechnician) {
            abort(403, 'No lab technician profile associated with this user.');
        }
        $labTests = LabTest::with(['patient', 'doctor', 'labTechnician'])
            ->orderBy('request_date', 'desc')->latest()
            ->get();
        return inertia('labtechnician/laboratory', [
            'labTests' => $labTests,
            'labTechnicianId' => $labTechnician->id,
        ]);
    }

    public function labtechnicianLaboratoryUpdate(Request $request, LabTest $labTest)
    {
        $labTechnician = auth()->user()->labTechnician;
        if ($labTest->labtechnician_id !== $labTechnician->id) {
            abort(403, 'Unauthorized');
        }
        $request->validate([
            'test_result' => 'nullable|string',
            'status' => 'required|in:Processing,Cancelled,Complete',
            'notes' => 'nullable|string',
        ]);
        // Prevent reverting status to Pending
        if ($labTest->status !== 'Pending' && $request->status === 'Pending') {
            return back()->withErrors(['status' => 'Cannot revert to Pending.']);
        }
        $labTest->update([
            'test_result' => $request->test_result,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);
        return redirect()->route('labtechnician.laboratory.index')->with('success', 'Lab test updated.');
    }

    public function labtechnicianLaboratoryCancel(LabTest $labTest)
    {
        $labTechnician = auth()->user()->labTechnician;
        if ($labTest->labtechnician_id !== $labTechnician->id) {
            abort(403, 'Unauthorized');
        }
        $labTest->update(['status' => 'Cancelled']);
        return redirect()->route('labtechnician.laboratory.index')->with('success', 'Lab test cancelled.');
    }
/*********************************************************************
 * end of labtechnician laboratory
*********************************************************************/




/*********************************************************************
 * start of labtechnician doctors
*********************************************************************/
public function labtechnicianDoctorsIndex()
{
    $doctors = \App\Models\Doctor::with('user')->orderBy('created_at', 'desc')->get();
    return inertia('labtechnician/doctors', [
        'doctors' => $doctors,
    ]);
}

/*********************************************************************
 * end of labtechnician doctors
*********************************************************************/



/*********************************************************************
 * start of labtechnician patients
*********************************************************************/

public function labtechnicianPatientsIndex()
{
    $patients = \App\Models\Patient::with('user')->orderBy('created_at', 'desc')->get();
    return inertia('labtechnician/patients', [
        'patients' => $patients,
    ]);
}

/*********************************************************************
 * end of labtechnician patients
*********************************************************************/



/*********************************************************************
 * start of labtechnician messages
*********************************************************************/

     public function labtechnicianMessagesIndex(Request $request)
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

        return Inertia::render('labtechnician/messages', [
            'users' => $users,
            'messages' => $messages,
            'selectedUserId' => $selectedUserId,
            'search' => $search,
            'authUserId' => $user->id,
        ]);
    }

    public function labtechnicianMessagesSend(Request $request)
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
 * end of labtechnician messages
*********************************************************************/



/*********************************************************************
 * start of labtechnician notifications
*********************************************************************/
    public function labtechnicianNotificationsIndex()
    {
        $user = auth()->user();

        $incoming = $user->notifications()->wherePivot('read', false)->orderByDesc('notifications.created_at')->get();
        $read = $user->notifications()->wherePivot('read', true)->orderByDesc('notifications.created_at')->get();

        return Inertia::render('labtechnician/notifications', [
            'incoming' => $incoming,
            'read' => $read,
        ]);
    }

    public function labtechnicianMarkNotificationRead($notificationId)
    {
        $user = auth()->user();
        $user->notifications()->updateExistingPivot($notificationId, [
            'read' => true,
            'read_at' => now(),
        ]);
        return back();
    }
/*********************************************************************
 * end of labtechnician notifications
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
