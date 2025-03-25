<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;

class MarkAbsentCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:mark-absent';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark users as absent if they have not clocked in by noon';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now()->toDateString();
        
        // Get all active users
        $users = User::where('status', 'active')->get();
        
        $count = 0;
        foreach ($users as $user) {
            // Check if user already has an attendance record for today
            $attendance = $user->attendances()
                ->whereDate('date', $today)
                ->first();
            
            if (!$attendance) {
                // Create absent record
                Attendance::create([
                    'user_id' => $user->id,
                    'date' => $today,
                    'status' => 'absent',
                ]);
                
                $count++;
            }
        }

        $this->info("Marked {$count} users as absent.");
    }
}