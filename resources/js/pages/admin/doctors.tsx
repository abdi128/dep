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
  { title: 'Doctors', href: '/admin/doctors' },
];

export default function AdminDoctors({ doctors, filters }) {
  const [openNew, setOpenNew] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // New doctor form
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
    specialty: '',
  });

  // Edit doctor form
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
    specialty: '',
  });

  const [search, setSearch] = useState(filters?.search || '');

  function submitNew(e) {
    e.preventDefault();
    post(route('admin.doctors.store'), {
      onSuccess: () => {
        resetNew();
        setOpenNew(false);
      },
    });
  }

  function openViewModal(doctor) {
    setSelectedDoctor(doctor);
    setOpenView(true);
  }

  function openEditModal(doctor) {
    setSelectedDoctor(doctor);
    setEditData({
      name: doctor.user?.name || '',
      email: doctor.user?.email || '',
      password: '',
      password_confirmation: '',
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      phone_number: doctor.phone_number,
      specialty: doctor.specialty,
    });
    setOpenEdit(true);
  }

  function submitEdit(e) {
    e.preventDefault();
    if (!selectedDoctor) return;

    put(route('admin.doctors.update', selectedDoctor.id), {
      onSuccess: () => {
        resetEdit();
        setOpenEdit(false);
      },
    });
  }

  function deleteDoctor(doctor) {
    if (!window.confirm('Are you sure you want to delete this doctor? This cannot be undone.')) return;
    router.delete(route('admin.doctors.destroy', doctor.id), {
      preserveScroll: true,
    });
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    router.get(route('admin.doctors.index'), { search: e.target.value }, { preserveState: true, replace: true });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Doctors" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[100vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Doctors</h1>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search doctors..."
                value={search}
                onChange={handleSearchChange}
                className="rounded border border-gray-300 px-3 py-1"
              />
              <Dialog open={openNew} onOpenChange={setOpenNew}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> New Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Doctor</DialogTitle>
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
                    {/* Specialty */}
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={newData.specialty}
                        onChange={e => setNewData('specialty', e.target.value)}
                        required
                      />
                      {newErrors.specialty && <p className="text-red-600">{newErrors.specialty}</p>}
                    </div>
                    <Button type="submit" disabled={newProcessing} className="w-full">
                      {newProcessing ? 'Creating...' : 'Create'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Doctors Table */}
          <div className="w-full overflow-x-auto rounded-lg border shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">License No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No doctors found.
                    </td>
                  </tr>
                )}
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.license_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.first_name} {doctor.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.user?.email || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doctor.phone_number}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Button variant="ghost" size="sm" title="View" onClick={() => openViewModal(doctor)} className="hover:text-blue-600">
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEditModal(doctor)} className="hover:text-green-600">
                        <Edit2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete" onClick={() => deleteDoctor(doctor)} className="hover:text-red-600">
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
                <DialogTitle>Doctor Profile</DialogTitle>
              </DialogHeader>
              {selectedDoctor && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name:</Label><p>{selectedDoctor.first_name}</p></div>
                    <div><Label>Last Name:</Label><p>{selectedDoctor.last_name}</p></div>
                    <div><Label>Email:</Label><p>{selectedDoctor.user?.email || ''}</p></div>
                    <div><Label>Username:</Label><p>{selectedDoctor.user?.name || ''}</p></div>
                    <div><Label>License Number:</Label><p>{selectedDoctor.license_number}</p></div>
                    <div><Label>Specialty:</Label><p>{selectedDoctor.specialty}</p></div>
                    <div><Label>Phone Number:</Label><p>{selectedDoctor.phone_number}</p></div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Modal */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Doctor</DialogTitle>
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
                {/* Specialty */}
                <div>
                  <Label htmlFor="edit_specialty">Specialty</Label>
                  <Input
                    id="edit_specialty"
                    value={editData.specialty}
                    onChange={e => setEditData('specialty', e.target.value)}
                    required
                  />
                  {editErrors.specialty && <p className="text-red-600">{editErrors.specialty}</p>}
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
