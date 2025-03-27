<?php

namespace App\Services;

use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class LeaveService
{
    /**
     * Get leave statistics for a user
     * 
     * @param int $userId
     * @return array
     */
    public function getUserLeaveStatistics($userId)
    {
        $leaveBalance = $this->calculateUserLeaveBalance($userId);
        
        $pendingRequests = LeaveRequest::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();
            
        $upcomingLeave = LeaveRequest::where('user_id', $userId)
            ->where('status', 'approved')
            ->where('start_date', '>', Carbon::now())
            ->sum('total_days');
            
        return [
            'days_available' => $leaveBalance,
            'pending_requests' => $pendingRequests,
            'upcoming_days' => $upcomingLeave
        ];
    }
    
    /**
     * Calculate user's leave balance
     */
    private function calculateUserLeaveBalance($userId)
    {
        // Default annual leave balance for all employees
        $defaultBalance = 21;
        
        // Get total used leave days for this year
        $usedDays = LeaveRequest::where('user_id', $userId)
            ->where('status', 'approved')
            ->whereYear('start_date', Carbon::now()->year)
            ->sum('total_days');
            
        return $defaultBalance - $usedDays;
    }
    
    /**
     * Create a new leave request
     */
    public function createLeaveRequest(array $data, $userId)
    {
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $totalDays = $this->calculateBusinessDays($startDate, $endDate);
        
        $leaveBalance = $this->calculateUserLeaveBalance($userId);
        
        // Check if user has enough leave days
        if ($totalDays > $leaveBalance && $data['leave_type'] === 'vacation') {
            throw new \Exception('Insufficient leave balance. You have ' . $leaveBalance . ' days available.');
        }
        
        // Check for overlapping leave
        $hasOverlap = $this->checkForOverlap($userId, $startDate, $endDate);
        if ($hasOverlap) {
            throw new \Exception('You already have approved leave during this period.');
        }
        
        // Find an HR approver
        $approver = User::where('account_type', 'hr')->first();
        
        $leaveRequest = new LeaveRequest([
            'user_id' => $userId,
            'leave_type' => $data['leave_type'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_days' => $totalDays,
            'balance' => $leaveBalance - $totalDays,
            'requested_date' => Carbon::now(),
            'status' => 'pending',
            'reason' => $data['reason'] ?? $data['leave_type'],
            'approver_id' => $approver ? $approver->id : null
        ]);
        
        $leaveRequest->save();
        
        return $leaveRequest;
    }
    
    /**
     * Check for overlapping leave requests
     */
    private function checkForOverlap($userId, $startDate, $endDate)
    {
        return LeaveRequest::where('user_id', $userId)
            ->where('status', 'approved')
            ->where(function($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate])
                  ->orWhere(function($q2) use ($startDate, $endDate) {
                      $q2->where('start_date', '<=', $startDate)
                         ->where('end_date', '>=', $endDate);
                  });
            })->exists();
    }
    
    /**
     * Update leave request status
     */
    public function updateLeaveStatus($id, $status, $rejectionReason = null, $approverId)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        
        if ($leaveRequest->status !== 'pending') {
            throw new \Exception('Only pending leave requests can be ' . $status);
        }
        
        $leaveRequest->status = $status;
        $leaveRequest->approver_id = $approverId;
        $leaveRequest->approval_date = Carbon::now();
        
        if ($status === 'rejected' && $rejectionReason) {
            $leaveRequest->rejection_reason = $rejectionReason;
        }
        
        $leaveRequest->save();
        
        return $leaveRequest;
    }
    
    /**
     * Cancel a leave request
     */
    public function cancelLeaveRequest($id, $userId)
    {
        $leaveRequest = LeaveRequest::where('user_id', $userId)
            ->where('id', $id)
            ->firstOrFail();
        
        if ($leaveRequest->status !== 'pending') {
            throw new \Exception('Only pending leave requests can be cancelled');
        }
        
        $leaveRequest->status = 'cancelled';
        $leaveRequest->save();
        
        return $leaveRequest;
    }
    
    /**
     * Get leave history for a user
     */
    public function getUserLeaveHistory($userId, $count = 10, $page = 1, $status = null)
    {
        $query = LeaveRequest::where('user_id', $userId);
        
        if ($status) {
            $query->where('status', $status);
        }
        
        return $query->with(['approver'])
            ->latest()
            ->paginate($count, ['*'], 'page', $page);
    }
    
    /**
     * Calculate business days between two dates (excluding weekends)
     */
    public function calculateBusinessDays($startDate, $endDate)
    {
        $days = 0;
        $current = $startDate->copy();
        
        while ($current->lte($endDate)) {
            if ($current->isWeekday()) {
                $days++;
            }
            $current->addDay();
        }
        
        return $days;
    }
    
    /**
     * Get leave statistics for HR
     */
    public function getLeaveStatisticsForHR($year = null, $month = null)
    {
        $year = $year ?? Carbon::now()->year;
        
        $query = LeaveRequest::whereYear('start_date', $year)
            ->orWhereYear('end_date', $year);
            
        if ($month) {
            $query->where(function($q) use ($month) {
                $q->whereMonth('start_date', $month)
                  ->orWhereMonth('end_date', $month);
            });
        }
        
        $leaveByType = LeaveRequest::whereYear('start_date', $year)
            ->get()
            ->groupBy('leave_type')
            ->map(function($group) {
                return [
                    'count' => $group->count(),
                    'days' => $group->sum('total_days')
                ];
            });
            
        $leaveByStatus = LeaveRequest::whereYear('start_date', $year)
            ->get()
            ->groupBy('status')
            ->map(function($group) {
                return $group->count();
            });
            
        $topLeaveUsers = [];
        $leaveByUser = LeaveRequest::with('user')
            ->whereYear('start_date', $year)
            ->where('status', 'approved')
            ->get()
            ->groupBy('user_id');
            
        foreach ($leaveByUser as $userId => $requests) {
            $user = $requests->first()->user;
            if ($user) {
                $topLeaveUsers[] = [
                    'user_id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'total_days' => $requests->sum('total_days')
                ];
            }
        }
        
        usort($topLeaveUsers, function($a, $b) {
            return $b['total_days'] <=> $a['total_days'];
        });
        $topLeaveUsers = array_slice($topLeaveUsers, 0, 5);
        
        $currentMonth = Carbon::now()->month;
        $currentMonthName = Carbon::now()->format('F');
        $currentMonthLeave = LeaveRequest::whereYear('start_date', $year)
            ->whereMonth('start_date', $currentMonth)
            ->where('status', 'approved')
            ->count();
        
        return [
            'leave_by_type' => $leaveByType,
            'leave_by_status' => $leaveByStatus,
            'top_leave_users' => $topLeaveUsers,
            'current_month' => [
                'name' => $currentMonthName,
                'count' => $currentMonthLeave
            ],
            'year' => $year
        ];
    }
}