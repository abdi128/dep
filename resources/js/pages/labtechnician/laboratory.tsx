import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Pencil, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Lab Tests', href: '/labtechnician/laboratory' },
];

const statusColors = {
  Pending: 'text-yellow-600',
  Processing: 'text-blue-600',
  Complete: 'text-green-600',
  Cancelled: 'text-red-600',
};

export default function LabTechnicianLaboratory({ labTests, labTechnicianId }) {
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Edit lab test form
  const {
    data: editData,
    setData: setEditData,
    put,
    processing: editProcessing,
    errors: editErrors,
    reset: resetEdit,
  } = useForm({
    test_result: '',
    status: '',
    notes: '',
  });

  function openViewModal(test) {
    setSelectedTest(test);
    setOpenView(true);
  }

function openEditModal(test) {
  setSelectedTest(test);
  setEditData({
    test_result: test.test_result || '',
    // If the current status is Pending, default to Processing for editing
    status: test.status === 'Pending' ? 'Processing' : test.status,
    notes: test.notes || '',
  });
  setOpenEdit(true);
}

  function submitEdit(e) {
    e.preventDefault();
    put(route('labtechnician.laboratory.update', selectedTest.id), {
      onSuccess: () => {
        resetEdit();
        setOpenEdit(false);
      },
    });
  }


  function cancelLabTest(test) {
  if (!window.confirm('Are you sure you want to cancel this lab test?')) return;
  router.post(route('labtechnician.laboratory.cancel', test.id));
}

  function canEditOrCancel(test) {
    return test.labtechnician_id === labTechnicianId && test.status !== 'Cancelled' && test.status !== 'Complete';
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lab Tests" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Lab Tests</h1>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
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
                      {test.doctor?.first_name || ''} {test.doctor?.last_name || ''}
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
                      {canEditOrCancel(test) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit"
                            onClick={() => openEditModal(test)}
                            className="hover:text-green-600"
                          >
                            <Pencil className="h-5 w-5" />
                          </Button>
                          {test.status === 'Pending' || test.status === 'Processing' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Cancel"
                              onClick={() => cancelLabTest(test)}
                              className="hover:text-red-600"
                            >
                              <XCircle className="h-5 w-5" />
                            </Button>
                          ) : null}
                        </>
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
                      <Label>Doctor:</Label>
                      <p>{selectedTest.doctor?.first_name || ''} {selectedTest.doctor?.last_name || ''}</p>
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

          {/* Edit Modal */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Lab Test</DialogTitle>
              </DialogHeader>
              {selectedTest && (
                <form onSubmit={submitEdit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient:</Label>
                      <p>{selectedTest.patient?.first_name || ''} {selectedTest.patient?.last_name || ''}</p>
                    </div>
                    <div>
                      <Label>Doctor:</Label>
                      <p>{selectedTest.doctor?.first_name || ''} {selectedTest.doctor?.last_name || ''}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Test Type:</Label>
                    <p>{selectedTest.test_type}</p>
                  </div>
                  <div>
                    <Label>Status:</Label>
                    <select
                      id="status"
                      value={editData.status}
                      onChange={e => setEditData('status', e.target.value)}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="Processing" disabled={selectedTest.status === 'Complete' || selectedTest.status === 'Cancelled'}>Processing</option>
                      <option value="Complete" disabled={selectedTest.status === 'Cancelled'}>Complete</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {editErrors.status && (
                      <p className="text-red-600">{editErrors.status}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="test_result">Test Result</Label>
                    <Textarea
                      id="test_result"
                      value={editData.test_result}
                      onChange={e => setEditData('test_result', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editData.notes}
                      onChange={e => setEditData('notes', e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={editProcessing} className="w-full">
                    {editProcessing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
