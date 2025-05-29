import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format, parseISO, isBefore, isToday } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AppointmentBooking({
  doctor,
  patient,
  appointments: initialAppointments,
  appointmentToReschedule,
  flash,
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAppointment, setViewAppointment] = useState(null);

  const { data, setData, post, processing, reset } = useForm({
    time_slot_id: appointmentToReschedule?.time_slot_id ?? null,
    reason: appointmentToReschedule?.reason ?? '',
    appointment_id: appointmentToReschedule?.id ?? null,
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash]);

  useEffect(() => {
    if (appointmentToReschedule) {
      const date = parseISO(appointmentToReschedule.timeSlot.schedule.date);
      setSelectedDate(date);
      updateAvailableSlots(date);
    }
  }, [appointmentToReschedule]);

  useEffect(() => {
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  const availableDates = doctor.schedules.map((s) => parseISO(s.date));

  const updateAvailableSlots = (date: Date | null) => {
    if (!date) {
      setAvailableTimeSlots([]);
      setData('time_slot_id', null);
      return;
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const schedule = doctor.schedules.find((s) => s.date === dateStr);
    const slots = schedule ? schedule.time_slots.filter((ts) => ts.is_available) : [];
    setAvailableTimeSlots(slots);
    
    if (!appointmentToReschedule || !slots.some(ts => ts.id === data.time_slot_id)) {
      setData('time_slot_id', null);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    updateAvailableSlots(date);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    if (isBefore(date, today) && !isToday(date)) return true;
    return !availableDates.some((d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.time_slot_id) {
      toast.error('Please select a time slot');
      return;
    }

    post(route('patient.appointmentbooking.book', { doctor: doctor.id }), {
      preserveScroll: true,
      onSuccess: () => {
        // Refresh the page to get updated appointments
        router.reload({ only: ['appointments'] });
      },
      onError: (errors) => {
        if (errors.time_slot_id) toast.error(errors.time_slot_id);
        else if (errors.appointment_id) toast.error(errors.appointment_id);
        else toast.error('Failed to book appointment');
      }
    });
  };

  const cancelAppointment = (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    router.post(route('patient.appointments.cancel', id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Appointment cancelled');
        setAppointments(prev => 
          prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
        );
      },
      onError: () => toast.error('Failed to cancel appointment')
    });
  };

  const rescheduleAppointment = (appt) => {
    router.visit(route('patient.appointmentbooking', { 
      doctor: doctor.id, 
      appointment: appt.id 
    }), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Book Appointment', href: '#' }]}>
      <Head title={`Book with Dr. ${doctor.first_name} ${doctor.last_name}`} />
      
      <div className="p-6 border-sidebar-border/70 dark:border-sidebar-border min-h-[100vh] rounded-xl border">
        <h1 className="text-2xl font-bold mb-6">
          Book Appointment with Dr. {doctor.first_name} {doctor.last_name}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Label className="mb-2 block font-semibold">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Label className="block font-semibold">Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto border rounded p-2">
                {availableTimeSlots.length === 0 ? (
                  <p className="col-span-2 text-gray-500">No available time slots for selected date</p>
                ) : (
                  availableTimeSlots.map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setData('time_slot_id', ts.id)}
                      className={`py-2 px-3 rounded border text-center ${
                        data.time_slot_id === ts.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {ts.start_time} - {ts.end_time}
                    </button>
                  ))
                )}
              </div>
              
              <div>
                <Label htmlFor="reason">Reason (optional)</Label>
                <textarea
                  id="reason"
                  value={data.reason}
                  onChange={(e) => setData('reason', e.target.value)}
                  className="w-full rounded border p-2 min-h-[100px]"
                  placeholder="Briefly describe the reason for your appointment"
                />
              </div>
              
              <Button type="submit" disabled={processing} className="w-full">
                {data.appointment_id ? 'Reschedule Appointment' : 'Book Appointment'}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Appointments with Dr. {doctor.first_name}</h2>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No appointments found
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell>{appt.timeSlot.schedule.date}</TableCell>
                      <TableCell>
                        {appt.timeSlot.start_time} - {appt.timeSlot.end_time}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appt.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appt.status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {appt.reason || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setViewAppointment(appt);
                              setViewModalOpen(true);
                            }}
                          >
                            View
                          </Button>
                          {appt.status !== 'cancelled' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => rescheduleAppointment(appt)}
                              >
                                Reschedule
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => cancelAppointment(appt.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* View Appointment Dialog */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {viewAppointment && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Date:</p>
                <p>{viewAppointment.timeSlot.schedule.date}</p>
              </div>
              <div>
                <p className="font-medium">Time:</p>
                <p>{viewAppointment.timeSlot.start_time} - {viewAppointment.timeSlot.end_time}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <p>{viewAppointment.status}</p>
              </div>
              <div>
                <p className="font-medium">Reason:</p>
                <p>{viewAppointment.reason || 'N/A'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}