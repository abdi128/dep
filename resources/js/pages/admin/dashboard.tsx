import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { User, Stethoscope, FlaskConical, Calendar, FileText, MessageCircle, Bell, CreditCard, Microscope } from 'lucide-react';
import { Link } from '@inertiajs/react';

const dashboardLinks = [
  {
    title: 'Patients',
    icon: <User className="h-7 w-7 text-blue-600" />,
    href: '/admin/patients',
    color: 'bg-blue-50',
    description: 'Manage all patients in the system',
  },
  {
    title: 'Doctors',
    icon: <Stethoscope className="h-7 w-7 text-green-600" />,
    href: '/admin/doctors',
    color: 'bg-green-50',
    description: 'Manage doctors and their specialties',
  },
  {
    title: 'Lab Technicians',
    icon: <Microscope className="h-7 w-7 text-purple-600" />,
    href: '/admin/labtechnicians',
    color: 'bg-purple-50',
    description: 'Manage lab technicians',
  },
  {
    title: 'Appointments',
    icon: <Calendar className="h-7 w-7 text-orange-600" />,
    href: '/admin/appointments',
    color: 'bg-orange-50',
    description: 'View and manage appointments',
  },
  {
    title: 'Prescriptions',
    icon: <FileText className="h-7 w-7 text-cyan-600" />,
    href: '/admin/prescriptions',
    color: 'bg-cyan-50',
    description: 'View and manage prescriptions',
  },
  {
    title: 'Lab Tests',
    icon: <FlaskConical className="h-7 w-7 text-pink-600" />,
    href: '/admin/laboratory',
    color: 'bg-pink-50',
    description: 'View and manage laboratory tests',
  },
  {
    title: 'Messages',
    icon: <MessageCircle className="h-7 w-7 text-teal-600" />,
    href: '/admin/messages',
    color: 'bg-teal-50',
    description: 'Send and receive messages',
  },
  {
    title: 'Notifications',
    icon: <Bell className="h-7 w-7 text-yellow-600" />,
    href: '/admin/notifications',
    color: 'bg-yellow-50',
    description: 'Send notifications to users',
  },
  {
    title: 'Billing',
    icon: <CreditCard className="h-7 w-7 text-indigo-600" />,
    href: '/admin/billing',
    color: 'bg-indigo-50',
    description: 'Manage billing, payments, and rates',
  },
];

export default function AdminDashboard({ stats = {} }) {
  // stats can be passed from backend if you want quick counts for each module
  // e.g. stats = { patients: 100, doctors: 20, ... }
  return (
    <AppLayout>
      <Head title="Admin Dashboard" />
      <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="rounded-xl bg-blue-50 p-4 flex flex-col items-center shadow-sm">
            <User className="h-6 w-6 text-blue-600 mb-1" />
            <div className="text-2xl font-bold text-blue-900">{stats.patients ?? '-'}</div>
            <div className="text-xs text-blue-700">Patients</div>
          </div>
          <div className="rounded-xl bg-green-50 p-4 flex flex-col items-center shadow-sm">
            <Stethoscope className="h-6 w-6 text-green-600 mb-1" />
            <div className="text-2xl font-bold text-green-900">{stats.doctors ?? '-'}</div>
            <div className="text-xs text-green-700">Doctors</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 flex flex-col items-center shadow-sm">
            <Microscope className="h-6 w-6 text-purple-600 mb-1" />
            <div className="text-2xl font-bold text-purple-900">{stats.labtechnicians ?? '-'}</div>
            <div className="text-xs text-purple-700">Lab Techs</div>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 flex flex-col items-center shadow-sm">
            <Calendar className="h-6 w-6 text-orange-600 mb-1" />
            <div className="text-2xl font-bold text-orange-900">{stats.appointments ?? '-'}</div>
            <div className="text-xs text-orange-700">Appointments</div>
          </div>
          <div className="rounded-xl bg-cyan-50 p-4 flex flex-col items-center shadow-sm">
            <FileText className="h-6 w-6 text-cyan-600 mb-1" />
            <div className="text-2xl font-bold text-cyan-900">{stats.prescriptions ?? '-'}</div>
            <div className="text-xs text-cyan-700">Prescriptions</div>
          </div>
          <div className="rounded-xl bg-pink-50 p-4 flex flex-col items-center shadow-sm">
            <FlaskConical className="h-6 w-6 text-pink-600 mb-1" />
            <div className="text-2xl font-bold text-pink-900">{stats.labtests ?? '-'}</div>
            <div className="text-xs text-pink-700">Lab Tests</div>
          </div>
        </div>
        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {dashboardLinks.map(link => (
            <Link
              key={link.title}
              href={link.href}
              className={`group rounded-xl border bg-white shadow-md hover:shadow-lg transition-all p-6 flex items-center gap-4 hover:-translate-y-1 ${link.color}`}
            >
              <div className="flex items-center justify-center rounded-full bg-white/70 shadow-inner p-3">
                {link.icon}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{link.title}</div>
                <div className="text-sm text-gray-500">{link.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
