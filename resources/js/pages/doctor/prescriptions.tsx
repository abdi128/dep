import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Plus, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Prescriptions', href: '/doctor/prescriptions' },
];

export default function DoctorPrescriptions({ prescriptions, patients }) {
  const [openView, setOpenView] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const {
    data: newData,
    setData: setNewData,
    post,
    processing: newProcessing,
    errors: newErrors,
    reset: resetNew,
  } = useForm({
    patient_id: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    start_date: '',
    cost: '',
    end_date: '',
  });

  function openViewModal(prescription) {
    setSelectedPrescription(prescription);
    setOpenView(true);
  }

  function submitNew(e) {
    e.preventDefault();
    post(route('doctor.prescriptions.store'), {
      onSuccess: () => {
        resetNew();
        setOpenNew(false);
      },
    });
  }

  function cancelPrescription(prescription) {
    if (!window.confirm('Are you sure you want to cancel this prescription?')) return;
    router.post(route('doctor.prescriptions.cancel', prescription.id));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Prescriptions" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Prescriptions</h1>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create Prescription</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitNew} className="space-y-4">
                  <div>
                    <Label htmlFor="patient_id">Patient</Label>
                    <select
                      id="patient_id"
                      value={newData.patient_id}
                      onChange={e => setNewData('patient_id', e.target.value)}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="">Select patient...</option>
                      {(patients || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name} ({p.registration_number})
                        </option>
                      ))}
                    </select>
                    {newErrors.patient_id && <p className="text-red-600">{newErrors.patient_id}</p>}
                  </div>
                  <div>
                    <Label htmlFor="medication_name">Medication Name</Label>
                    <Input
                      id="medication_name"
                      value={newData.medication_name}
                      onChange={e => setNewData('medication_name', e.target.value)}
                      required
                    />
                    {newErrors.medication_name && <p className="text-red-600">{newErrors.medication_name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        value={newData.dosage}
                        onChange={e => setNewData('dosage', e.target.value)}
                        required
                      />
                      {newErrors.dosage && <p className="text-red-600">{newErrors.dosage}</p>}
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input
                        id="frequency"
                        value={newData.frequency}
                        onChange={e => setNewData('frequency', e.target.value)}
                        required
                      />
                      {newErrors.frequency && <p className="text-red-600">{newErrors.frequency}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newData.start_date}
                        onChange={e => setNewData('start_date', e.target.value)}
                        required
                      />
                      {newErrors.start_date && <p className="text-red-600">{newErrors.start_date}</p>}
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={newData.end_date}
                        onChange={e => setNewData('end_date', e.target.value)}
                      />
                      {newErrors.end_date && <p className="text-red-600">{newErrors.end_date}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      value={newData.cost}
                      onChange={e => setNewData('cost', e.target.value)}
                      required
                    />
                    {newErrors.cost && <p className="text-red-600">{newErrors.cost}</p>}
                  </div>
                  <Button type="submit" disabled={newProcessing} className="w-full">
                    {newProcessing ? 'Creating...' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Medication</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No prescriptions found.
                    </td>
                  </tr>
                )}
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prescription.patient?.first_name} {prescription.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{prescription.medication_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(prescription.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prescription.end_date ? new Date(prescription.end_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View"
                        onClick={() => openViewModal(prescription)}
                        className="hover:text-blue-600"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      {/* Cancel button: only show if prescription is not cancelled */}
                      {!prescription.end_date && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Cancel"
                          onClick={() => cancelPrescription(prescription)}
                          className="hover:text-red-600"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      )}
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
