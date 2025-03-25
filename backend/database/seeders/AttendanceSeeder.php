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
        $today = Carbon::now()->format('Y-m-d');
        
        // Row 1: User ID 1 - Present and clocked in/out
        DB::table('attendances')->insert([
            'user_id' => 1,
            'date' => $today,
            'clock_in' => Carbon::parse($today . ' 09:00:00'),
            'clock_out' => Carbon::parse($today . ' 17:00:00'),
            'total_hours' => 8.00,
            'location_status' => 'OnSite',
            'status' => 'Present',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        
        // Row 2: User ID 2 - Late and still at work
        DB::table('attendances')->insert([
            'user_id' => 2,
            'date' => $today,
            'clock_in' => Carbon::parse($today . ' 09:30:00'),
            'clock_out' => null,
            'total_hours' => Carbon::now()->diffInMinutes(Carbon::parse($today . ' 09:30:00')) / 60,
            'location_status' => 'Remote',
            'status' => 'Late',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        
        $this->command->info('Created exactly 2 attendance records.');
    }
}