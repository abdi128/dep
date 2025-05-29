import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Doctors', href: '/patient/doctors' },
];

export default function PatientDoctors({ doctors, filters }) {
  const [search, setSearch] = useState(filters?.search || '');

  function handleSearchChange(e) {
    setSearch(e.target.value);
    router.get(
      route('patient.doctors'),
      { search: e.target.value },
      { preserveState: true, replace: true }
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Doctors" />
      <Toaster position="top-right" richColors />
      <div id="pttas" className="p-6 border-sidebar-border/70 dark:border-sidebar-border min-h-[100vh] rounded-xl border">
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search by name, specialty, license number..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Specialty</th>
              <th className="px-6 py-3 text-left font-semibold">License #</th>
              <th className="px-6 py-3 text-left font-semibold">Phone</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{doctor.name}</td>
                <td className="px-6 py-3">{doctor.specialty}</td>
                <td className="px-6 py-3">{doctor.license_number}</td>
                <td className="px-6 py-3">{doctor.phone_number}</td>
                <td className="px-6 py-3 text-center">
                  <Button
                    onClick={() => router.visit(route('patient.appointmentbooking',{ doctor:doctor.id }))}
                    size="sm"
                  >
                    Book Appointment
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
