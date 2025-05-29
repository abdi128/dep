import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, parseISO, isBefore, isToday } from 'date-fns';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Doctor Schedule', href: '/doctor/schedule' },
];

export default function DoctorSchedule({
  schedules,
  default_start_morning,
  default_end_morning,
  default_start_afternoon,
  default_end_afternoon,
}) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() =>
    schedules.map((s) => parseISO(s.date))
  );

  const { data, setData, post, processing } = useForm({
    dates: selectedDates.map((d) => format(d, 'yyyy-MM-dd')),
    morning_start: default_start_morning || '09:00',
    morning_end: default_end_morning || '12:30',
    afternoon_start: default_start_afternoon || '13:30',
    afternoon_end: default_end_afternoon || '17:00',
  });

  // Sync selectedDates with form data
  useEffect(() => {
    setData('dates', selectedDates.map((d) => format(d, 'yyyy-MM-dd')));
  }, [selectedDates]);

  const isDateDisabled = (date: Date) => isBefore(date, new Date()) && !isToday(date);

  function handleSubmit() {
    post('/doctor/schedule/update', {
      preserveScroll: true,
      onSuccess: () => toast.success('Schedule updated successfully'),
      onError: () => toast.error('Failed to update schedule'),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Doctor Schedule" />
      <Toaster position="top-right" richColors />
      <div id="pttas" className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-6">
          <h1 className="text-2xl font-bold mb-6">Manage Your Schedule</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label className="mb-2 block font-semibold">Select Available Dates</Label>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                disabled={isDateDisabled}
                className="rounded-md border"
              />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Set Available Times</Label>
              <div className="space-y-6">
                <div>
                  <Label>Morning Session</Label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <Input
                      type="time"
                      value={data.morning_start}
                      onChange={(e) => setData('morning_start', e.target.value)}
                    />
                    <Input
                      type="time"
                      value={data.morning_end}
                      onChange={(e) => setData('morning_end', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Afternoon Session</Label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <Input
                      type="time"
                      value={data.afternoon_start}
                      onChange={(e) => setData('afternoon_start', e.target.value)}
                    />
                    <Input
                      type="time"
                      value={data.afternoon_end}
                      onChange={(e) => setData('afternoon_end', e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} disabled={processing} className="w-full">
                  {processing ? 'Saving...' : 'Save Schedule'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
