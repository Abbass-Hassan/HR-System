<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\AutoClockOutCommand::class,
        Commands\MarkAbsentCommand::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Mark users as absent at 12 PM
        $schedule->command('attendance:mark-absent')
                ->dailyAt('12:00')
                ->timezone('Asia/Riyadh'); // Adjust timezone as needed
        
        // Auto clock out users at 10 PM
        $schedule->command('attendance:auto-clock-out')
                ->dailyAt('22:00')
                ->timezone('Asia/Riyadh'); // Adjust timezone as needed
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}