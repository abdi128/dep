import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { User, BookText, FlaskConical, FileText, MessageCircle, Bell, Stethoscope, Microscope } from 'lucide-react';
import { Link } from '@inertiajs/react';

const dashboardLinks = [
  {
    title: 'Patients',
    icon: <User className="h-7 w-7 text-blue-600" />,
    href: '/doctor/patients',
    color: 'bg-blue-50',
    description: 'Browse and manage your patients',
  },
  {
    title: 'Medical Records',
    icon: <BookText className="h-7 w-7 text-orange-600" />,
    href: '/doctor/medicalrecords', // If you have a dedicated page, otherwise link to patients
    color: 'bg-orange-50',
    description: 'View and create medical records',
  },
  {
    title: 'Lab Tests',
    icon: <FlaskConical className="h-7 w-7 text-purple-600" />,
    href: '/doctor/laboratory',
    color: 'bg-purple-50',
    description: 'Request and track lab tests',
  },
  {
    title: 'Prescriptions',
    icon: <FileText className="h-7 w-7 text-cyan-600" />,
    href: '/doctor/prescriptions',
    color: 'bg-cyan-50',
    description: 'Assign and manage prescriptions',
  },
  {
    title: 'Lab Technicians',
    icon: <Microscope className="h-7 w-7 text-green-600" />,
    href: '/doctor/labtechnicians',
    color: 'bg-green-50',
    description: 'Browse lab technicians',
  },
  {
    title: 'Messages',
    icon: <MessageCircle className="h-7 w-7 text-teal-600" />,
    href: '/doctor/messages',
    color: 'bg-teal-50',
    description: 'Send and receive messages',
  },
  {
    title: 'Notifications',
    icon: <Bell className="h-7 w-7 text-yellow-600" />,
    href: '/doctor/notifications',
    color: 'bg-yellow-50',
    description: 'View your notifications',
  },
];

export default function DoctorDashboard({ stats = {} }) {
  // Optionally pass stats from backend for quick counts
  return (
    <AppLayout>
      <Head title="Doctor Dashboard" />
      <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Doctor Dashboard</h1>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-blue-50 p-4 flex flex-col items-center shadow-sm">
            <User className="h-6 w-6 text-blue-600 mb-1" />
            <div className="text-2xl font-bold text-blue-900">{stats.patients ?? '-'}</div>
            <div className="text-xs text-blue-700">Patients</div>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 flex flex-col items-center shadow-sm">
            <BookText className="h-6 w-6 text-orange-600 mb-1" />
            <div className="text-2xl font-bold text-orange-900">{stats.medicalrecords ?? '-'}</div>
            <div className="text-xs text-orange-700">Medical Records</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 flex flex-col items-center shadow-sm">
            <FlaskConical className="h-6 w-6 text-purple-600 mb-1" />
            <div className="text-2xl font-bold text-purple-900">{stats.labtests ?? '-'}</div>
            <div className="text-xs text-purple-700">Lab Tests</div>
          </div>
          <div className="rounded-xl bg-cyan-50 p-4 flex flex-col items-center shadow-sm">
            <FileText className="h-6 w-6 text-cyan-600 mb-1" />
            <div className="text-2xl font-bold text-cyan-900">{stats.prescriptions ?? '-'}</div>
            <div className="text-xs text-cyan-700">Prescriptions</div>
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
