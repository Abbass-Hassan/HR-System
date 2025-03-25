<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * Clock in the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function clockIn(Request $request)
    {
        $user = Auth::user();
        $now = Carbon::now();
        $today = $now->toDateString();
        
        // Check if already clocked in today
        $existingAttendance = $user->todayAttendance;
        if ($existingAttendance && $existingAttendance->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked in today.'
            ], 400);
        }
        
        // Check if it's too late to clock in (after 12 PM)
        if ($now->hour >= 12) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot clock in after 12 PM. Please try again tomorrow.'
            ], 400);
        }
        
        // Determine status (late if after 9 AM)
        $status = ($now->hour > 9 || ($now->hour == 9 && $now->minute > 0)) ? 'late' : 'present';
        
        // Create or update attendance record
        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'clock_in' => $now,
                'status' => $status,
                'location_status' => 'on-site', // Default or can be provided in request
            ]
        );
        
        // Update user status to active
        $user->status = 'active';
        $user->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Clocked in successfully',
            'data' => [
                'attendance' => $attendance,
                'status' => $status
            ]
        ]);
    }
    
    /**
     * Clock out the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function clockOut(Request $request)
    {
        $user = Auth::user();
        $now = Carbon::now();
        
        // Check if clocked in today
        $attendance = $user->todayAttendance;
        if (!$attendance || !$attendance->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'You have not clocked in today.'
            ], 400);
        }
        
        // Check if already clocked out
        if ($attendance->clock_out) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked out today.'
            ], 400);
        }
        
        // Standard end time (6 PM)
        $endTime = Carbon::createFromTimeString('18:00:00');
        
        // Calculate total hours worked
        $clockIn = Carbon::parse($attendance->clock_in);
        $clockOut = $now;
        $totalHours = $clockOut->diffInMinutes($clockIn) / 60;
        
        // Calculate overtime (if after 6 PM)
        $overtime = 0;
        if ($now->hour >= 18) {
            $overtime = $now->diffInMinutes($endTime) / 60;
        }
        
        // Update attendance record
        $attendance->clock_out = $now;
        $attendance->total_hours = $totalHours;
        $attendance->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Clocked out successfully',
            'data' => [
                'attendance' => $attendance,
                'total_hours' => $totalHours,
                'overtime' => $overtime
            ]
        ]);
    }
    
    /**
     * Get today's attendance status for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStatus()
    {
        $user = Auth::user();
        $today = Carbon::now()->toDateString();
        
        $attendance = $user->todayAttendance;
        
        if (!$attendance) {
            $status = 'Not clocked in';
            $canClockIn = Carbon::now()->hour < 12;
            
            return response()->json([
                'success' => true,
                'status' => $status,
                'can_clock_in' => $canClockIn,
                'can_clock_out' => false
            ]);
        }
        
        $canClockOut = $attendance->clock_in && !$attendance->clock_out;
        
        return response()->json([
            'success' => true,
            'attendance' => $attendance,
            'status' => $attendance->status,
            'can_clock_in' => false,
            'can_clock_out' => $canClockOut
        ]);
    }
}