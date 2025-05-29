import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Billing', href: '/admin/billing' },
];

const statusColors = {
  'Not Paid': 'text-yellow-600',
  Paid: 'text-blue-600',
  Verified: 'text-green-600',
  Invalid: 'text-red-600',
};

export default function AdminBilling({ bills, paymentOptions, appointmentPricings }) {
  const [tab, setTab] = useState('bills');
  const [viewBill, setViewBill] = useState(null);
  const [editOption, setEditOption] = useState(null);
  const [editPricing, setEditPricing] = useState(null);
  const [optionModal, setOptionModal] = useState(false);
  const [pricingModal, setPricingModal] = useState(false);

  // Payment Option Form
  const {
    data: optionData,
    setData: setOptionData,
    post: postOption,
    patch: patchOption,
    errors: optionErrors,
    reset: resetOption,
  } = useForm({
    payment_method: '',
    account_holder_name: '',
    account_number: '',
    logo: null,
  });

  // Pricing Form
  const {
    data: pricingData,
    setData: setPricingData,
    post: postPricing,
    errors: pricingErrors,
    reset: resetPricing,
  } = useForm({
    min_minutes: '',
    max_minutes: '',
    price: '',
  });

  function openOptionModal(option = null) {
    setEditOption(option);
    if (option) {
      setOptionData({
        payment_method: option.payment_method,
        account_holder_name: option.account_holder_name,
        account_number: option.account_number,
        logo: null,
      });
    } else {
      resetOption();
    }
    setOptionModal(true);
  }

  function openPricingModal(pricing = null) {
    setEditPricing(pricing);
    if (pricing) {
      setPricingData({
        min_minutes: pricing.min_minutes,
        max_minutes: pricing.max_minutes,
        price: pricing.price,
      });
    } else {
      resetPricing();
    }
    setPricingModal(true);
  }

  function submitOption(e) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(optionData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (editOption) {
      patchOption(route('admin.billing.payment_options.update', editOption.id), {
        data: formData,
        onSuccess: () => setOptionModal(false),
      });
    } else {
      postOption(route('admin.billing.payment_options.create'), {
        data: formData,
        onSuccess: () => setOptionModal(false),
      });
    }
  }

  function submitPricing(e) {
    e.preventDefault();
    postPricing(route('admin.billing.appointment_pricings.set'), {
      onSuccess: () => setPricingModal(false),
    });
  }

  function handleDeleteOption(option) {
    if (window.confirm('Delete this payment option?')) {
      router.delete(route('admin.billing.payment_options.delete', option.id));
    }
  }

  function handleUpdateStatus(bill, status) {
    router.patch(route('admin.billing.update_status', bill.id), { status }, { preserveScroll: true });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Billing" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-semibold">Billing</h1>
            <div className="flex gap-2">
              <Button
                variant={tab === 'bills' ? 'default' : 'outline'}
                onClick={() => setTab('bills')}
              >
                Bills
              </Button>
              <Button
                variant={tab === 'settings' ? 'default' : 'outline'}
                onClick={() => setTab('settings')}
              >
                Payment & Pricing Settings
              </Button>
            </div>
          </div>

          {/* Bills Tab */}
          {tab === 'bills' && (
            <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.data.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No bills found.
                      </td>
                    </tr>
                  )}
                  {bills.data.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bill.patient.first_name} {bill.patient.last_name}
                      </td>
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
                        <select
                          value={bill.status}
                          onChange={e => handleUpdateStatus(bill, e.target.value)}
                          className="rounded border p-1 text-xs"
                        >
                          {Object.keys(statusColors).map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payment & Pricing Settings Tab */}
          {tab === 'settings' && (
            <div className="grid md:grid-cols-1 gap-8">
              {/* Payment Options */}
              <div className="rounded-lg border shadow-md bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                  <Button onClick={() => openOptionModal()}><Plus className="h-4 w-4 mr-1" />Add</Button>
                </div>
                <div className="space-y-4">
                  {paymentOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-4">
                        {option.logo_path && (
                          <img src={`/storage/${option.logo_path}`} alt={option.payment_method} className="h-10 w-10 object-contain rounded" />
                        )}
                        <div>
                          <div className="font-medium">{option.payment_method}</div>
                          <div className="text-xs text-gray-500">{option.account_holder_name} - {option.account_number}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openOptionModal(option)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteOption(option)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Appointment Pricing */}

            </div>
          )}

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
                      <Label>Patient:</Label>
                      <p>{viewBill.patient?.user?.first_name} {viewBill.patient?.user?.last_name}</p>
                    </div>
                    <div>
                      <Label>Amount:</Label>
                      <p>{viewBill.amount} ETB</p>
                    </div>
                    <div>
                      <Label>Type:</Label>
                      <p>{viewBill.billable_type.split('\\').pop()}</p>
                    </div>
                    <div>
                      <Label>Status:</Label>
                      <span className={statusColors[viewBill.status]}>{viewBill.status}</span>
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

          {/* Payment Option Modal */}
          <Dialog open={optionModal} onOpenChange={setOptionModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editOption ? 'Edit Payment Method' : 'New Payment Method'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitOption} className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <Input
                    value={optionData.payment_method}
                    onChange={e => setOptionData('payment_method', e.target.value)}
                    required
                  />
                  {optionErrors.payment_method && (
                    <div className="text-red-500 text-xs">{optionErrors.payment_method}</div>
                  )}
                </div>
                <div>
                  <Label>Account Holder</Label>
                  <Input
                    value={optionData.account_holder_name}
                    onChange={e => setOptionData('account_holder_name', e.target.value)}
                    required
                  />
                  {optionErrors.account_holder_name && (
                    <div className="text-red-500 text-xs">{optionErrors.account_holder_name}</div>
                  )}
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={optionData.account_number}
                    onChange={e => setOptionData('account_number', e.target.value)}
                    required
                  />
                  {optionErrors.account_number && (
                    <div className="text-red-500 text-xs">{optionErrors.account_number}</div>
                  )}
                </div>
                <div>
                  <Label>Logo</Label>
                  <Input
                    type="file"
                    onChange={e => setOptionData('logo', e.target.files[0])}
                  />
                </div>
                <Button type="submit" className="w-full">{editOption ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Pricing Modal */}
          <Dialog open={pricingModal} onOpenChange={setPricingModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editPricing ? 'Edit Pricing' : 'New Pricing Tier'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitPricing} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Minutes</Label>
                    <Input
                      type="number"
                      value={pricingData.min_minutes}
                      onChange={e => setPricingData('min_minutes', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Max Minutes</Label>
                    <Input
                      type="number"
                      value={pricingData.max_minutes}
                      onChange={e => setPricingData('max_minutes', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Price (ETB)</Label>
                  <Input
                    type="number"
                    value={pricingData.price}
                    onChange={e => setPricingData('price', e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">{editPricing ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
