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
import { Eye, Plus, Trash2, Edit2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Patients', href: '/admin/patients' },
];

export default function AdminPatients({ patients, filters }) {
  const [openNew, setOpenNew] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // New patient form
  const {
    data: newData,
    setData: setNewData,
    post,
    processing: newProcessing,
    errors: newErrors,
    reset: resetNew,
  } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    gender: 'Male',
  });

  // Edit patient form
  const {
    data: editData,
    setData: setEditData,
    put,
    processing: editProcessing,
    errors: editErrors,
    reset: resetEdit,
  } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    gender: 'Male',
  });

  const [search, setSearch] = useState(filters?.search || '');

  // Submit new patient form
  function submitNew(e) {
    e.preventDefault();
    post(route('admin.patients.store'), {
      onSuccess: () => {
        resetNew();
        setOpenNew(false);
      },
    });
  }

  // Open view modal
  function openViewModal(patient) {
    setSelectedPatient(patient);
    setOpenView(true);
  }

  // Open edit modal and prefill form
  function openEditModal(patient) {
    setSelectedPatient(patient);
    setEditData({
      name: patient.user?.name || '',
      email: patient.user?.email || '',
      password: '',
      password_confirmation: '',
      first_name: patient.first_name,
      last_name: patient.last_name,
      phone_number: patient.phone_number,
      address: patient.address,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
    });
    setOpenEdit(true);
  }

  // Submit edit form
  function submitEdit(e) {
    e.preventDefault();
    if (!selectedPatient) return;

    put(route('admin.patients.update', selectedPatient.id), {
      onSuccess: () => {
        resetEdit();
        setOpenEdit(false);
      },
    });
  }

  // Delete patient with confirmation
  function deletePatient(patient) {
    if (!window.confirm('Are you sure you want to delete this patient? This cannot be undone.')) return;
    router.delete(route('admin.patients.destroy', patient.id), {
      preserveScroll: true,
    });
  }

  // Handle search input change and trigger backend filtering
  function handleSearchChange(e) {
    setSearch(e.target.value);
    router.get(route('admin.patients.index'), { search: e.target.value }, { preserveState: true, replace: true });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Patients" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Patients</h1>
            <div className="flex space-x-2">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={handleSearchChange}
                className="rounded border border-gray-300 px-3 py-1"
              />
              {/* New Patient Modal */}
              <Dialog open={openNew} onOpenChange={setOpenNew}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> New Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Patient</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={submitNew} className="space-y-4">
                    {/* Username */}
                    <div>
                      <Label htmlFor="name">Username</Label>
                      <Input
                        id="name"
                        value={newData.name}
                        onChange={e => setNewData('name', e.target.value)}
                        required
                      />
                      {newErrors.name && <p className="text-red-600">{newErrors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newData.email}
                        onChange={e => setNewData('email', e.target.value)}
                        required
                      />
                      {newErrors.email && <p className="text-red-600">{newErrors.email}</p>}
                    </div>
                    {/* Password */}
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newData.password}
                        onChange={e => setNewData('password', e.target.value)}
                        required
                      />
                      {newErrors.password && <p className="text-red-600">{newErrors.password}</p>}
                    </div>
                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="password_confirmation">Confirm Password</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={newData.password_confirmation}
                        onChange={e => setNewData('password_confirmation', e.target.value)}
                        required
                      />
                    </div>
                    {/* First Name */}
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={newData.first_name}
                        onChange={e => setNewData('first_name', e.target.value)}
                        required
                      />
                      {newErrors.first_name && <p className="text-red-600">{newErrors.first_name}</p>}
                    </div>
                    {/* Last Name */}
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={newData.last_name}
                        onChange={e => setNewData('last_name', e.target.value)}
                        required
                      />
                      {newErrors.last_name && <p className="text-red-600">{newErrors.last_name}</p>}
                    </div>
                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        value={newData.phone_number}
                        onChange={e => setNewData('phone_number', e.target.value)}
                        required
                      />
                      {newErrors.phone_number && <p className="text-red-600">{newErrors.phone_number}</p>}
                    </div>
                    {/* Address */}
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newData.address}
                        onChange={e => setNewData('address', e.target.value)}
                        required
                      />
                      {newErrors.address && <p className="text-red-600">{newErrors.address}</p>}
                    </div>
                    {/* Date of Birth */}
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={newData.date_of_birth}
                        onChange={e => setNewData('date_of_birth', e.target.value)}
                        required
                      />
                      {newErrors.date_of_birth && <p className="text-red-600">{newErrors.date_of_birth}</p>}
                    </div>
                    {/* Gender */}
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={newData.gender}
                        onChange={e => setNewData('gender', e.target.value)}
                        required
                        className="w-full rounded border border-gray-300 px-3 py-2"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {newErrors.gender && <p className="text-red-600">{newErrors.gender}</p>}
                    </div>
                    <Button type="submit" disabled={newProcessing} className="w-full">
                      {newProcessing ? 'Creating...' : 'Create'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Patients Table */}
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reg. No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{patient.registration_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.first_name} {patient.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.user?.email || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.phone_number}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Button variant="ghost" size="sm" title="View" onClick={() => openViewModal(patient)} className="hover:text-blue-600">
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEditModal(patient)} className="hover:text-green-600">
                        <Edit2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete" onClick={() => deletePatient(patient)} className="hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View Modal */}
          <Dialog open={openView} onOpenChange={setOpenView}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Patient Profile</DialogTitle>
              </DialogHeader>
              {selectedPatient && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name:</Label><p>{selectedPatient.first_name}</p></div>
                    <div><Label>Last Name:</Label><p>{selectedPatient.last_name}</p></div>
                    <div><Label>Email:</Label><p>{selectedPatient.user?.email || ''}</p></div>
                    <div><Label>Username:</Label><p>{selectedPatient.user?.name || ''}</p></div>
                    <div><Label>Registration Number:</Label><p>{selectedPatient.registration_number}</p></div>
                    <div><Label>Gender:</Label><p>{selectedPatient.gender}</p></div>
                    <div><Label>Date of Birth:</Label><p>{new Date(selectedPatient.date_of_birth).toLocaleDateString()}</p></div>
                    <div><Label>Phone Number:</Label><p>{selectedPatient.phone_number}</p></div>
                    <div><Label>Address:</Label><p>{selectedPatient.address}</p></div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Modal */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Patient</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitEdit} className="space-y-4">
                {/* Username */}
                <div>
                  <Label htmlFor="edit_name">Username</Label>
                  <Input
                    id="edit_name"
                    value={editData.name}
                    onChange={e => setEditData('name', e.target.value)}
                    required
                  />
                  {editErrors.name && <p className="text-red-600">{editErrors.name}</p>}
                </div>
                {/* Email */}
                <div>
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editData.email}
                    onChange={e => setEditData('email', e.target.value)}
                    required
                  />
                  {editErrors.email && <p className="text-red-600">{editErrors.email}</p>}
                </div>
                {/* Password */}
                <div>
                  <Label htmlFor="edit_password">Password (leave blank to keep current)</Label>
                  <Input
                    id="edit_password"
                    type="password"
                    value={editData.password}
                    onChange={e => setEditData('password', e.target.value)}
                  />
                  {editErrors.password && <p className="text-red-600">{editErrors.password}</p>}
                </div>
                {/* Confirm Password */}
                <div>
                  <Label htmlFor="edit_password_confirmation">Confirm Password</Label>
                  <Input
                    id="edit_password_confirmation"
                    type="password"
                    value={editData.password_confirmation}
                    onChange={e => setEditData('password_confirmation', e.target.value)}
                  />
                </div>
                {/* First Name */}
                <div>
                  <Label htmlFor="edit_first_name">First Name</Label>
                  <Input
                    id="edit_first_name"
                    value={editData.first_name}
                    onChange={e => setEditData('first_name', e.target.value)}
                    required
                  />
                  {editErrors.first_name && <p className="text-red-600">{editErrors.first_name}</p>}
                </div>
                {/* Last Name */}
                <div>
                  <Label htmlFor="edit_last_name">Last Name</Label>
                  <Input
                    id="edit_last_name"
                    value={editData.last_name}
                    onChange={e => setEditData('last_name', e.target.value)}
                    required
                  />
                  {editErrors.last_name && <p className="text-red-600">{editErrors.last_name}</p>}
                </div>
                {/* Phone Number */}
                <div>
                  <Label htmlFor="edit_phone_number">Phone Number</Label>
                  <Input
                    id="edit_phone_number"
                    value={editData.phone_number}
                    onChange={e => setEditData('phone_number', e.target.value)}
                    required
                  />
                  {editErrors.phone_number && <p className="text-red-600">{editErrors.phone_number}</p>}
                </div>
                {/* Address */}
                <div>
                  <Label htmlFor="edit_address">Address</Label>
                  <Input
                    id="edit_address"
                    value={editData.address}
                    onChange={e => setEditData('address', e.target.value)}
                    required
                  />
                  {editErrors.address && <p className="text-red-600">{editErrors.address}</p>}
                </div>
                {/* Date of Birth */}
                <div>
                  <Label htmlFor="edit_date_of_birth">Date of Birth</Label>
                  <Input
                    id="edit_date_of_birth"
                    type="date"
                    value={editData.date_of_birth}
                    onChange={e => setEditData('date_of_birth', e.target.value)}
                    required
                  />
                  {editErrors.date_of_birth && <p className="text-red-600">{editErrors.date_of_birth}</p>}
                </div>
                {/* Gender */}
                <div>
                  <Label htmlFor="edit_gender">Gender</Label>
                  <select
                    id="edit_gender"
                    value={editData.gender}
                    onChange={e => setEditData('gender', e.target.value)}
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {editErrors.gender && <p className="text-red-600">{editErrors.gender}</p>}
                </div>
                <Button type="submit" disabled={editProcessing} className="w-full">
                  {editProcessing ? 'Updating...' : 'Update'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
