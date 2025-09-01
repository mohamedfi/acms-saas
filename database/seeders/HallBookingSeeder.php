<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HallBooking;
use App\Models\TrainingHall;
use App\Models\TrainingProgram;

class HallBookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the training halls and programs
        $alexandriaHall = TrainingHall::where('code', 'ALEX')->first();
        $nasrHall = TrainingHall::where('code', 'NASR')->first();

        $healthcare = TrainingProgram::where('code', 'HC001')->first();
        $gasTurbines = TrainingProgram::where('code', 'GT002')->first();
        $electronicMaintenance = TrainingProgram::where('code', 'EM003')->first();
        $resourceManagement = TrainingProgram::where('code', 'RM004')->first();

        // Healthcare Program Bookings (Alexandria)
        $healthcareDates = [
            '2024-08-16' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
            '2024-08-24' => ['start_time' => '17:00', 'end_time' => '20:00'], // Sunday 5-8 PM
            '2024-08-30' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
            '2024-09-06' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
            '2024-09-13' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
            '2024-09-20' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
            '2024-09-27' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
        ];

        foreach ($healthcareDates as $date => $times) {
            HallBooking::create([
                'training_hall_id' => $alexandriaHall->id,
                'training_program_id' => $healthcare->id,
                'trainer_id' => 1, // Ahmed Hassan
                'start_date' => $date,
                'end_date' => $date,
                'start_time' => $times['start_time'],
                'end_time' => $times['end_time'],
                'session_dates' => [$date],
                'max_participants' => 30,
                'current_participants' => 25,
                'price_per_participant' => 150.00,
                'status' => 'scheduled',
                'booking_reference' => 'HB-HC-' . date('Ymd', strtotime($date)),
                'notes' => 'Healthcare training session - ' . $date,
            ]);
        }

        // Gas Turbines Program Bookings (Alexandria)
        $gasTurbineDates = [
            '2024-08-23' => ['start_time' => '14:00', 'end_time' => '17:00'], // Saturday 2-5 PM
            '2024-08-30' => ['start_time' => '11:00', 'end_time' => '14:00'], // Saturday 11-2 PM
            '2024-09-06' => ['start_time' => '11:00', 'end_time' => '14:00'], // Saturday 11-2 PM
            '2024-09-13' => ['start_time' => '11:00', 'end_time' => '14:00'], // Saturday 11-2 PM
            '2024-09-20' => ['start_time' => '11:00', 'end_time' => '14:00'], // Saturday 11-2 PM
        ];

        foreach ($gasTurbineDates as $date => $times) {
            HallBooking::create([
                'training_hall_id' => $alexandriaHall->id,
                'training_program_id' => $gasTurbines->id,
                'trainer_id' => 3, // Mohamed El-Sayed
                'start_date' => $date,
                'end_date' => $date,
                'start_time' => $times['start_time'],
                'end_time' => $times['end_time'],
                'session_dates' => [$date],
                'max_participants' => 25,
                'current_participants' => 20,
                'price_per_participant' => 200.00,
                'status' => 'scheduled',
                'booking_reference' => 'HB-GT-' . date('Ymd', strtotime($date)),
                'notes' => 'Gas Turbines training session - ' . $date,
            ]);
        }

        // Electronic Maintenance Program Bookings (Alexandria)
        $electronicDates = [
            '2024-08-17' => ['start_time' => '17:00', 'end_time' => '20:00'], // Sunday 5-8 PM
            '2024-08-18' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
            '2024-08-25' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
            '2024-08-27' => ['start_time' => '17:00', 'end_time' => '20:00'], // Wednesday 5-8 PM
            '2024-09-01' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
            '2024-09-03' => ['start_time' => '17:00', 'end_time' => '20:00'], // Wednesday 5-8 PM
            '2024-09-08' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
            '2024-09-10' => ['start_time' => '17:00', 'end_time' => '20:00'], // Wednesday 5-8 PM
            '2024-09-15' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
            '2024-09-17' => ['start_time' => '17:00', 'end_time' => '20:00'], // Wednesday 5-8 PM
            '2024-09-22' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
            '2024-09-24' => ['start_time' => '17:00', 'end_time' => '20:00'], // Wednesday 5-8 PM
            '2024-09-29' => ['start_time' => '17:00', 'end_time' => '20:00'], // Monday 5-8 PM
        ];

        foreach ($electronicDates as $date => $times) {
            HallBooking::create([
                'training_hall_id' => $alexandriaHall->id,
                'training_program_id' => $electronicMaintenance->id,
                'trainer_id' => 4, // Aisha Mahmoud
                'start_date' => $date,
                'end_date' => $date,
                'start_time' => $times['start_time'],
                'end_time' => $times['end_time'],
                'session_dates' => [$date],
                'max_participants' => 35,
                'current_participants' => 30,
                'price_per_participant' => 180.00,
                'status' => 'scheduled',
                'booking_reference' => 'HB-EM-' . date('Ymd', strtotime($date)),
                'notes' => 'Electronic Maintenance training session - ' . $date,
            ]);
        }

        // Resource Management Program Bookings (Nasr City)
        $resourceDates = [
            '2024-08-17' => ['start_time' => '15:00', 'end_time' => '19:00'], // Sunday 3-7 PM
            '2024-08-18' => ['start_time' => '15:00', 'end_time' => '19:00'], // Monday 3-7 PM
            '2024-08-24' => ['start_time' => '15:00', 'end_time' => '19:00'], // Sunday 3-7 PM
            '2024-08-25' => ['start_time' => '15:00', 'end_time' => '19:00'], // Monday 3-7 PM
            '2024-08-31' => ['start_time' => '15:00', 'end_time' => '19:00'], // Sunday 3-7 PM
            '2024-09-01' => ['start_time' => '15:00', 'end_time' => '19:00'], // Monday 3-7 PM
            '2024-09-07' => ['start_time' => '15:00', 'end_time' => '19:00'], // Sunday 3-7 PM
            '2024-09-08' => ['start_time' => '15:00', 'end_time' => '19:00'], // Monday 3-7 PM
        ];

        foreach ($resourceDates as $date => $times) {
            HallBooking::create([
                'training_hall_id' => $nasrHall->id,
                'training_program_id' => $resourceManagement->id,
                'trainer_id' => 2, // Fatima Ali
                'start_date' => $date,
                'end_date' => $date,
                'start_time' => $times['start_time'],
                'end_time' => $times['end_time'],
                'session_dates' => [$date],
                'max_participants' => 40,
                'current_participants' => 35,
                'price_per_participant' => 175.00,
                'status' => 'scheduled',
                'booking_reference' => 'HB-RM-' . date('Ymd', strtotime($date)),
                'notes' => 'Resource Management training session - ' . $date,
            ]);
        }

        echo "Hall bookings created successfully!\n";
        echo "Healthcare: " . count($healthcareDates) . " sessions\n";
        echo "Gas Turbines: " . count($gasTurbineDates) . " sessions\n";
        echo "Electronic Maintenance: " . count($electronicDates) . " sessions\n";
        echo "Resource Management: " . count($resourceDates) . " sessions\n";
    }
}
