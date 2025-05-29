import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'All Appointments', href: '/admin/appointments' },
];

const statusIcon = {
  approved: <CheckCircle className="h-5 w-5 text-green-600" title="Approved" />,
  pending: <Clock className="h-5 w-5 text-yellow-600" title="Pending" />,
  cancelled: <XCircle className="h-5 w-5 text-red-600" title="Cancelled" />,
};

export default function AdminAppointments({ appointments }) {
  const [openView, setOpenView] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  function openViewModal(appointment) {
    setSelectedAppointment(appointment);
    setOpenView(true);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Appointments" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-auto rounded-xl border md:min-h-min p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">All Appointments</h1>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                )}
                {appointments.map((appt) => {
                  const startDate = appt.date ? new Date(`${appt.date}T${appt.start_time}`) : null;
                  return (
                    <tr key={appt.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {appt.patient?.first_name} {appt.patient?.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {appt.doctor?.first_name} {appt.doctor?.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {appt.date ? new Date(appt.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {appt.start_time && appt.end_time
                          ? `${appt.start_time} - ${appt.end_time}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                        {statusIcon[appt.appointment_status] || (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="capitalize">{appt.appointment_status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Appointment"
                          onClick={() => openViewModal(appt)}
                          className="hover:text-blue-600"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* View Modal */}
          <Dialog open={openView} onOpenChange={setOpenView}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
              </DialogHeader>
              {selectedAppointment && (
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-3 mb-2">
                    {statusIcon[selectedAppointment.appointment_status]}
                    <span className="text-lg font-bold capitalize">{selectedAppointment.appointment_status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold">Patient:</span>
                      <div>{selectedAppointment.patient?.first_name} {selectedAppointment.patient?.last_name}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Doctor:</span>
                      <div>{selectedAppointment.doctor?.first_name} {selectedAppointment.doctor?.last_name}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Date:</span>
                      <div>{selectedAppointment.date ? new Date(selectedAppointment.date).toLocaleDateString() : '-'}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Time:</span>
                      <div>
                        {selectedAppointment.start_time && selectedAppointment.end_time
                          ? `${selectedAppointment.start_time} - ${selectedAppointment.end_time}`
                          : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span>
                      <div>{selectedAppointment.duration ? `${selectedAppointment.duration} mins` : '-'}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Doctor Status:</span>
                      <div>{selectedAppointment.doctor_status}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Patient Status:</span>
                      <div>{selectedAppointment.patient_status}</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Notes:</span>
                    <div>{selectedAppointment.notes || 'None'}</div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenView(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
