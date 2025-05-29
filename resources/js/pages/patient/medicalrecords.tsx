import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, X, Check, Ban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Medical Records', href: '/patient/medicalrecords' },
];

const tabs = [
  { key: 'records', label: 'Medical Records' },
  { key: 'access', label: 'Doctors with Access' },
  { key: 'pending', label: 'Pending Requests' },
];

export default function PatientMedicalRecords({ medicalRecords, grantedAccesses, pendingAccesses }) {
  const [tab, setTab] = useState('records');
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  function openViewModal(record) {
    setSelectedRecord(record);
    setViewOpen(true);
  }

  function handleGrant(accessId) {
    router.post(route('patient.medicalrecords.access.grant', { access: accessId }), {}, { preserveScroll: true });
  }
  function handleReject(accessId) {
    router.post(route('patient.medicalrecords.access.reject', { access: accessId }), {}, { preserveScroll: true });
  }
  function handleRevoke(accessId) {
    if (window.confirm('Are you sure you want to revoke access for this doctor?')) {
      router.post(route('patient.medicalrecords.access.revoke', { access: accessId }), {}, { preserveScroll: true });
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Medical Records" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[70vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === t.key
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === 'records' && (
            <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created At</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicalRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No medical records found.
                      </td>
                    </tr>
                  )}
                  {medicalRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{record.title}</td>
                      <td className="px-6 py-4">{record.diagnosis}</td>
                      <td className="px-6 py-4">{record.creator?.first_name} {record.creator?.last_name}</td>
                      <td className="px-6 py-4">{new Date(record.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'access' && (
            <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Medical Record</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Granted At</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grantedAccesses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No doctors with access.
                      </td>
                    </tr>
                  )}
                  {grantedAccesses.map((access) => (
                    <tr key={access.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{access.doctor?.first_name} {access.doctor?.last_name}</td>
                      <td className="px-6 py-4">{access.medical_record?.title}</td>
                      <td className="px-6 py-4">{new Date(access.updated_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(access.id)}
                        >
                          <X className="h-5 w-5 mr-2" /> Revoke Access
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'pending' && (
            <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Medical Record</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Requested At</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingAccesses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No pending requests.
                      </td>
                    </tr>
                  )}
                  {pendingAccesses.map((access) => (
                    <tr key={access.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{access.doctor?.first_name} {access.doctor?.last_name}</td>
                      <td className="px-6 py-4">{access.medical_record?.title}</td>
                      <td className="px-6 py-4">{new Date(access.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleGrant(access.id)}
                        >
                          <Check className="h-5 w-5 mr-2" /> Grant
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(access.id)}
                        >
                          <Ban className="h-5 w-5 mr-2" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Medical Record View Modal */}
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
      </div>
    </AppLayout>
  );
}
