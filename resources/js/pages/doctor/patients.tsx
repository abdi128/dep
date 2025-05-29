import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Patients', href: '/doctor/patients' },
];

export default function DoctorPatients({ patients, search }) {
  const [searchValue, setSearchValue] = useState(search || '');

  function handleSearch(e) {
    e.preventDefault();
    router.get(route('doctor.patients.index'), { search: searchValue }, {
      replace: true,
      preserveScroll: true,
    });
  }

  function goToProfile(patientId) {
    router.get(route('doctor.patientdetail', { id: patientId }));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Patients" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[70vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-semibold">Patients</h1>

          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reg. No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{patient.registration_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.user?.email || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.phone_number}</td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Go to Profile"
                        onClick={() => goToProfile(patient.id)}
                        className="hover:text-blue-600"
                      >
                        <Eye className="h-5 w-5" />
                        <span className="ml-2">View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
