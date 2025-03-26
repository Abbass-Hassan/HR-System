<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds with exactly 2 rows.
     *
     * @return void
     */
    public function run()
    {
        // Today's date
        $targetDate = Carbon::parse('2025-03-25');

        // Row 1: User ID 1 - Present and clocked in/out
        DB::table('attendances')->insert([
            'user_id' => 1,
            'date' => $targetDate->format('Y-m-d'),
            'clock_in' => $targetDate->copy()->setTime(9, 0, 0),
            'clock_out' => $targetDate->copy()->setTime(17, 0, 0),
            'total_hours' => 8.00,
            'location_status' => 'OnSite',
            'status' => 'Present',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Row 2: User ID 2 - Late and still at work
        DB::table('attendances')->insert([
            'user_id' => 2,
            'date' => $targetDate->format('Y-m-d'),
            'clock_in' => $targetDate->copy()->setTime(9, 30, 0),
            'clock_out' => null,
            'total_hours' => 0, // Keep 0 if still at work
            'location_status' => 'Remote',
            'status' => 'Late',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('Inserted 2 attendance records for 2025-03-25.');
    }
}