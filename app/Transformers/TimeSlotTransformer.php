<?php

namespace App\Transformers;

use App\Models\TimeSlot;

class TimeSlotTransformer
{
    public static function transform(TimeSlot $timeSlot): array
    {
        return [
            'id' => $timeSlot->id,
            'start_time' => $timeSlot->start_time,
            'end_time' => $timeSlot->end_time,
            'is_available' => $timeSlot->is_available,
        ];
    }

    public static function collection($timeSlots): array
    {
        return $timeSlots->map(function ($timeSlot) {
            return static::transform($timeSlot);
        })->toArray();
    }
}
