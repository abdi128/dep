import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, KeyRound, Clock, Ban, Check, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Patients', href: '/doctor/patients' },
  { title: 'Patient Detail', href: '#' },
];

export default function DoctorPatientDetail({ patient, medicalRecords }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Create Medical Record form
  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    processing: createProcessing,
    errors: createErrors,
    reset: resetCreate,
  } = useForm({
    title: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  function handleRequestAccess(recordId) {
    router.post(route('doctor.medicalrecords.request_access', { record: recordId }), {}, {
      preserveScroll: true,
    });
  }

  function openViewModal(record) {
    setSelectedRecord(record);
    setViewOpen(true);
  }

  function openCreateModal() {
    resetCreate();
    setCreateOpen(true);
  }

  function submitCreate(e) {
    e.preventDefault();
    createPost(
      route('doctor.medicalrecords.create', { id: patient.id }),
      {
        onSuccess: () => {
          resetCreate();
          setCreateOpen(false);
        },
      }
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Patient Detail" />
      <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-8 bg-background shadow-md flex flex-col gap-8">
          {/* Patient Profile Section */}
          <div className="relative flex flex-col md:flex-row items-center md:items-stretch gap-8 bg-gradient-to-tr from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 border border-blue-100 dark:border-blue-900 shadow-lg rounded-2xl p-8 mb-4">
  {/* Patient Avatar (Initials) */}
  <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 text-4xl font-bold shadow-inner border-4 border-white dark:border-blue-900">
    {patient.first_name?.[0]?.toUpperCase()}
  </div>

  {/* Patient Details */}
  <div className="flex-1 flex flex-col justify-center">
    <div className="flex flex-wrap gap-x-8 gap-y-2 items-center mb-2">
      <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
        {patient.first_name} {patient.last_name}
      </h2>
      <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs font-mono tracking-wider">
        Reg. No: {patient.registration_number}
      </span>
    </div>
    <div className="flex flex-wrap gap-x-8 gap-y-1 text-gray-700 dark:text-blue-200 text-base">
      <div>
        <span className="font-semibold">DOB:</span> {patient.date_of_birth}
      </div>
      <div>
        <span className="font-semibold">Gender:</span> {patient.gender}
      </div>
      <div>
        <span className="font-semibold">Phone:</span> {patient.phone_number}
      </div>
      <div>
        <span className="font-semibold">Email:</span> {patient.user?.email || 'N/A'}
      </div>
      <div>
        <span className="font-semibold">Address:</span> {patient.address}
      </div>
    </div>
  </div>

  {/* Create Medical Record Button */}
  <div className="flex flex-col items-center justify-center">
    <Button
      variant="default"
      size="lg"
      className="flex items-center gap-2 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
      onClick={openCreateModal}
    >
      <Plus className="h-5 w-5" />
      Create Medical Record
    </Button>
  </div>
</div>

          {/* Medical Records Table */}
          <div className="rounded-xl shadow bg-white border p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Medical Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Created At</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicalRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                        No medical records found.
                      </td>
                    </tr>
                  )}
                  {medicalRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3">{record.title}</td>
                      <td className="px-4 py-3 truncate max-w-xs">{record.diagnosis}</td>
                      <td className="px-4 py-3">{record.creator?.first_name} {record.creator?.last_name}</td>
                      <td className="px-4 py-3">{new Date(record.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">
                        {record.access_status === 'creator' || record.access_status === 'granted' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View"
                            onClick={() => openViewModal(record)}
                            className="hover:text-blue-600"
                          >
                            <Eye className="h-5 w-5" />
                            <span className="ml-2">View</span>
                          </Button>
                        ) : record.access_status === 'pending' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="text-yellow-600 border-yellow-400"
                          >
                            <Clock className="h-4 w-4 mr-1" /> Requested
                          </Button>
                        ) : record.access_status === 'rejected' ? (
                          <>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled
                              className="mr-2"
                            >
                              <Ban className="h-4 w-4 mr-1" /> Rejected
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRequestAccess(record.id)}
                            >
                              <KeyRound className="h-4 w-4 mr-1" /> Request Again
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestAccess(record.id)}
                          >
                            <KeyRound className="h-4 w-4 mr-1" /> Request Access
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* View Medical Record Modal */}
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Medical Record Details</DialogTitle>
              </DialogHeader>
              {selectedRecord && (
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">Title:</span> {selectedRecord.title}
                  </div>
                  <div>
                    <span className="font-semibold">Diagnosis:</span>
                    <div className="whitespace-pre-wrap">{selectedRecord.diagnosis}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Treatment:</span>
                    <div className="whitespace-pre-wrap">{selectedRecord.treatment || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Notes:</span>
                    <div className="whitespace-pre-wrap">{selectedRecord.notes || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Created By:</span> {selectedRecord.creator?.first_name} {selectedRecord.creator?.last_name}
                  </div>
                  <div>
                    <span className="font-semibold">Created At:</span> {new Date(selectedRecord.created_at).toLocaleString()}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Create Medical Record Modal */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Medical Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitCreate} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={createData.title}
                    onChange={e => setCreateData('title', e.target.value)}
                    required
                  />
                  {createErrors.title && (
                    <div className="text-red-500 text-xs">{createErrors.title}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={createData.diagnosis}
                    onChange={e => setCreateData('diagnosis', e.target.value)}
                    required
                  />
                  {createErrors.diagnosis && (
                    <div className="text-red-500 text-xs">{createErrors.diagnosis}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea
                    id="treatment"
                    value={createData.treatment}
                    onChange={e => setCreateData('treatment', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={createData.notes}
                    onChange={e => setCreateData('notes', e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createProcessing}>
                  {createProcessing ? 'Creating...' : 'Create'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
