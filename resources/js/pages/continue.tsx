import React from 'react';
import { router } from '@inertiajs/react';
import { User, Stethoscope, ShieldCheck, FlaskConical, ArrowLeft } from 'lucide-react';

export default function Continue(): JSX.Element {
  // Navigation handlers
  const handleDocLoginClick = (): void => {
    router.visit(route('doctor.login'));
  };

  const handlePatientLoginClick = (): void => {
    router.visit(route('patient.login'));
  };

  const handleAdminLoginClick = (): void => {
    router.visit(route('admin.login'));
  };

  const handleLabLoginClick = (): void => {
    router.visit(route('labtechnician.login'));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e3f2fd] via-[#f7fbff] to-white px-4">
      <div className="w-full max-w-md flex flex-col gap-8 items-center bg-white/80 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-[#15315b] mb-2">Continue as...</h1>
        <div className="flex flex-col gap-5 w-full">
          <button
            onClick={handlePatientLoginClick}
            className="flex items-center gap-3 px-6 py-4 w-full rounded-xl shadow bg-[#e3f2fd] hover:bg-[#d0e6fa] text-[#15315b] font-semibold text-lg transition"
          >
            <User className="w-6 h-6 text-[#1976d2]" />
            Continue as Patient
          </button>
          <button
            onClick={handleDocLoginClick}
            className="flex items-center gap-3 px-6 py-4 w-full rounded-xl shadow bg-[#e3f2fd] hover:bg-[#d0e6fa] text-[#15315b] font-semibold text-lg transition"
          >
            <Stethoscope className="w-6 h-6 text-[#1976d2]" />
            Continue as Doctor
          </button>
          <button
            onClick={handleLabLoginClick}
            className="flex items-center gap-3 px-6 py-4 w-full rounded-xl shadow bg-[#e3f2fd] hover:bg-[#d0e6fa] text-[#15315b] font-semibold text-lg transition"
          >
            <FlaskConical className="w-6 h-6 text-[#1976d2]" />
            Continue as Lab Technician
          </button>
          <button
            onClick={handleAdminLoginClick}
            className="flex items-center gap-3 px-6 py-4 w-full rounded-xl shadow bg-[#e3f2fd] hover:bg-[#d0e6fa] text-[#15315b] font-semibold text-lg transition"
          >
            <ShieldCheck className="w-6 h-6 text-[#1976d2]" />
            Continue as Admin
          </button>
        </div>
        <div className="mt-8">
          <button
            onClick={() => router.visit('/')}
            className="flex items-center gap-1 text-[#1976d2] hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
