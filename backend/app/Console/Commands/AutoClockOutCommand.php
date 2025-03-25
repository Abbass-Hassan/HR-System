<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;

class AutoClockOutCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:auto-clock-out';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically clock out users who forgot to clock out';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now()->toDateString();
        $standardEndTime = Carbon::parse($today . ' 18:00:00'); // 6 PM

        // Find all attendance records for today where user clocked in but not out
        $attendances = Attendance::whereDate('date', $today)
            ->whereNotNull('clock_in')
            ->whereNull('clock_out')
            ->get();

        $count = 0;
        foreach ($attendances as $attendance) {
            // Set clock-out time to 6 PM
            $attendance->clock_out = $standardEndTime;
            
            // Calculate total hours (from clock-in to 6 PM)
            $clockIn = Carbon::parse($attendance->clock_in);
            $totalHours = $standardEndTime->diffInMinutes($clockIn) / 60;
            $attendance->total_hours = $totalHours;
            
            // Mark as auto clock-out
            $attendance->is_auto_clockout = true;
            $attendance->save();
            
            $count++;
        }

        $this->info("Auto clocked out {$count} users.");
    }
}