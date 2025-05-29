import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FlaskConical, User, Stethoscope, MessageCircle, Bell } from 'lucide-react';
import { Link } from '@inertiajs/react';

const dashboardLinks = [
  {
    title: 'Lab Tests',
    icon: <FlaskConical className="h-7 w-7 text-purple-600" />,
    href: '/labtechnician/laboratory',
    color: 'bg-purple-50',
    description: 'View and update assigned lab tests',
  },
  {
    title: 'Patients',
    icon: <User className="h-7 w-7 text-blue-600" />,
    href: '/labtechnician/patients',
    color: 'bg-blue-50',
    description: 'Browse patient information',
  },
  {
    title: 'Doctors',
    icon: <Stethoscope className="h-7 w-7 text-green-600" />,
    href: '/labtechnician/doctors',
    color: 'bg-green-50',
    description: 'Browse doctor information',
  },
  {
    title: 'Messages',
    icon: <MessageCircle className="h-7 w-7 text-teal-600" />,
    href: '/labtechnician/messages',
    color: 'bg-teal-50',
    description: 'Send and receive messages',
  },
  {
    title: 'Notifications',
    icon: <Bell className="h-7 w-7 text-yellow-600" />,
    href: '/labtechnician/notifications',
    color: 'bg-yellow-50',
    description: 'View notifications',
  },
];

export default function LabTechnicianDashboard({ stats = {} }) {
  // Optionally pass stats from backend for quick counts
  return (
    <AppLayout>
      <Head title="Lab Technician Dashboard" />
      <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Lab Technician Dashboard</h1>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-purple-50 p-4 flex flex-col items-center shadow-sm">
            <FlaskConical className="h-6 w-6 text-purple-600 mb-1" />
            <div className="text-2xl font-bold text-purple-900">{stats.labtests ?? '-'}</div>
            <div className="text-xs text-purple-700">Lab Tests</div>
          </div>
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
          <div className="rounded-xl bg-yellow-50 p-4 flex flex-col items-center shadow-sm">
            <Bell className="h-6 w-6 text-yellow-600 mb-1" />
            <div className="text-2xl font-bold text-yellow-900">{stats.notifications ?? '-'}</div>
            <div className="text-xs text-yellow-700">Notifications</div>
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
                <div className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">{link.title}</div>
                <div className="text-sm text-gray-500">{link.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
