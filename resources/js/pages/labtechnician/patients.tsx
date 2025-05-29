import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Patients', href: '/labtechnician/patients' },
];

export default function LabTechnicianPatients({ patients }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  function openProfileModal(patient) {
    setSelectedPatient(patient);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Patients" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[70vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Patients</h1>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reg. No.</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
                {patients.map((patient, idx) => (
                  <tr key={patient.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{patient.registration_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.phone_number}</td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Profile"
                        onClick={() => openProfileModal(patient)}
                        className="hover:text-white"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Profile Modal */}
          <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Patient Profile</DialogTitle>
              </DialogHeader>
              {selectedPatient && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-800">
                      {selectedPatient.first_name?.[0]?.toUpperCase()}
                      {selectedPatient.last_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xl font-semibold">
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{selectedPatient.user?.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-gray-600">Phone</div>
                      <div>{selectedPatient.phone_number}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Reg. No.</div>
                      <div>{selectedPatient.registration_number}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Gender</div>
                      <div>{selectedPatient.gender}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">DOB</div>
                      <div>{selectedPatient.date_of_birth}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="font-semibold text-gray-600">Address</div>
                      <div>{selectedPatient.address}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="font-semibold text-gray-600">Created At</div>
                      <div>{new Date(selectedPatient.created_at).toLocaleDateString()}</div>
                    </div>
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
