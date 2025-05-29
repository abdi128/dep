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
import { Label } from '@/components/ui/label';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Prescriptions', href: '/admin/prescriptions' },
];

export default function AdminPrescriptions({ prescriptions }) {
  const [openView, setOpenView] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  function openViewModal(prescription) {
    setSelectedPrescription(prescription);
    setOpenView(true);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Prescriptions" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <h1 className="text-xl font-semibold mb-6">Prescriptions</h1>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Medication</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No prescriptions found.
                    </td>
                  </tr>
                )}
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prescription.patient?.first_name} {prescription.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prescription.doctor?.first_name} {prescription.doctor?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{prescription.medication_name}</td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View"
                        onClick={() => openViewModal(prescription)}
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
          {/* View Modal */}
          <Dialog open={openView} onOpenChange={setOpenView}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Prescription Details</DialogTitle>
              </DialogHeader>
              {selectedPrescription && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient:</Label>
                      <p>{selectedPrescription.patient?.first_name} {selectedPrescription.patient?.last_name}</p>
                    </div>
                    <div>
                      <Label>Doctor:</Label>
                      <p>{selectedPrescription.doctor?.first_name} {selectedPrescription.doctor?.last_name}</p>
                    </div>
                    <div>
                      <Label>Medication Name:</Label>
                      <p>{selectedPrescription.medication_name}</p>
                    </div>
                    <div>
                      <Label>Dosage:</Label>
                      <p>{selectedPrescription.dosage}</p>
                    </div>
                    <div>
                      <Label>Frequency:</Label>
                      <p>{selectedPrescription.frequency}</p>
                    </div>
                    <div>
                      <Label>Start Date:</Label>
                      <p>{new Date(selectedPrescription.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>End Date:</Label>
                      <p>{selectedPrescription.end_date ? new Date(selectedPrescription.end_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Cost:</Label>
                      <p>{selectedPrescription.cost}</p>
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
