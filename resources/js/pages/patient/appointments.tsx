import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'My Appointments', href: '/patient/appointments' },
];

function AppointmentModal({ appointment, open, onClose }) {
  if (!open || !appointment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg p-6 min-w-[320px] max-w-[95vw]">
        <h2 className="text-lg font-bold mb-4">Appointment Details</h2>
        <div className="mb-2">
          <span className="font-semibold">Doctor:</span> {appointment.doctor_name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">License #:</span> {appointment.doctor_license_number}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Date:</span> {appointment.date}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Time:</span> {appointment.start_time} - {appointment.end_time}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Status:</span> {appointment.status}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Reason:</span> {appointment.reason || '-'}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export default function PatientAppointments({ appointments: initialAppointments, filters }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [viewModal, setViewModal] = useState(false);
  const [viewAppointment, setViewAppointment] = useState(null);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    router.get(route('patient.appointments'), { search: e.target.value }, { preserveState: true, replace: true });
  }

  function handleView(appt) {
    setViewAppointment(appt);
    setViewModal(true);
  }

  function closeModal() {
    setViewModal(false);
    setViewAppointment(null);
  }

  function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel the appointment?')) return;
    router.post(route('patient.appointments.cancel', id), {}, {
      onSuccess: () => {
        toast.success('Appointment cancelled');
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'cancelled' } : appt
          )
        );
      },
      onError: () => toast.error('Failed to cancel appointment'),
      preserveScroll: true,
    });
  }

  function rescheduleAppointment(appt) {
    router.visit(route('patient.appointmentbooking', { doctor: appt.doctor_id, appointment_id: appt.id }), { preserveScroll: true });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Appointments" />
      <Toaster position="top-right" richColors />
      <AppointmentModal appointment={viewAppointment} open={viewModal} onClose={closeModal} />
      <div id="pttas" className="p-6 border-sidebar-border/70 dark:border-sidebar-border min-h-[100vh] rounded-xl border">
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search by doctor name, license number, or email..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Doctor</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Start Time</th>
              <th className="px-6 py-3 text-left font-semibold">End Time</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">No appointments found.</td>
              </tr>
            )}
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{appt.doctor_name}</td>
                <td className="px-6 py-3">{appt.date}</td>
                <td className="px-6 py-3">{appt.start_time}</td>
                <td className="px-6 py-3">{appt.end_time}</td>
                <td className="px-6 py-3">{appt.status}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(appt)}>
                    View
                  </Button>
                  {appt.status !== 'cancelled' && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => rescheduleAppointment(appt)}>
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => cancelAppointment(appt.id)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
