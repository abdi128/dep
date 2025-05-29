import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';
import { Eye, Plus, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Lab Tests', href: '/doctor/laboratory' },
];

const statusColors = {
  Pending: 'text-yellow-600',
  Processing: 'text-blue-600',
  Complete: 'text-green-600',
  Cancelled: 'text-red-600',
};

export default function DoctorLaboratory({ labTests, patients, labTechnicians }) {
  const [openNew, setOpenNew] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // New lab test form
  const {
    data: newData,
    setData: setNewData,
    post,
    processing: newProcessing,
    errors: newErrors,
    reset: resetNew,
  } = useForm({
    patient_id: '',
    labtechnician_id: '',
    test_type: '',
    cost: '',
    notes: '',
  });

  function submitNew(e) {
    e.preventDefault();
    post(route('doctor.laboratory.request'), {
      onSuccess: () => {
        resetNew();
        setOpenNew(false);
      },
    });
  }

  function openViewModal(test) {
    setSelectedTest(test);
    setOpenView(true);
  }

  function cancelLabTest(test) {
    if (!window.confirm('Are you sure you want to cancel this lab test?')) return;
    window.location.href = route('doctor.laboratory.cancel', test.id);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lab Tests" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Lab Tests</h1>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> New Lab Test
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Request Lab Test</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitNew} className="space-y-4">
                  <div>
                    <Label htmlFor="patient_id">Patient</Label>
                    <select
                      id="patient_id"
                      value={newData.patient_id}
                      onChange={(e) => setNewData('patient_id', e.target.value)}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name}
                        </option>
                      ))}
                    </select>
                    {newErrors.patient_id && (
                      <p className="text-red-600">{newErrors.patient_id}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="labtechnician_id">Lab Technician</Label>
                    <select
                      id="labtechnician_id"
                      value={newData.labtechnician_id}
                      onChange={(e) => setNewData('labtechnician_id', e.target.value)}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="">Select Lab Technician</option>
                      {labTechnicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.first_name} {tech.last_name}
                        </option>
                      ))}
                    </select>
                    {newErrors.labtechnician_id && (
                      <p className="text-red-600">{newErrors.labtechnician_id}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="test_type">Test Type</Label>
                    <Input
                      id="test_type"
                      value={newData.test_type}
                      onChange={(e) => setNewData('test_type', e.target.value)}
                      required
                    />
                    {newErrors.test_type && (
                      <p className="text-red-600">{newErrors.test_type}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost (ETB)</Label>
                    <Input
                      id="cost"
                      value={newData.cost}
                      onChange={(e) => setNewData('cost', e.target.value)}
                      required
                    />
                    {newErrors.cost && (
                      <p className="text-red-600">{newErrors.cost}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newData.notes}
                      onChange={(e) => setNewData('notes', e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={newProcessing} className="w-full">
                    {newProcessing ? 'Requesting...' : 'Request'}
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lab Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labTests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No lab tests found.
                    </td>
                  </tr>
                )}
                {labTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.patient?.first_name || ''} {test.patient?.last_name || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.lab_technician?.first_name || ''} {test.lab_technician?.last_name || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.test_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(test.request_date).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${statusColors[test.status]}`}>
                      {test.status}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View"
                        onClick={() => openViewModal(test)}
                        className="hover:text-blue-600"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      {test.status === 'Pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Cancel"
                          onClick={() => cancelLabTest(test)}
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
                <DialogTitle>Lab Test Details</DialogTitle>
              </DialogHeader>
              {selectedTest && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient:</Label>
                      <p>{selectedTest.patient?.first_name || ''} {selectedTest.patient?.last_name || ''}</p>
                    </div>
                    <div>
                      <Label>Lab Technician:</Label>
                      <p>{selectedTest.lab_technician?.first_name || ''} {selectedTest.lab_technician?.last_name || ''}</p>
                    </div>
                    <div>
                      <Label>Test Type:</Label>
                      <p>{selectedTest.test_type}</p>
                    </div>
                    <div>
                      <Label>Status:</Label>
                      <p className={statusColors[selectedTest.status]}>{selectedTest.status}</p>
                    </div>
                    <div>
                      <Label>Request Date:</Label>
                      <p>{new Date(selectedTest.request_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Cost:</Label>
                      <p>{selectedTest.cost || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Test Result:</Label>
                      <p className="whitespace-pre-wrap">{selectedTest.test_result || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Notes:</Label>
                      <p className="whitespace-pre-wrap">{selectedTest.notes || 'N/A'}</p>
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
