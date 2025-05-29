import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onChange: (dates: { startDate: string; endDate: string }) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
    const [start, setStart] = useState<Date | null>(new Date(startDate));
    const [end, setEnd] = useState<Date | null>(new Date(endDate));

    useEffect(() => {
        if (start && end) {
            onChange({
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
            });
        }
    }, [start, end]);

    return (
        <div className="flex items-center gap-2">
            <DatePicker
                selected={start}
                onChange={(date) => setStart(date)}
                selectsStart
                startDate={start}
                endDate={end}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span>to</span>
            <DatePicker
                selected={end}
                onChange={(date) => setEnd(date)}
                selectsEnd
                startDate={start}
                endDate={end}
                minDate={start}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
        </div>
    );
}