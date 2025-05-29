import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
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
import { Eye, Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Billing', href: '/patient/billing' },
];

const statusColors = {
  'Not Paid': 'text-yellow-600',
  Paid: 'text-blue-600',
  Verified: 'text-green-600',
  Invalid: 'text-red-600',
};

export default function PatientBilling({ bills, paymentOptions, filters }) {
  const [viewBill, setViewBill] = useState(null);
  const [verifyBill, setVerifyBill] = useState(null);

  // Payment Verification Form
  const {
    data: verifyData,
    setData: setVerifyData,
    post: postVerify,
    processing: verifyProcessing,
    errors: verifyErrors,
    reset: resetVerify,
  } = useForm({
    payment_option_id: '',
    payment_proof: null,
    confirmed: false,
  });

  function openVerifyModal(bill) {
    setVerifyBill(bill);
    resetVerify();
  }

  function submitVerify(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('payment_option_id', verifyData.payment_option_id);
    formData.append('payment_proof', verifyData.payment_proof);
    formData.append('confirmed', verifyData.confirmed ? '1' : '0');
    postVerify(route('patient.billing.verify', verifyBill.id), {
      data: formData,
      onSuccess: () => setVerifyBill(null),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Bills" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-semibold">My Bills</h1>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No bills found.
                    </td>
                  </tr>
                )}
                {bills.data.map((bill) => (
                  <tr key={bill.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.billable_type.split('\\').pop()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{bill.amount} ETB</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${statusColors[bill.status]}`}>{bill.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(bill.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View"
                        onClick={() => setViewBill(bill)}
                        className="hover:text-blue-600"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      {bill.status === 'Not Paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openVerifyModal(bill)}
                        >
                          Verify Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bill Detail Modal */}
          <Dialog open={!!viewBill} onOpenChange={() => setViewBill(null)}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bill Details</DialogTitle>
              </DialogHeader>
              {viewBill && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Service:</Label>
                      <p>{viewBill.billable_type.split('\\').pop()}</p>
                    </div>
                    <div>
                      <Label>Amount:</Label>
                      <p>{viewBill.amount} ETB</p>
                    </div>
                    <div>
                      <Label>Status:</Label>
                      <span className={statusColors[viewBill.status]}>{viewBill.status}</span>
                    </div>
                    <div>
                      <Label>Date:</Label>
                      <p>{new Date(viewBill.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {viewBill.payment_proof_path && (
                    <div>
                      <Label>Payment Proof:</Label>
                      <img
                        src={`/storage/${viewBill.payment_proof_path}`}
                        alt="Payment proof"
                        className="max-h-72 rounded border"
                      />
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Verify Payment Modal */}
          <Dialog open={!!verifyBill} onOpenChange={() => setVerifyBill(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitVerify} className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <select
                    className="w-full rounded border p-2"
                    value={verifyData.payment_option_id}
                    onChange={e => setVerifyData('payment_option_id', e.target.value)}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    {paymentOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.payment_method} ({option.account_number})
                      </option>
                    ))}
                  </select>
                  {verifyErrors.payment_option_id && (
                    <div className="text-red-500 text-xs">{verifyErrors.payment_option_id}</div>
                  )}
                </div>
                <div>
                  <Label>Upload Payment Proof</Label>
                  <Input
                    type="file"
                    onChange={e => setVerifyData('payment_proof', e.target.files[0])}
                    required
                  />
                  {verifyErrors.payment_proof && (
                    <div className="text-red-500 text-xs">{verifyErrors.payment_proof}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="confirm-payment"
                    checked={verifyData.confirmed}
                    onChange={e => setVerifyData('confirmed', e.target.checked)}
                    required
                  />
                  <label htmlFor="confirm-payment" className="text-sm">
                    I confirm I have made this payment
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={verifyProcessing}>
                  {verifyProcessing ? 'Submitting...' : 'Submit Verification'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
