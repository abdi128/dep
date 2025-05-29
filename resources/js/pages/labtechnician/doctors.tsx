import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Doctors', href: '/labtechnician/doctors' },
];

export default function LabTechnicianDoctors({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  function openProfileModal(doctor) {
    setSelectedDoctor(doctor);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Doctors" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[70vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Doctors</h1>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">License No.</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Specialty</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No doctors found.
                    </td>
                  </tr>
                )}
                {doctors.map((doctor, idx) => (
                  <tr key={doctor.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.license_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {doctor.first_name} {doctor.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.specialty}</td>                
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Profile"
                        onClick={() => openProfileModal(doctor)}
                        className="hover:text-blue-600"
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
          <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Doctor Profile</DialogTitle>
              </DialogHeader>
              {selectedDoctor && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-800">
                      {selectedDoctor.first_name?.[0]?.toUpperCase()}
                      {selectedDoctor.last_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xl font-semibold">
                        {selectedDoctor.first_name} {selectedDoctor.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{selectedDoctor.user?.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-gray-600">Phone</div>
                      <div>{selectedDoctor.phone_number}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Specialty</div>
                      <div>{selectedDoctor.specialty}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">License No.</div>
                      <div>{selectedDoctor.license_number}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Created At</div>
                      <div>{new Date(selectedDoctor.created_at).toLocaleDateString()}</div>
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
