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
  { title: 'Lab Tests', href: '/admin/laboratory' },
];

const statusColors = {
  Pending: 'text-yellow-600',
  Processing: 'text-blue-600',
  Complete: 'text-green-600',
  Cancelled: 'text-red-600',
};

export default function AdminLaboratory({ labTests }) {
  const [openView, setOpenView] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  function openViewModal(test) {
    setSelectedTest(test);
    setOpenView(true);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lab Tests" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">All Lab Tests</h1>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lab Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labTests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.labtechnician?.first_name || ''} {test.labtechnician?.last_name || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{test.test_type}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${statusColors[test.status]}`}>
                      {test.status}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View"
                        onClick={() => openViewModal(test)}
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
                <DialogTitle>Lab Test Details</DialogTitle>
              </DialogHeader>
              {selectedTest && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Patient:</Label>
                      <p>
                        {selectedTest.patient?.first_name || ''} {selectedTest.patient?.last_name || ''}
                      </p>
                    </div>
                    <div>
                      <Label>Doctor:</Label>
                      <p>
                        {selectedTest.doctor?.first_name || ''} {selectedTest.doctor?.last_name || ''}
                      </p>
                    </div>
                    <div>
                      <Label>Lab Technician:</Label>
                      <p>
                        {selectedTest.labtechnician?.first_name || ''} {selectedTest.labtechnician?.last_name || ''}
                      </p>
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
